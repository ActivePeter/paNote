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
import {search} from "@/search";
import {_PaUtilTs} from "@/3rd/pa_util_ts";
import {EditorBarTs} from "@/components/EditorBarTs";

export module NoteCanvasTs{

    import MouseDownUpRecord = _PaUtilTs.MouseDownUpRecord;
    export class CanvasMouseDragEvent{
        static Types={
            down:1,
            move:2,
            up:3,
        }
        // cv_x=0
        // cv_y=0
        // event:MouseEvent
        constructor(
            public type:number,// type=-1 //1 down, 2 move, 3 up
            public event:MouseEvent,
            public cv_x:number,
            public cv_y:number) {
        }
    }
    enum CanvasMouseDragDownCallers{
        editor_bar,
        canvas_bg,
    }
    export class CanvasMouseDragRecorder{
        down_callers=CanvasMouseDragDownCallers
        state=-1 //1 down, 2 move, 3 up
        cbs:any={}//caller->cb()
        down_event:undefined|CanvasMouseDragEvent
        down_caller:undefined|CanvasMouseDragDownCallers
        listen(caller:CanvasMouseDragDownCallers,cb:(recorder:CanvasMouseDragRecorder,
                   event:CanvasMouseDragEvent)=>void){
            this.cbs[caller]=cb
        }
        unlisten(caller:CanvasMouseDragDownCallers){
            if(caller in this.cbs){
                delete this.cbs[caller]
            }
        }
        _call_cb(event:CanvasMouseDragEvent){
            if(this.down_caller&&this.down_caller in this.cbs){
                // console.log("CanvasMouseDragRecorder _call_cb")
                this.cbs[this.down_caller](this,event)
            }
        }


