import {ElMessage} from "element-plus";
// @ts-ignore
import EditorBarFunc, {EditorBar, EditorBarChange} from "@/components/EditorBarFunc";
import {Gradient} from "@/components/reuseable/Gradient";
import {LinkCanvasBarToListView} from "@/components/LinkCanvasBarToListView";
import {AppFuncTs} from "@/AppFunc";
import PathFunc, {PathChange} from "@/components/PathFunc";
import {NoteListFuncTs} from "@/components/NoteListFuncTs";
import {ReviewPartFunc} from "@/components/ReviewPartFunc";
import {NoteContentData} from "@/components/NoteCanvasFunc";
import {bus, bus_events} from "@/bus";
import {_ReviewPartSyncAnki} from "@/components/ReviewPartSyncAnki";

export module NoteCanvasTs{
    export class DragBarHelper{
        update_cnt=0;
        update_moving_obj_pos(canvas:any) {
            this.update_cnt++;
            const bar_data = canvas.editor_bars[canvas.moving_obj.ebid];
            console.log("update_moving_obj_pos get_content_origin_pos");
            const origin_pos = canvas.get_content_origin_pos();
            //   var bar_pos = this.get_moving_obj_pos();

            const dx =
                canvas.mouse_recorder.mouse_cur_x -
                origin_pos.x -
                canvas.moving_obj.drag_on_x;// / canvas.scale;
            const dy =
                canvas.mouse_recorder.mouse_cur_y -
                origin_pos.y -
                canvas.moving_obj.drag_on_y;// / canvas.scale;
            //   console.log("canvas dx dy", dx, dy, bar_pos);
            canvas.editor_bar_set_new_pos(
                canvas.moving_obj.ebid,
                bar_data,
                dx / canvas.scale,
                dy / canvas.scale
            );
        }
        start_drag(NoteCanvasFunc:any,canvas:any,event:MouseEvent,eb:any){
            const ebpos=canvas.editor_bar_manager.get_editor_bar_client_pos(eb.ebid);
            // console.log(ebpos)

            //点下时记录鼠标与文本块的相对坐标
            eb.drag_on_x=event.clientX-ebpos.x
            eb.drag_on_y=event.clientY-ebpos.y

            this.update_cnt=0;
            canvas.mouse_recorder.call_before_move(
                event.clientX,
                event.clientY
                //   event.screenX, event.screenY
            );
            // event.stopPropagation(); //阻止传递到上层，即handle_mouse_down
            if (canvas.cursor_mode === "拖拽") {
                console.log("开始拖拽")
                if(canvas.editor_bar_manager.corner_drag_helper==null){
                    canvas.moving_obj = eb;
                }
            } else if (canvas.cursor_mode === "连线") {
                const bar_data = canvas.editor_bars[eb.ebid];
                canvas.line_connect_helper.begin_connect_from_canvaspos(
                    NoteCanvasFunc,
                    canvas,
                    bar_data.pos_x,
                    bar_data.pos_y,
                    eb.ebid
                );
            }
        }
        end_drag(canvas:any){
            // console.log("end_drag",canvas.moving_obj)

            if(canvas.moving_obj!=null){
                canvas.moving_obj = null;
                // console.log(" end_drag", canvas.moving_obj )
                if(this.update_cnt>0){
                    canvas.content_manager.
                    backend_editor_bar_change_and_save(
                        canvas.context,canvas,
                        new EditorBarFunc.EditorBarChange(
                            EditorBarFunc.EditorBarChangeType.Move,
                            null,
                        )
                    )
                    canvas.content_manager
                        .backend_path_change_and_save(
                            canvas.context,canvas,
                            new PathFunc.PathChange(
                                PathFunc.PathChangeType.MoveSome,
                                null,null
                            )
                        )
                    // canvas.storage.save_all()
                }
            }
        }
    }
    export class PartOfNoteContentData{
        //复习的卡片组信息
        review_card_set_man=new ReviewPartFunc.CardSetManager()
        //同步到anki的变更的序列化数组
        sync_anki_serialized="[]"
    }
    export class ContentManager{//由canvas持有
        cur_note_id="-1"
        linkBarToListView=new LinkCanvasBarToListView.LinkBarToListView()
        part_of_storage_data:null|PartOfNoteContentData=null

        //在reviewpart初始化canvas时设置
        reviewing_state?:ReviewPartFunc.ReviewingState

        static from_canvas(canvas:any):ContentManager{
            return canvas.content_manager
        }

