import EditorBarFunc, {EditorBar, EditorBarChange} from "@/components/EditorBarFunc";
import {_PaUtilTs} from "@/3rd/pa_util_ts";
import PathFunc from "@/components/PathFunc";

export namespace EditorBarTs{
    export const CursorMode={
        choose:'选择',
        drag:'拖拽',
        conline:'连线'
    }
    export class EditorBarManager{
        canvas:any=null
        corner_drag_helper=null
        ebid_to_ebcomp:any={}//ebid->1
        constructor(canvas:any) {
            this.canvas=canvas;
        }

        //选择功能-->
        focused_ebids:any={}//选中的editor bar id
        focus_add(ebid:string){
            this.focused_ebids[ebid]=1
        }
        focus_swap(ebid:string){
            if(ebid in this.focused_ebids){
                this.focus_del(ebid)
            }else{
                this.focus_add(ebid)
            }
        }
        focus_del(ebid:string){
            if(ebid in this.focused_ebids){
                delete this.focused_ebids[ebid]
            }
        }
        focus_clear(){
            this.focused_ebids={}
        }
        focused_cnt():number{
            return Object.keys(this.focused_ebids).length
        }
        focus_setnewpos_with_one(ebid:string,
                                 x:number,
                                 y:number){
            if(!(ebid in this.focused_ebids)){
                console.error("ebid not in focused")
            }
            const canvas=this.canvas
            const ebdata= this.get_editor_bar_data_by_ebid(ebid)
            const delta=this.set_new_pos(
                ebid,ebdata,
                x, y
                // ebid,eb,x,y
            );
            const focusedkeys=Object.keys(this.focused_ebids)
            focusedkeys.forEach((v,i,)=>{
                if(v!=ebid){
                    const other=this.get_editor_bar_data_by_ebid(v)
                    this.set_new_pos(v,other,other.pos_x+delta.x,other.pos_y+delta.y)
                }
            })
        }
        select_click_check(event:MouseEvent,ebcomp:any){
            // if(this.canvas.cursor_mode==CursorMode.choose
            //     ||this.canvas.cursor_mode==CursorMode.drag
            // ){
            //     if(!event.shiftKey){
            //         this.focus_clear()
            //     }
            //     this.focused_ebids[ebcomp.ebid]=1
            //
            //     console.log("select_click_check",this.focused_ebids)
            // }
        }

