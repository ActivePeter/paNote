import {ElMessage} from "element-plus";
// @ts-ignore
import EditorBarFunc, {EditorBar, EditorBarChange} from "@/components/EditorBarFunc";
import {Gradient} from "@/components/reuseable/Gradient";
import {LinkCanvasBarToListView} from "@/components/LinkCanvasBarToListView";
import {AppFuncTs, AppRefsGetter} from "@/AppFunc";
import PathFunc, {PathChange} from "@/components/PathFunc";
import {NoteListFuncTs} from "@/components/NoteListFuncTs";
import {ReviewPartFunc} from "@/components/ReviewPartFunc";
// import {ChunkHelper} from "@/components/NoteCanvasFunc";
// import {N} from "@/note";
import {bus, bus_events} from "@/bus";
import {_ReviewPartSyncAnki} from "@/components/ReviewPartSyncAnki";
import {search} from "@/search";
import {_PaUtilTs} from "@/3rd/pa_util_ts";
import {EditorBarTs} from "@/components/EditorBarTs";
import {NoteOutlineTs} from "@/components/NoteOutlineTs";
import {note} from "@/note";
import EditorBarViewListFunc from "@/components/reuseable/EditorBarViewListFunc";
import NoteCanvasFunc, {PathStruct} from "@/components/NoteCanvasFunc";
import Util from "@/components/reuseable/Util";
import {User} from "@element-plus/icons-vue";
import {NoteLog} from "@/log";
import Path from "@/components/Path.vue";