        /**@param data {NoteContentData}
         *@param noteid {string}
         * */
        reset(canvas:any){
            canvas.non_empty_chunks= {
                "0,0": 0,
            }
            canvas.moving_obj= null

            canvas.editing_editor_bar= null
            canvas.editing_editor_bar_id= -1

            canvas.connecting_path=null
        }
        first_load_set(noteid:string,canvas:any,data:NoteContentData){
            console.log("first_load_set",data);
            canvas.next_editor_bar_id=data.next_editor_bar_id
            canvas.paths=data.paths
            canvas.editor_bars=data.editor_bars
            this.part_of_storage_data=data.part
            if(!this.part_of_storage_data){
                this.part_of_storage_data=new PartOfNoteContentData()
            }
            this.reset(canvas)
            canvas.chunk_helper.first_calc_chunks(canvas)
            this.cur_note_id=noteid

            bus_events.events.note_canvas_data_loaded.call(canvas)
        }
        _backend_set_curnote_newedit_flag(ctx:AppFuncTs.Context){
            const nlman= ctx.get_notelist_manager()
            if(nlman){
                //设置标志，后续扫描到即进行保存
                nlman.pub_set_note_newedited_flag(this.cur_note_id)
            }
        }
        _backend_save_mode_choose(ctx:AppFuncTs.Context,ifbind:()=>void,ifnotbind:()=>void){
            const nconf=NoteListFuncTs.get_note_config_info(
                NoteListFuncTs.get_note_list_from_ctx(ctx).notelist_manager,this.cur_note_id)
            if(nconf) {
                // eslint-disable-next-line no-empty
                if (nconf.bind_file) {
                    ifbind()
                } else {
                    ifnotbind()
                }
            }
        }
        /**@param bar {EditorBarFunc.EditorBar}
         **/
        backend_add_editor_bar_and_save(ctx:AppFuncTs.Context,canvas:any,bar:EditorBar){
            console.log("backend_add_editor_bar_and_save",canvas,bar)
            canvas.editor_bars[
                canvas.next_editor_bar_id
                ]=(bar);
            canvas.next_editor_bar_id++;
            this._backend_save_mode_choose(ctx,()=>{
                ctx.storage_manager.memory_holder.hold_note(this.cur_note_id,NoteContentData.of_canvas(canvas))
                // ctx.storage_manager.buffer_save_note_editor_bars(this.cur_note_id,canvas.editor_bars);
                // ctx.storage_manager.buffer_save_note_next_editor_bar_id(this.cur_note_id,canvas.next_editor_bar_id)
                this._backend_set_curnote_newedit_flag(ctx);
            },()=>{
                ctx.storage_manager.memory_holder.hold_note(this.cur_note_id,NoteContentData.of_canvas(canvas))
                this._backend_set_curnote_newedit_flag(ctx);
                // ctx.storage_manager.buffer_save_note_editor_bars(this.cur_note_id,canvas.editor_bars);
                // ctx.storage_manager.buffer_save_note_next_editor_bar_id(this.cur_note_id,canvas.next_editor_bar_id)
            })
            console.log("backend_add_editor_bar_and_save");
        }

        /**@param change {EditorBarFunc.EditorBarChange}
         *
         **/
        // eslint-disable-next-line no-unused-vars
        backend_editor_bar_change_and_save(ctx:AppFuncTs.Context,canvas:any,change:EditorBarChange){
            console.log("backend_editor_bar_change_and_save");
            // if(change.type==EditorBarFunc.EditorBarChangeType.)
            this._backend_save_mode_choose(ctx,()=>{
                ctx.storage_manager.memory_holder.hold_note(this.cur_note_id,NoteContentData.of_canvas(canvas))
                // ctx.storage_manager.buffer_save_note_editor_bars(this.cur_note_id,canvas.editor_bars);
                this._backend_set_curnote_newedit_flag(ctx);
            },()=>{
                ctx.storage_manager.memory_holder.hold_note(this.cur_note_id,NoteContentData.of_canvas(canvas))
                this._backend_set_curnote_newedit_flag(ctx);
                // ctx.storage_manager.buffer_save_note_editor_bars(this.cur_note_id,canvas.editor_bars);
            })
        }