        editor_bar_comp_mounted(ebcomp:any){
            this.ebid_to_ebcomp[ebcomp.ebid]=ebcomp
        }
        delete_one(editor_bar:any){
            this.canvas.line_connect_helper.remove_bar_paths(
                this.canvas,editor_bar.ebid
            )
            delete this.canvas.editor_bars[editor_bar.ebid]
            this.canvas.context.storage_manager
                .buffer_save_note_editor_bars(this.canvas.content_manager.cur_note_id,this.canvas.editor_bars)
            this.canvas.context.storage_manager
                .buffer_save_note_paths(this.canvas.content_manager.cur_note_id,this.canvas.paths);
            // console.log("delete one",editor_bar)
        }
        add_if_no(){
            if(this.canvas.editor_bars.length===0){
                this.add_editor_bar(
                    this.new_editor_bar(0, 0)
                );
            }
        }
        get_editor_bar_client_pos(ebid:string){
            const op:any=this.canvas.get_content_origin_pos();
            const eb_data:any=this.canvas.editor_bars[ebid];
            return {
                x:op.x+eb_data.pos_x*this.canvas.scale,
                y:op.y+eb_data.pos_y*this.canvas.scale,
            }
        }
        get_editor_bar_data_by_ebid(ebid:string):EditorBar{
            return this.canvas.editor_bars[ebid]
        }
        get_editor_bar_rect_by_ebid(ebid:string):_PaUtilTs.Rect{
            const eb=this.get_editor_bar_data_by_ebid(ebid)
            return new _PaUtilTs.Rect(eb.pos_x,eb.pos_y,eb.width,eb.height)
        }
        new_editor_bar(px:number,py:number):EditorBar{
            return new EditorBar(px,py)
            // {
            //     pos_x: px,
            //     pos_y: py,
            //     width:150,
            //     height:150,
            //     content:"",
            //     conns: [],
            // }
        }
        /**@param bar {EditorBar}
         **/
        add_editor_bar(bar:any){
            const canvas=this.canvas
            canvas.content_manager.backend_add_editor_bar_and_save(canvas.context,
                canvas,bar);


            const ck = canvas.chunk_helper.calc_chunk_pos(bar.pos_x, bar.pos_y);
            canvas.chunk_helper.add_new_2chunks(canvas.non_empty_chunks, ck);
            canvas.change_padding(
                canvas.chunk_helper.chunk_min_y * -400,
                canvas.chunk_helper.chunk_max_y * 400,
                canvas.chunk_helper.chunk_max_x * 300,
                canvas.chunk_helper.chunk_min_x * -300
            );
            // this.canvas.storage.save_bar();
        }
        add_editor_bar_in_center(canvas:any){
            console.log("add_editor_bar");
            const range_rec = canvas.$refs.range_ref.getBoundingClientRect();

            //区域中心 client坐标
            const mid_y = (range_rec.top + range_rec.bottom) / 2;
            const mid_x = (range_rec.left + range_rec.right) / 2;

            const origin_pos = canvas.get_content_origin_pos();
            const px = mid_x - origin_pos.x;
            const py = mid_y - origin_pos.y;
            const new_bar =
                canvas.editor_bar_manager.new_editor_bar(
                    px / canvas.scale,
                    py / canvas.scale)
            this.add_editor_bar(new_bar);
            // canvas.editor_bars.push(new_bar);
        }
        copy_editor_bar_data__except_conn(from:EditorBar,to:EditorBar){
            to.pos_x=from.pos_x
            to.pos_y=from.pos_y
            to.width=from.width
            to.height=from.height
            to.content=from.content
        }
        copy_editor_bar_left_side(canvas:any,ebid:string){
            const ebdata=this.get_editor_bar_data_by_ebid(ebid)
            const new_bar =
                canvas.editor_bar_manager.new_editor_bar(
                    ebdata.pos_x,
                    ebdata.pos_y)
            this.copy_editor_bar_data__except_conn(ebdata,new_bar)
            new_bar.pos_x-=new_bar.width+10;
            this.add_editor_bar(new_bar);
        }
        //return with change
        set_new_pos(ebid:string, eb:any, x:number, y:number):_PaUtilTs.Vec2D{
            const old_ck = this.canvas.chunk_helper.calc_chunk_pos(eb.pos_x, eb.pos_y);
            const delta=new _PaUtilTs.Pos2D(
                x-eb.pos_x,
                y-eb.pos_y
            )
            eb.pos_x = x;
            eb.pos_y = y;
            this.canvas.line_connect_helper.bar_move(this.canvas, ebid);
            const ck = this.canvas.chunk_helper.calc_chunk_pos(x, y);
            if (old_ck !== ck) {
                console.log("ck", ck);

                this.canvas.chunk_helper.move_chunk(this.canvas.non_empty_chunks, old_ck, ck);
                console.log(this.canvas.non_empty_chunks);
                this.canvas.change_padding(
                    this.canvas.chunk_helper.chunk_min_y * -400,
                    this.canvas.chunk_helper.chunk_max_y * 400,
                    this.canvas.chunk_helper.chunk_max_x * 300,
                    this.canvas.chunk_helper.chunk_min_x * -300
                );
                console.log(
                    this.canvas.padding_add_up,
                    this.canvas.padding_add_down,
                    this.canvas.padding_add_left,
                    this.canvas.padding_add_right
                );
            }
            return delta
        }
        corner_drag_start(drag_helper:any){
            // eslint-disable-next-line no-empty
            if(drag_helper){
                console.log(drag_helper)
                console.log(this)
                this.corner_drag_helper=drag_helper
            }
        }
        content_change(ebid:string,content:any){
            this.canvas.editor_bars[ebid].content=content;
            this.canvas.content_manager.backend_editor_bar_change_and_save(
                this.canvas.context,this.canvas,
                new EditorBarChange(
                    EditorBarFunc.EditorBarChangeType.ContentChange,
                    null,
                )
            )
            // this.canvas.storage.save_bar();
        }
        on_mouse_move(event:MouseEvent,mouse_rec:any,scale:number){
            if(this.corner_drag_helper&&event){
                // @ts-ignore
                const data=this.get_editor_bar_data_by_ebid(this.corner_drag_helper.editor_bar.ebid);
                const delta=mouse_rec.get_delta()
                data.width+=delta.dx/scale;
                data.height+=delta.dy/scale;
            }
        }
        on_mouse_up(){
            this.corner_drag_helper=null
        }

    }
    export class DragBarHelper{
        update_cnt=0;
        dragging=false;
        // cb=(moved:boolean,updown_dt:number)=>{}
        _start_ms=0;
        mouse_last_pos=new _PaUtilTs.Pos2D(0,0)
        start_in_case3=false
        mouse_move_distance=0
        mouse_down_eb:any
        begin_focused=false;
        // _end_ms=0;
        update_moving_obj_pos(canvas:any) {
            const ebman=canvas.editor_bar_manager as EditorBarTs.EditorBarManager

            this.update_cnt++;
            // const bar_data = canvas.editor_bars[canvas.moving_obj.ebid];
            console.log("update_moving_obj_pos get_content_origin_pos");
            const origin_pos = canvas.get_content_origin_pos();
            //   var bar_pos = this.get_moving_obj_pos();

            const tarx =
                canvas.mouse_recorder.mouse_cur_x -
                origin_pos.x -
                canvas.moving_obj.drag_on_x;// / canvas.scale;
            const tary =
                canvas.mouse_recorder.mouse_cur_y -
                origin_pos.y -
                canvas.moving_obj.drag_on_y;// / canvas.scale;
            //   console.log("canvas dx dy", dx, dy, bar_pos);

            // canvas.editor_bar_manager.get_editor_bar_data_by_ebid()
            if(canvas.content_manager.linkBarToListView.is_linking){
                return;
            }
            const newp=new _PaUtilTs.Pos2D(
                canvas.mouse_recorder.mouse_cur_x
                ,canvas.mouse_recorder.mouse_cur_y)
            this.mouse_move_distance+=_PaUtilTs.Algrithms.distance_2p(newp,this.mouse_last_pos)
            this.mouse_last_pos=newp
            ebman.focus_setnewpos_with_one(canvas.moving_obj.ebid,
                tarx / canvas.scale,
                tary / canvas.scale
            )

            //
            // canvas.editor_bar_set_new_pos(
            //
            // );
        }