        //鼠标下落的触发为不同组件,需要组件主动调用
        down(canvas:NoteCanvasDataReacher,event:MouseEvent,
             downcaller:CanvasMouseDragDownCallers){
            // console.log("CanvasMouseDragRecorder","down")
            if(!(downcaller in this.cbs)){
                return
            }
            this.down_caller=downcaller
            const cman=canvas.get_content_manager()
            const cvpos=cman.pos_from_uipos_2_canvaspos(new _PaUtilTs.Pos2D(event.clientX,event.clientY))
            this.down_event=new CanvasMouseDragEvent(CanvasMouseDragEvent.Types.down,event,cvpos.x,cvpos.y)
            this._call_cb(this.down_event)
        }
        //canvas鼠标移动监听 调用
        move(canvas:NoteCanvasDataReacher,event:MouseEvent){
            const cman=canvas.get_content_manager()
            const cvpos=cman.pos_from_uipos_2_canvaspos(new _PaUtilTs.Pos2D(event.clientX,event.clientY))
            const drage=new CanvasMouseDragEvent(CanvasMouseDragEvent.Types.move,event,cvpos.x,cvpos.y)
            this._call_cb(drage)
        }
        //canvas鼠标抬起调用
        up(canvas:NoteCanvasDataReacher,event:MouseEvent){
            const cman=canvas.get_content_manager()
            const cvpos=cman.pos_from_uipos_2_canvaspos(new _PaUtilTs.Pos2D(event.clientX,event.clientY))
            const drage=new CanvasMouseDragEvent(CanvasMouseDragEvent.Types.up,event,cvpos.x,cvpos.y)
            this._call_cb(drage)
            this.down_caller=undefined
            this.down_event=undefined
        }
    }
    export class PartOfNoteContentData{
        //复习的卡片组信息
        review_card_set_man=new ReviewPartFunc.CardSetManager()
        //同步到anki的变更的序列化数组
        sync_anki_serialized="[]"
    }
    export class UserInteract{
        mouse_drag_recorder=new CanvasMouseDragRecorder()
        _recent_eb_mouse_down:undefined|MouseEvent
        _recent_mouse_move:undefined|MouseEvent
        canvas:NoteCanvasDataReacher
        set recent_eb_mouse_down(v:MouseEvent){
            this._recent_eb_mouse_down=v;
        }
        constructor(canvas:NoteCanvasDataReacher) {
            this.canvas=canvas
        }
        select_range_down_check_ok=(event:MouseEvent)=>{
            return event!=this._recent_eb_mouse_down;
        }
        event_canvas_move(){
            if (this._recent_mouse_move){
                this.mouse_drag_recorder.move(this.canvas,this._recent_mouse_move)
            }
        }
        event_mousedown_bg(event:MouseEvent){
            // console.log(this)
            this.mouse_drag_recorder.down(this.canvas,event,this.mouse_drag_recorder.down_callers.canvas_bg)
        }
        event_mouse_move(event:MouseEvent){
            this.mouse_drag_recorder.move(this.canvas,event)
            this._recent_mouse_move=event
        }
        event_mouse_up(event:MouseEvent){
            this._recent_mouse_move=undefined
            this.mouse_drag_recorder.up(this.canvas,event)
        }
    }
    export class ContentManager{//由canvas持有
        search_in_canvas=new search.SearchInCanvas()
        cur_note_id="-1"
        linkBarToListView=new LinkCanvasBarToListView.LinkBarToListView()
        part_of_storage_data:null|PartOfNoteContentData=null
        user_interact:UserInteract
        //在reviewpart初始化canvas时设置
        reviewing_state?:ReviewPartFunc.ReviewingState
        canvas:NoteCanvasDataReacher
        // canvas:any
        constructor(canvas:any) {
            this.canvas=canvas.data_reacher
            // console.log("new ContentManager",this.canvas)
            this.user_interact=new UserInteract(this.canvas)
        }
        static from_canvas(canvas:any):ContentManager{
            return canvas.content_manager
        }
        pos_from_uipos_2_canvaspos(pos:_PaUtilTs.Pos2D):_PaUtilTs.Pos2D{
            const canvas=this.canvas
            const origin_pos = canvas.get_content_origin_pos();
            //   var bar_pos = this.get_moving_obj_pos();

            const tarx =
                pos.x -
                origin_pos.x ;// / canvas.scale;
            const tary =
                pos.y -
                origin_pos.y ;
            return new _PaUtilTs.Pos2D(tarx/canvas.get_scale(),tary/canvas.get_scale())
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
            this.search_in_canvas.init_refs(canvas.editor_bars,canvas.editor_bar_manager)
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
            // console.log("backend_add_editor_bar_and_save",canvas,bar)
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
            // console.log("backend_add_editor_bar_and_save");
        }

        /**@param change {EditorBarFunc.EditorBarChange}
         *
         **/
        // eslint-disable-next-line no-unused-vars
        backend_editor_bar_change_and_save(ctx:AppFuncTs.Context,canvas:any,change:EditorBarChange){
            // console.log("backend_editor_bar_change_and_save");
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
            // console.log("backend_path_change_and_save");
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
    export class NoteCanvasDataReacher{
        notecanvas:any
        constructor(notecanvas:any) {
            this.notecanvas=notecanvas
        }
        static create(notecanvas:any):NoteCanvasDataReacher{
            return new NoteCanvasDataReacher(notecanvas);
        }
        get_scale(){
            return this.notecanvas.scale
        }
        get_editor_bars(){
            return this.notecanvas.editor_bars
        }
        get_paths(){
            return this.notecanvas.paths
        }
        get_next_editor_bar_id(){
            return this.notecanvas.next_editor_bar_id
        }
        get_editorbar_man():EditorBarTs.EditorBarManager{
            return this.notecanvas.editor_bar_manager
        }
        get_content_manager():ContentManager{
            return this.notecanvas.content_manager
        }
        get_content_origin_pos(){
            return this.notecanvas.get_content_origin_pos()
        }
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
            // console.log("locate_editor_bar",editor_bar_id)
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
                // console.log("add_editor_bar");
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