        /**@param change {PathFunc.PathChange}
         **/
        // eslint-disable-next-line no-unused-vars
        backend_path_change_and_save(ctx:AppFuncTs.Context,canvas:any,change:PathChange){
            console.log("backend_path_change_and_save");
            this._backend_save_mode_choose(ctx,()=>{
                ctx.storage_manager.memory_holder.hold_note(this.cur_note_id,NoteContentData.of_canvas(canvas))
                // ctx.storage_manager.buffer_save_note_paths(this.cur_note_id,canvas.paths);
                this._backend_set_curnote_newedit_flag(ctx);
            },()=>{
                ctx.storage_manager.memory_holder.hold_note(this.cur_note_id,NoteContentData.of_canvas(canvas))
                this._backend_set_curnote_newedit_flag(ctx);
                // ctx.storage_manager.memory_holder.hold_note(this.cur_note_id,)
                // ctx.storage_manager.buffer_save_note_paths(this.cur_note_id,canvas.paths);
            })
        }
    }
    export class NoteCanvasStateTs{
        gradient_scroll=new Gradient.Common()
    }
    export module EditorBar{
        export const get_editor_bar_data=(canvas:object,editor_bar_id:string)=>{
            // @ts-ignore
            if(editor_bar_id in canvas.editor_bars){
                // @ts-ignore
                return canvas.editor_bars[editor_bar_id]
            }
            return null;
        }
    }
    export module UiData{
        export const scroll_range_rec=(canvas:any)=>{
            return canvas.$refs.range_ref.getBoundingClientRect()
        }
        export const canvas_orgin_client_pos=(canvas:any)=>{
            return canvas.get_content_origin_pos()
        }
    }
    export module UiOperation{
        export module DomOperation{
            export const scroll_move=(canvas:any,dx:number,dy:number)=>{
                canvas.state_ts.gradient_scroll.start_walk(
                    [canvas.$refs.range_ref.scrollLeft,canvas.$refs.range_ref.scrollTop],
                    [canvas.$refs.range_ref.scrollLeft+dx,canvas.$refs.range_ref.scrollTop+dy],
                    10,(nums:number[])=>{
                        canvas.$refs.range_ref.scrollLeft=nums[0]
                        canvas.$refs.range_ref.scrollTop=nums[1]
                    }
                )
                // canvas.$refs.range_ref.scrollLeft += dx;
                // canvas.$refs.range_ref.scrollTop+=dy;
            }
        }
        export const final_set_scale=(canvas:any,scale:number,mouse_event:MouseEvent)=>{
            if(canvas.$refs.range_ref){
                const range_rec = canvas.$refs.range_ref.getBoundingClientRect();
                //缩放之后要修改滚动偏移
                const scale_beginx=range_rec.left
                    -canvas.$refs.range_ref.scrollLeft
                    +canvas.edge_size_w;
                const scale_beginy=range_rec.top
                    -canvas.$refs.range_ref.scrollTop
                    +canvas.edge_size_h;
                const msbx=mouse_event.clientX-scale_beginx
                const msby=mouse_event.clientY-scale_beginy

                canvas.$refs.range_ref.scrollLeft-=((msbx)/scale- (msbx)/canvas.scale)*scale;
                canvas.$refs.range_ref.scrollTop-=((msby)/scale- (msby)/canvas.scale)*scale;
                // console.log(mouse_event.clientX,scale_beginx)

                // canvas.$refs.range_ref.scrollLeft+=(mouse_event.clientX-scale_beginx)*(canvas.scale-scale)
                // canvas.$refs.range_ref.scrollTop-=(mouse_event.clientY-scale_beginy)*(canvas.scale-scale)
                //
                canvas.scale = scale;
            }

            // x:
            //     range_rec.left //滚动显示范围边界
            //     - canvas.$refs.range_ref.scrollLeft//滚动偏移量
            //     +canvas.edge_size_w +
            //     canvas.padding_add_left * canvas.scale,
            //         y:
            // range_rec.top -
            // this.$refs.range_ref.scrollTop +
            // this.edge_size_h +
            // this.padding_add_up * this.scale,
        }
        export const locate_editor_bar=(canvas:any, editor_bar_id:string)=>{
            console.log("locate_editor_bar",editor_bar_id)
            const bar_data=EditorBar.get_editor_bar_data(canvas,editor_bar_id)

            const locate=(bar_data:EditorBar)=>{

                const range_rec = UiData.scroll_range_rec(canvas) ;

                //区域中心 client坐标
                const mid_y = (range_rec.top + range_rec.bottom) / 2;
                const mid_x = (range_rec.left + range_rec.right) / 2;

                const origin_pos = UiData.canvas_orgin_client_pos(canvas);
                const bar_client_pos={
                    x:origin_pos.x+(bar_data.pos_x+(bar_data.width)/2)*canvas.scale,
                    y:origin_pos.y+(bar_data.pos_y+(bar_data.height)/2)*canvas.scale
                }
                const dx = bar_client_pos.x- mid_x;
                const dy = bar_client_pos.y-mid_y;
                DomOperation.scroll_move(canvas,dx,dy)

            }

            if(bar_data){
                console.log("add_editor_bar");
                locate(bar_data)
            }else{
                ElMessage({
                    message: '没有在脑图中找到对应的板块',
                    type: 'warning',
                })
            }
        }
    }
}