        start_drag(NoteCanvasFunc:any,canvas:any,event:MouseEvent,eb:any){
            const ebman=canvas.editor_bar_manager as EditorBarTs.EditorBarManager
            const ebid=eb.ebid as string
            this.mouse_down_eb=eb
            this.start_in_case3=false
            this.mouse_move_distance=0
            this.mouse_last_pos=new _PaUtilTs.Pos2D(event.clientX,event.clientY)

            //情况分析
            if(!(ebid in ebman.focused_ebids)){
                // 1.未选中，存在别的选中
                //   别的取消选中，当前选中，并拖拽
                if(!event.shiftKey){
                    if(ebman.focused_cnt()!=0){
                        ebman.focus_clear()
                        // ebman.focus_add(ebid)
                    }
                }
                this.begin_focused=false
                // 2.未选中，不存在别的选中
                //   当前选中，并拖拽
                ebman.focus_add(ebid)
            }else{
                this.begin_focused=true
                // 3.选中. 存在别的选中
                //   3.1.发生拖拽(update)。一起被拖拽
                //   3.2.未发生拖拽。点击操作（取消其他选择）
                if(ebman.focused_cnt()!=1){
                    this.start_in_case3=true;
                }
                // 4.选中，不存在别的选中
                //   拖拽
                // else{
                //
                // }
            }
            this._start_ms=_PaUtilTs.time_stamp_number()
            // this.cb=end_cb
            const ebcpos=canvas.editor_bar_manager.get_editor_bar_client_pos(eb.ebid);
            // console.log(ebpos)

            //点下时记录鼠标与文本块的相对坐标
            eb.drag_on_x=event.clientX-ebcpos.x
            eb.drag_on_y=event.clientY-ebcpos.y

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
        end_drag(event:MouseEvent,canvas:any){
            // console.log("end_drag",canvas.moving_obj)
            const end_ms=_PaUtilTs.time_stamp_number()

            if(canvas.moving_obj!=null){

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
                // console.log(this.mouse_move_distance)

                canvas.moving_obj = null;
            }
            if(this.mouse_down_eb&&this.mouse_move_distance<2){
                //有其他选中无拖拽，相当于点击
                const ebman=canvas.editor_bar_manager as EditorBarTs.EditorBarManager
                if(!event.shiftKey){
                    ebman.focus_clear()

                    ebman.focus_add(this.mouse_down_eb.ebid)
                }else{
                    if(this.begin_focused){
                        ebman.focus_del(this.mouse_down_eb.ebid)
                    }
                }
            }
            this.mouse_down_eb=null;
        }
    }
}