export module NoteCanvasTs{
    export class ChunkHelper {
        chunk_max_x = 0;
        chunk_max_y = 0;
        chunk_min_x = 0;
        chunk_min_y = 0;
        // chunk_ts_mod
        non_empty_chunks:any={
            //ckkey->cnt
        }
        chunkchange=false
        constructor(public canvasp:NoteCanvasDataReacher) {
            // this.chunk_ts_mod=new NoteCanvasTs.CanvasChunkTs(this)
        }
        reset(){
            this.non_empty_chunks={}
        }
        add_new_2chunks(ck:string) {
            const non_empty_chunks=this.non_empty_chunks
            console.log("add_new_2chunks",ck)
            if (!(ck in non_empty_chunks)) {
                non_empty_chunks[ck] = 1
            } else {
                non_empty_chunks[ck]++;
            }
            this.recalc_chunk_range()
        }
        calc_chunk_pos(x:number, y:number) {
            let cx = 0, cy = 0;
            cx = Math.floor(x / 300);
            cy = Math.floor(y / 400);
            return cx + "," + cy
        }
        check_eb_chunk_change(ox:number,oy:number,x:number,y:number){
            const ock=this.calc_chunk_pos(ox,oy)
            const ck=this.calc_chunk_pos(x,y)
            if(ock!=ck){
                // console.log("eb chunk change",ock,ck)
                this.chunkchange=true
                this.move_chunk(ock,ck)
            }
        }
        if_chunkchange_then_recalc_range(){
            if(this.chunkchange){
                this.chunkchange=false
                this.recalc_chunk_range()
                this.update_canvas_chunkpadding()
            }
        }
        move_chunk(oldck:string, newck:string) {
            const non_empty_chunks=this.non_empty_chunks
            if (!(oldck in non_empty_chunks)) {
                console.log("no ck, not ok")
                return;
            }
            non_empty_chunks[oldck]--;
            if (non_empty_chunks[oldck] <= 0) {
                delete non_empty_chunks[oldck];
            }
            if (!(newck in non_empty_chunks)) {
                non_empty_chunks[newck] = 1;
            } else {

                non_empty_chunks[newck]++;
            }
            // this.recalc_chunk_range()
            // console.log(this)
        }
        recalc_chunk_range() {
            const non_empty_chunks=this.non_empty_chunks
            this.chunk_max_x = 0;
            this.chunk_max_y = 0;
            this.chunk_min_x = 0;
            this.chunk_min_y = 0;
            for (const key in non_empty_chunks) {
                const x_y = key.split(",")
                const x = parseInt(x_y[0]);
                const y = parseInt(x_y[1])
                if (x < this.chunk_min_x) {
                    this.chunk_min_x = x;
                } else if (x > this.chunk_max_x) {
                    this.chunk_max_x = x;
                }
                if (y < this.chunk_min_y) {
                    this.chunk_min_y = y;
                } else if (y > this.chunk_max_y) {
                    this.chunk_max_y = y;
                }
            }
        }
        first_calc_chunks(){
            const cm=this.canvasp.get_content_manager()
            console.log("first_calc_chunks")
            // eslint-disable-next-line no-unused-vars
            if(Object.values(cm.notehandle.content_data.editor_bars).length===0){
                this.recalc_chunk_range()
                this.update_canvas_chunkpadding()
                return;
            }
            for(const bar_ of Object.values(cm.notehandle.content_data.editor_bars)){
                const bar=bar_ as EditorBar
                // let bar=value;
                const ck = this.calc_chunk_pos(bar.pos_x, bar.pos_y);
                this.add_new_2chunks(ck);
            }
            this.update_canvas_chunkpadding()
        }
        update_canvas_chunkpadding(){
            this.canvasp.notecanvas.change_padding(
                this.chunk_min_y * -400,
                this.chunk_max_y * 400,
                this.chunk_max_x * 300,
                this.chunk_min_x * -300
            );
        }
    }
    // export class CanvasChunkTs{
    //     jschunkmod
    //     need_recalc_gui=false;
    //     constructor(jschunkmod:ChunkHelper) {
    //         this.jschunkmod=jschunkmod
    //     }
    //     calc_chunk_pos(x:number, y:number) :[number,number]{
    //         let cx = 0, cy = 0;
    //         cx = Math.floor(x / 300);
    //         cy = Math.floor(y / 400);
    //         return [cx ,cy]
    //     }
    //     same_2ckpos(pos1:[number,number],pos2:[number,number]):boolean{
    //         return pos1[0]==pos2[0]&&pos1[1]==pos2[1]
    //     }
    //     eb_change_pos(ox:number,oy:number,x:number,y:number){
    //         const ock=this.calc_chunk_pos(ox,oy)
    //         const ck=this.calc_chunk_pos(x,y)
    //         if(!this.same_2ckpos(ck,ock)){
    //             //扩大，则直接扩大
    //             //缩小，则不知道缩到哪，所以重新算
    //             this.need_recalc_gui=true
    //
    //         }
    //     }
    //     recalc_chunk_gui_if_need(){
    //         if(this.need_recalc_gui){
    //             this.need_recalc_gui=false
    //
    //         }
    //     }
    // }
    // import MouseDownUpRecord = _PaUtilTs.MouseDownUpRecord;
    import NoteContentData = note.NoteContentData;
    import NoteHandle = note.NoteHandle;
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
            const cvpos=cman.user_interact.pos_from_uipos_2_canvaspos(new _PaUtilTs.Pos2D(event.clientX,event.clientY))
            this.down_event=new CanvasMouseDragEvent(CanvasMouseDragEvent.Types.down,event,cvpos.x,cvpos.y)
            this._call_cb(this.down_event)
        }
        //canvas鼠标移动监听 调用
        move(canvas:NoteCanvasDataReacher,event:MouseEvent){
            const cman=canvas.get_content_manager()
            const cvpos=cman.user_interact.pos_from_uipos_2_canvaspos(new _PaUtilTs.Pos2D(event.clientX,event.clientY))
            const drage=new CanvasMouseDragEvent(CanvasMouseDragEvent.Types.move,event,cvpos.x,cvpos.y)
            this._call_cb(drage)
        }
        //canvas鼠标抬起调用
        up(canvas:NoteCanvasDataReacher,event:MouseEvent){
            const cman=canvas.get_content_manager()
            const cvpos=cman.user_interact.pos_from_uipos_2_canvaspos(new _PaUtilTs.Pos2D(event.clientX,event.clientY))
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

        //outline数据结构
        note_outline=new NoteOutlineTs.OutlineStorageStruct()
    }
    class LineConnectHelper {
        connecting_path:null|PathStruct=null
        path_set_pos(path:PathStruct,bx:number, by:number, ex:number, ey:number) {
            path.w = Math.abs(bx - ex)
            path.h = Math.abs(by - ey)
            path.ox = Math.min(ex, bx)
            path.oy = Math.min(ey, by)

            path.ex = ex - path.ox;
            path.ey = ey - path.oy;
            path.bx = bx - path.ox;
            path.by = by - path.oy;
            return path
        }
        path_change_end_pos(path:PathStruct,ex:number, ey:number) {
            this.path_set_pos(path,path.ox + path.bx, path.oy + path.by, ex, ey)
        }
        path_change_begin_pos(path:PathStruct,bx:number, by:number) {
            this.path_set_pos(path,bx, by, path.ox + path.ex, path.oy + path.ey)
        }
        remove_bar_paths(canvas:any,ebid:string){
            const bar_data = canvas.editor_bars[ebid]

            // 遍历所有连线
            for (const i in bar_data.conns) {
                const path_key = bar_data.conns[i]
                const p = canvas.paths[path_key]
                let other_bar_id=p.b_bar;
                if(p.b_bar===ebid){
                    other_bar_id=p.e_bar;
                }
                //移除对方方块对连线的存储
                Util.remove_one_in_arr(
                    canvas.editor_bars[other_bar_id].conns,path_key);
                //移除连线
                delete canvas.paths[path_key];
            }
            bar_data.conns=[]
        }
        bar_move(canvas:any, ebid:string) {
            const bar_data = canvas.editor_bars[ebid]
            // console
            for (const i in bar_data.conns) {
                // console.log(path)
                const path_key = bar_data.conns[i]
                const p = canvas.paths[path_key]
                if (p.e_bar == ebid) {
                    this.path_change_end_pos(p,bar_data.pos_x, bar_data.pos_y)
                } else if (p.b_bar == ebid) {
                    this.path_change_begin_pos(p,bar_data.pos_x, bar_data.pos_y)
                }
            }
        }
        stop_connect_if_not(){
            this.connecting_path=null
        }
        end_connect(ui:UserInteract, canvas_x:number, canvas_y:number, ebid:string) {
            if(!this.connecting_path){
                return
            }
            const notehandle=ui.canvas.get_content_manager().notehandle
            const paths=notehandle.content_data.paths
            this.path_change_end_pos(this.connecting_path,
                canvas_x, canvas_y,
            )

            this.connecting_path.e_bar = ebid;
            const bbar = this.connecting_path.b_bar
            const key1 = bbar + ',' + ebid
            if ((key1) in paths || (ebid + ',' + bbar) in paths || ebid == bbar) {
                this.connecting_path = null;
            } else {
                const log=AppFuncTs.appctx.logctx.get_log_by_noteid(notehandle.note_id)
                const rec=new NoteLog.Rec()
                rec.add_trans(new NoteLog.SubTrans.EbConn([[bbar,ebid]]))
                log.try_do_ope(rec,notehandle)
                log.set_store_flag_after_do()
                // paths[key1] = this.connecting_path;
                // console.log(
                //     "valid one", key1
                // )
                //
                // notehandle.content_data.editor_bars[bbar].conns.push(key1)
                // notehandle.content_data.editor_bars[ebid].conns.push(key1)

                // .content_manager.backend_path_change_and_save(
                //     canvas.context,canvas,
                //     new PathFunc.PathChange(
                //         PathFunc.PathChangeType.Add,
                //         null,
                //         null
                //     )
                // )
                // canvas.content_manager.backend_editor_bar_change_and_save(
                //     canvas.context,canvas,
                //     new EditorBarFunc.EditorBarChange(
                //         EditorBarFunc.EditorBarChangeType.LineConnect,
                //         null,
                //     ),
                // )
                // canvas.storage.save_all();
                // canvas.storage.save_paths();
            }
            this.connecting_path = null;
        }
        move_connect_if_connecting(NoteCanvasFunc:any, canvas:any, bclient_x:number, bclient_y:number) {
            if(this.connecting_path){
                const startp = NoteCanvasFunc.client_pos_2_canvas_item_pos(
                    canvas,
                    bclient_x,
                    bclient_y
                );
                this.path_change_end_pos(
                    this.connecting_path,
                    startp.x,
                    startp.y,
                );
            }
        }
        // begin_connect_from_clientpos(NoteCanvasFunc, canvas, bclient_x, bclient_y) {
        //     let startp = NoteCanvasFunc.client_pos_2_canvas_item_pos(
        //         canvas,
        //         bclient_x,
        //         bclient_y
        //     );
        //     canvas.connecting_path = new NoteCanvasFunc.PathStruct().set_pos(
        //         startp.x,
        //         startp.y,
        //         startp.x,
        //         startp.y
        //     );
        //     canvas.paths.push(canvas.connecting_path);
        // }
        begin_connect_from_canvaspos(NoteCanvasFunc:any, canvas:any, cx:number, cy:number, ebid:string) {
            // let startp = NoteCanvasFunc.client_pos_2_canvas_item_pos(
            //     canvas,
            //     bclient_x,
            //     bclient_y
            // );
            this.connecting_path =
                this.path_set_pos(new NoteCanvasFunc.PathStruct(),
                    cx, cy, cx, cy
                )


            this.connecting_path.b_bar = ebid
            // canvas.paths.push(canvas.connecting_path);
        }
    }
    export class PathJumpBtnState{
        pos
        constructor(
            public event:MouseEvent,
            public pathcomp:Path,
            ui:UserInteract) {
            this.pos=ui.pos_from_uipos_2_canvaspos(
                new _PaUtilTs.Pos2D(event.clientX,event.clientY)
            )
            const path=pathcomp.$props.path
            const bx=path.ox+path.bx
            const by=path.oy+path.by
            const ex=path.ox+path.ex
            const ey=path.oy+path.ey
            // this.pos.x=(bx+ex)/2
            // this.pos.y=(by+ey)/2
            const dx=ex-bx
            const dy=ey-by
            if(dx==0){
                this.pos.x=ex
            }else{
                const k=dy/dx
                const nx=(k*k*bx-k*(by-this.pos.y)+this.pos.x)/(k*k+1)
                const ny=k*(nx-bx)+by
                this.pos.x=nx
                this.pos.y=ny
            }
        }
    }
    export class UserInteract{
        //来自canvas的交互事件
        //界面相关的坐标换算
        //无数据操作，仅界面的一些操作
        mouse_drag_recorder=new CanvasMouseDragRecorder()
        _recent_eb_mouse_down:undefined|MouseEvent
        _recent_mouse_move:undefined|MouseEvent
        drag_bar_helper=new EditorBarTs.DragBarHelper()
        line_connect_helper=new LineConnectHelper()
        pathjumpbtn_state:null|PathJumpBtnState=null


        canvas:NoteCanvasDataReacher
        set recent_eb_mouse_down(v:MouseEvent){
            this._recent_eb_mouse_down=v;
        }
        constructor(canvas:NoteCanvasDataReacher) {
            this.canvas=canvas
        }
        hide_pathjumpbtn(){
            this.pathjumpbtn_state=null
        }
        event_pathmouse(event:MouseEvent,pathcomp:Path){
            // if(!this.pathjumpbtn_state)
            {
                this.pathjumpbtn_state=new PathJumpBtnState(
                    event,pathcomp,this
                )
            }
        }
        pathjump(to_begin:boolean,state:PathJumpBtnState){
            console.log("pathjump")
            if(to_begin){
                this.locate_editor_bar(state.pathcomp.$props.path.b_bar)
            }else{
                this.locate_editor_bar(state.pathcomp.$props.path.e_bar)
            }
        }
        range_ref_getBoundingClientRect():ClientRect{
            return this.canvas.getref_range_ref().getBoundingClientRect()
        }
        select_range_down_check_ok=(event:MouseEvent)=>{
            return event!=this._recent_eb_mouse_down;
        }

        event_canvas_move(){
            if (this._recent_mouse_move){
                this.mouse_drag_recorder.move(this.canvas,this._recent_mouse_move)
            }
        }
        event_mousedown_range(event:MouseEvent){
            const canvas=this.canvas.notecanvas
            //   let cp = this.get_canvas_client_pos();
            canvas.mouse_recorder.call_before_move(
                event.clientX, // + cp.x,
                event.clientY //+ cp.y
                //   event.screenX, event.screenY
            );
            // console.log("note canvase mouse down");
            //   this.dragging = true;
            canvas.canvas_mouse_drag_helper.start_drag_canvas();
        }
        event_mousedown_eb(event:MouseEvent,ebcomp:any){
            this.canvas.get_editorbar_man().event_mousedown(
                event,ebcomp)
        }
        event_mousedown_bg(event:MouseEvent){
            // console.log(this)
            this.mouse_drag_recorder.down(this.canvas,event,this.mouse_drag_recorder.down_callers.canvas_bg)
        }
        event_mouse_move(event:MouseEvent){
            this.mouse_drag_recorder.move(this.canvas,event)
            this._recent_mouse_move=event

            {
                const canvas=this.canvas.notecanvas
                //有按键按下
                // let cp = this.get_canvas_client_pos();
                canvas.mouse_recorder.update_pos_on_move(
                    event.clientX, //+ cp.x,
                    event.clientY //+ cp.y
                    //   event.screenX, event.screenY
                );
                // let delta = this.mouse_recorder.get_delta();

                //拖拽画布
                canvas.canvas_mouse_drag_helper.on_drag(canvas, event);



                //拖拽文本块
                if (canvas.moving_obj != null) {
                    this.drag_bar_helper.update_moving_obj_pos(canvas);
                    //   let bar_data = this.editor_bars[this.moving_obj.ebid];

                    //   this.editor_bar_set_new_pos(
                    //     bar_data,
                    //     bar_data.pos_x + delta.dx / this.scale,
                    //     bar_data.pos_y + delta.dy / this.scale
                    //   );
                    //   console.log("bar_data", bar_data);
                }else{
                    //编辑器拖拽相关
                    canvas.editor_bar_manager.on_mouse_move(event,
                        canvas.mouse_recorder,canvas.scale)
                }
                // if (canvas.connecting_path != null) {
                this.line_connect_helper.move_connect_if_connecting(
                    NoteCanvasFunc,
                    canvas,
                    event.clientX,
                    event.clientY
                );
                // }
            }
        }
        event_mouse_up_on_eb(event:MouseEvent,ebcomp:any){
            // const canvas=this.canvas.notecanvas
            //
            if (this.line_connect_helper.connecting_path) {
                const eb = this.canvas.get_content_manager().notehandle.ebman()
                    .get_ebdata_by_ebid(ebcomp.ebid);
                this.line_connect_helper.end_connect(
                    this,
                    eb.pos_x,
                    eb.pos_y,
                    ebcomp.ebid
                );
            }
        }
        event_mouse_up(event:MouseEvent){
            this._recent_mouse_move=undefined
            this.mouse_drag_recorder.up(this.canvas,event)

            {
                const canvas=this.canvas.notecanvas
                //   this.dragging = false;
                console.log("handle_mouse_up")
                this.drag_bar_helper.end_drag(event,canvas)
                // canvas.drag_bar_helper.end_drag(event,canvas);
                canvas.canvas_mouse_drag_helper.end_drag_canvas(event);

                //没有在eb上置空
                this.line_connect_helper.stop_connect_if_not()

                canvas.editor_bar_manager.on_mouse_up();
            }
        }
        scroll_get_gradient_scroll():Gradient.Common{
            return this.canvas.notecanvas.state_ts.gradient_scroll
        }
        scroll_move(dx:number,dy:number){
            const range_ref=this.canvas.getref_range_ref()
            this.scroll_get_gradient_scroll().start_walk(
                [range_ref.scrollLeft,range_ref.scrollTop],
                [range_ref.scrollLeft+dx,range_ref.scrollTop+dy],
                10,(nums:number[])=>{
                    range_ref.scrollLeft=nums[0]
                    range_ref.scrollTop=nums[1]
                }
            )

            // canvas.$refs.range_ref.scrollLeft += dx;
            // canvas.$refs.range_ref.scrollTop+=dy;
        }
        pos_get_content_origin_pos(){
            return this.canvas.notecanvas.get_content_origin_pos();
        }
        pos_from_uipos_2_canvaspos(pos:_PaUtilTs.Pos2D):_PaUtilTs.Pos2D{
            const canvas=this.canvas.notecanvas
            const origin_pos = canvas.get_content_origin_pos();
            //   var bar_pos = this.get_moving_obj_pos();

            const tarx =
                pos.x -
                origin_pos.x ;// / canvas.scale;
            const tary =
                pos.y -
                origin_pos.y ;
            return new _PaUtilTs.Pos2D(tarx/this.canvas.get_scale(),tary/this.canvas.get_scale())
        }
        locate_editor_bar(ebid:string){
// console.log("locate_editor_bar",editor_bar_id)
            const bar_data=this.canvas.get_editorbar_man().get_editor_bar_data_by_ebid(ebid)
            const range_ref=this.canvas.getref_range_ref()
            const locate=(bar_data:EditorBar)=>{

                const range_rec = range_ref.getBoundingClientRect() ;

                //区域中心 client坐标
                const mid_y = (range_rec.top + range_rec.bottom) / 2;
                const mid_x = (range_rec.left + range_rec.right) / 2;

                const origin_pos = this.pos_get_content_origin_pos()
                const bar_client_pos={
                    x:origin_pos.x+(bar_data.pos_x+(bar_data.width)/2)*this.canvas.get_scale(),
                    y:origin_pos.y+(bar_data.pos_y+(bar_data.height)/2)*this.canvas.get_scale()
                }
                const dx = bar_client_pos.x- mid_x;
                const dy = bar_client_pos.y-mid_y;

                this.scroll_move(dx,dy)
                // DomOperation.scroll_move(canvas,dx,dy)
            }
            // console.log(bar_data,this.canvas.get_editorbar_man().get_ebid_2_data(),ebid)
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
    export class ContentManager{//由canvas持有
        search_in_canvas=new search.SearchInCanvas()
        cur_note_id="-1"
        linkBarToListView=new LinkCanvasBarToListView.LinkBarToListView()
        part_of_storage_data:null|PartOfNoteContentData=null
        user_interact:UserInteract
        reviewing_state?:ReviewPartFunc.ReviewingState
        canvas:NoteCanvasDataReacher
        notehandle=new note.NoteHandle("",note.NoteContentData.get_default())
        chunkhelper
        // canvas:any
        constructor(canvas:any) {
            this.canvas=canvas.data_reacher
            // console.log("new ContentManager",this.canvas)
            this.user_interact=new UserInteract(this.canvas)
            this.reviewing_state=this.canvas.get_context().rewiew_part_man.reviewing_state
            this.chunkhelper=new ChunkHelper(this.canvas)
        }
        static from_canvas(canvas:any):ContentManager{
            return canvas.content_manager
        }
        is_holding_note():boolean{
            return this.notehandle.note_id!=""
        }
        cur_note_undo(){
            if(this.cur_note_id!=""){
                const log=AppFuncTs.appctx.logctx.get_log_by_noteid(this.cur_note_id)
                if(log.undo_ope(this.notehandle)){
                    log.set_store_flag_after_do()
                }
            }
        }
        cur_note_redo(){
            if(this.cur_note_id!=""){
                const log=AppFuncTs.appctx.logctx.get_log_by_noteid(this.cur_note_id)
                if(log.redo_ope(this.notehandle)){
                    log.set_store_flag_after_do()
                }
            }
        }

        /**@param data {NoteContentData}
         *@param noteid {string}
         * */
        reset(canvas:any){
            // canvas.non_empty_chunks= {
            //     "0,0": 0,
            // }
            canvas.moving_obj= null
            canvas.editing_editor_bar= null
            canvas.editing_editor_bar_id= -1
            canvas.connecting_path=null

            this.chunkhelper.reset()
        }

        canvas_unmount(){
            if(this.canvas.get_content_manager().is_holding_note()){
                AppFuncTs.appctx.unhold_notehandle(
                    this.canvas.get_content_manager().notehandle)
            }
        }
        //相关组件都需要跟着变动
        first_load_set(notehandle:note.NoteHandle){
            const canvas=this.canvas.notecanvas
            const data=notehandle.content_data
            const noteid=notehandle.note_id
            if(this.is_holding_note()){
                AppFuncTs.appctx.unhold_notehandle(this.notehandle)
            }
            AppFuncTs.appctx.hold_notehandle(notehandle)
            this.notehandle=notehandle
            console.log("first_load_set",data);
            AppFuncTs.appctx.cur_canvasproxy = this.canvas
            canvas.next_editor_bar_id=data.next_editor_bar_id
            canvas.paths=data.paths
            canvas.editor_bars=data.editor_bars
            // notehandle.setup_values(this.canvas.get_editorbar_man())

            this.part_of_storage_data=data.part
            if(!this.part_of_storage_data){
                this.part_of_storage_data=new PartOfNoteContentData()
            }
            this.reset(canvas)
            this.chunkhelper.first_calc_chunks()
            // canvas.chunk_helper.first_calc_chunks(canvas)
            this.cur_note_id=noteid
            // bus_events.events.note_canvas_data_loaded.call(canvas)
            this.search_in_canvas.init_refs(canvas.editor_bars,canvas.editor_bar_manager)

            {//初始化大纲数据
                const ctx = NoteCanvasTs.NoteCanvasDataReacher.create(canvas).get_context()
                const rightpart = AppRefsGetter.create(ctx.app).get_right_part()
                console.log("rightpart",rightpart)
                const canvasreach=NoteCanvasTs.NoteCanvasDataReacher.create(canvas)
                if("note_outline" in rightpart.$refs){
                    rightpart.$refs.note_outline.note_loaded(
                        notehandle,
                        canvasreach.get_editor_bars(),
                        canvasreach.get_editorbar_man().ebid_to_ebcomp
                    )
                }
                // editor_bar_comps = canvasreach.get_editorbar_man().ebid_to_ebcomp
                // rightpart.$refs.note_outline.editor_bars=canvasreach.get_editor_bars()
            }
            {//复习界面
                AppFuncTs.appctx.get_reviewpart_man()?.sync_from_canvas(this.canvas)
            }
        }
        // _backend_set_curnote_newedit_flag(ctx:AppFuncTs.Context){
        //     const nlman= ctx.get_notelist_manager()
        //     if(nlman){
        //         //设置标志，后续扫描到即进行保存
        //         nlman.pub_set_note_newedited_flag(this.cur_note_id)
        //     }
        // }
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

                ctx.storage_manager.note_data_change(this.cur_note_id)

                // ctx.storage_manager.memory_holder.hold_note(this.cur_note_id,NoteContentData.of_canvas(canvas))
                // // ctx.storage_manager.buffer_save_note_editor_bars(this.cur_note_id,canvas.editor_bars);
                // // ctx.storage_manager.buffer_save_note_next_editor_bar_id(this.cur_note_id,canvas.next_editor_bar_id)
                // this._backend_set_curnote_newedit_flag(ctx);
            },()=>{

                ctx.storage_manager.note_data_change(this.cur_note_id)
                // ctx.storage_manager.memory_holder.hold_note(this.cur_note_id,NoteContentData.of_canvas(canvas))
                // this._backend_set_curnote_newedit_flag(ctx);
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
                ctx.storage_manager.note_data_change(this.cur_note_id)
                // ctx.storage_manager.memory_holder.hold_note(this.cur_note_id,NoteContentData.of_canvas(canvas))
                // // ctx.storage_manager.buffer_save_note_editor_bars(this.cur_note_id,canvas.editor_bars);
                // this._backend_set_curnote_newedit_flag(ctx);
            },()=>{

                ctx.storage_manager.note_data_change(this.cur_note_id)
                // ctx.storage_manager.memory_holder.hold_note(this.cur_note_id,NoteContentData.of_canvas(canvas))
                // this._backend_set_curnote_newedit_flag(ctx);
                // ctx.storage_manager.buffer_save_note_editor_bars(this.cur_note_id,canvas.editor_bars);
            })
        }

        /**@param change {PathFunc.PathChange}
         **/
        // eslint-disable-next-line no-unused-vars
        backend_path_change_and_save(ctx:AppFuncTs.Context,canvas:any,change:PathChange){
            // console.log("backend_path_change_and_save");
            this._backend_save_mode_choose(ctx,()=>{
                ctx.storage_manager.note_data_change(this.cur_note_id)
                // ctx.storage_manager.memory_holder.hold_note(this.cur_note_id,NoteContentData.of_canvas(canvas))
                // // ctx.storage_manager.buffer_save_note_paths(this.cur_note_id,canvas.paths);
                // this._backend_set_curnote_newedit_flag(ctx);
            },()=>{

                ctx.storage_manager.note_data_change(this.cur_note_id)
                // ctx.storage_manager.memory_holder.hold_note(this.cur_note_id,NoteContentData.of_canvas(canvas))
                // this._backend_set_curnote_newedit_flag(ctx);
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
        getref_range_ref(){
            return this.notecanvas.$refs.range_ref
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
        get_context():AppFuncTs.Context{
            return this.notecanvas.context
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
    }
    export module UiOperation{
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
    }
}