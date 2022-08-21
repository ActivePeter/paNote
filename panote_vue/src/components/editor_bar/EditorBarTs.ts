import EditorBarFunc, {CornerDragHelper, EditorBar, EditorBarChange} from "@/components/editor_bar/EditorBarFunc";
import {_PaUtilTs} from "@/3rd/pa_util_ts";
import {NoteCanvasTs} from "@/components/note_canvas/NoteCanvasTs";
import {AppFuncTs} from "@/AppFunc";
import NoteCanvasFunc from "@/components/note_canvas/NoteCanvasFunc";
import {RightMenuFuncTs} from "@/components/RightMenuFuncTs";
import {ElMessage} from "element-plus";
import Util from "@/components/reuseable/Util";
import {NoteLog} from "@/log";
import {EditorBarFloatSetTs} from "@/components/editor_bar/EditorBarFloatSetTs";
import EditorBarFloatSet from "@/components/editor_bar/EditorBarFloatSet.vue";
import EditorBarFloatSetType = EditorBarFloatSetTs.EditorBarFloatSetType;
import editor from "@/3rd/quill-1.3.7/core/editor";

export namespace EditorBarTs {
    export const CursorMode = {
        choose: '选择',
        drag: '拖拽',
        conline: '连线'
    }

    export class EditorBarProxy {
        constructor(public editor_bar: EditorBar) {
        }

        static create(editor_bar: EditorBar): EditorBarProxy {
            const prox = new EditorBarProxy(editor_bar)
            return prox;
        }

        is_connect_eb(ebid: string) {
            let ok = false;
            this.editor_bar.conns.forEach((v, i) => {
                const sp = v.split(',')
                if ((sp[0] == ebid || sp[1] == ebid)) {
                    ok = true
                }
            })
            return ok
        }
    }

    export class EditorBarQuillProxy {
        constructor(public quill: any) {
        }
        get_selected_text():string{
            const sel=this.quill.getSelection()
            return this.quill.getText(sel.index,sel.length)
        }
        get_selection(){
            if(!this.quill){
                return null
            }
            return this.quill.getSelection()
        }
        set_selection(index:number,len:number){
            this.quill.setSelection(index,len)
        }
        is_blur():boolean{
            return this.get_selection()==null
        }
        undo(){

        }
        get_text(): string {
            return this.quill.getText()
        }
    }

    export class EditorBarCompProxy {
        constructor(public comp: any) {
        }

        fakeselect_timer(on:boolean){
            // console.log("eb fakesel timer",on,this.ebid)
            if(on){
                this.comp.fakeselect_timer=setInterval(()=>{
                    this.comp.fakeselect_show=!this.comp.fakeselect_show
                },400)
            }else{
                clearInterval(this.comp.fakeselect_timer)
            }
        }

        static create(comp: any): EditorBarCompProxy {
            return new EditorBarCompProxy(comp)
        }

        get ebid(): string {
            return this.comp.ebid;
        }
        get ebman():EditorBarTs.EditorBarManager{
            return this.comp.editor_bar_manager
        }

        editortool_state(){
            return this.ebman.canvasproxy().get_content_manager().user_interact
                .editortool_state
        }
        update_sel_bound_by_range(range:any){
            const b=this.comp.selection_bound=
                this.get_quill().getBounds(range.index,range.length)
            const s=this.ebman.canvasproxy().get_scale()
            b.left=b.left/s
            b.top=b.top/s
            b.bottom=b.bottom/s
            b.right=b.right/s
        }
        get_sel_pos_by_range(range:any){
            const b=this.get_quill().getBounds(range.index,range.length)
            return new _PaUtilTs.Pos2D(b.left,b.top)
        }
        get fakeselection_seled():boolean{
            return this.comp.fakeselection_seled
        }
        set fakeselection_seled(v:boolean){
            this.comp.fakeselection_seled=v
        }
        // fakeselection_flag=false
        fakeselection_show(){
            const editor_sel=this.editortool_state().editor_sel
            if(editor_sel.length>0){
                this.contentchange_pass_flag=true
                const delta= this.get_quill().formatText(
                    editor_sel.index,editor_sel.length,
                    {
                        background:'#0066cc',
                        color:'#dfefff'
                    }
                )
                if(delta.ops.length!=0){
                    this.fakeselection_seled=true
                }else{
                    this.contentchange_pass_flag=false
                }
                // console.log("fakeselection_show format",delta)
            }
        }
        fakeselection_hide_if_need(after_sel:Function){
            if(this.fakeselection_seled){
                // console.log("no fake selection apply")
                const sel=this.editortool_state().editor_sel
                this.contentchange_pass_flag=true
                this.get_quill().history.undo()
                console.log("fakeselection_hide_if_need","undo")
                setTimeout(()=>{
                    this.get_quill().setSelection(sel.index,sel.length)
                    setTimeout(()=>{
                        after_sel()
                    },1)
                },1)
                this.fakeselection_seled=false
            }else{
                console.log("no fake selection apply")
                after_sel()
            }
        }
        set contentchange_pass_flag(v:boolean){
            this.comp.contentchange_pass_flag=v
        }
        get contentchange_pass_flag():boolean{
            return this.comp.contentchange_pass_flag
        }
        event_contentchange(content:string){
            if(this.contentchange_pass_flag){
                console.log("contentchange_pass once")
                this.contentchange_pass_flag=false
                return;
            }
            const ui=this.ebman.canvasproxy().get_content_manager().user_interact
            if(this.ebman.editing_ebid==this.ebid){
                // this.get_quill_proxy()
                if(ui.editortool_state.show){
                    const tool=ui.editortool_state
                    setTimeout(()=>{
                        this.get_quill().setContents(tool.editor_delta)
                        this.get_quill().selection.setRange(tool.editor_sel)
                    },1)

                    console.log("eb change when select tool")
                    return;
                }
                // console.log("event_contentchange",this.comp,this.comp.noteid,this.comp.notehandle.noteid)
                if((!this.comp.noteid)||
                    this.comp.noteid!==this.comp.notehandle.note_id){
                    this.comp.noteid=this.comp.notehandle.note_id
                    // console.log("event_contentchange first",this.comp)
                    // return
                }
                console.log("eb change emit")
                this.comp.$emit("content_change",this.ebid,content)
            }
        }
        //编辑器可以编辑了，
        // 可能是刚开始编辑
        // 也可能是刚选完操作
        event_eb_enable(){

            this.get_quill().focus()
            //在编辑工具关闭后使能，需要隐藏之前的fakeselection
            this.fakeselection_hide_if_need(
                ()=>{
                    // setTimeout(()=>{
                        this.editortool_state().apply_ifexist()
                    // },1000)
                }
            )
            // this.get_sel_pos_by_range(this.editortool_state().editor_sel)
        }
        //设置在编辑器恢复可编辑状态后的回调
        applyope_set_cb(cb:()=>void){
            this.editortool_state().applyafterhide=cb
        }
        //要放入回调
        apply_toolset(args:any){
            if(args[0]=='indent'){
                if(args[1]=='foward'){
                    this.get_ref_quill().do_operation(args[0],1);
                }else{
                    this.get_ref_quill().do_operation(args[0],-1);
                }
            }else if(args[0]=='head'){

                this.get_ref_quill().quill_format("header",args[1]);
                // eslint-disable-next-line no-empty
            }else if(args[0]=='code'){
                this.get_ref_quill().do_operation('code',true);
                // eslint-disable-next-line no-empty
            }else if(args[0]=='url'){
                this.floatset_set2url()
            }
        }
        //要放入回调
        apply_operation(args:[string,any]){
            if(args[0]=='url'){
                const sel=this.get_quill().getSelection()
                if(this.get_quill().getText()!=args[1].show){
                    this.get_quill().deleteText(sel.index,sel.length)
                    console.log(
                        this.get_quill().insertText(sel.index,args[1].show))
                    this.get_quill().formatText(sel.index,args[1].show.length,
                        { link:  args[1].url})
                }
                // this.get_quill().deleteTe
            }else if(args[0]=='urlremove'){
                const sel=this.get_quill().getSelection()
                this.get_quill().removeFormat(sel.index,sel.length)
            }
        }
        floatset_set2url(){
            // this.get_ref_floatset().urlsetdata_init(
            //     this.get_quill_proxy().get_selected_text())
            this.set_float_set(EditorBarFloatSetType.url)
        }
        floatset_remove_url(){
            this.applyope_set_cb(()=>{
                this.apply_operation(["urlremove",null])
            })
            this.set_float_set(EditorBarFloatSetType.no)
        }
        floatset_done_url(show:string,url:string){
            this.applyope_set_cb(()=>{
                this.apply_operation(["url",
                    {
                        show,
                        url
                    }])
            })
            this.set_float_set(EditorBarFloatSetType.no)
        }
        set_float_set(floatset:EditorBarFloatSetTs.EditorBarFloatSetType){
            this.comp.floatset=floatset
        }
        get_ref_quill() {
            return this.comp.$refs.quill_editor_ref
        }
        get_ref_floatset():EditorBarFloatSet{
            return this.comp.$refs.floatset
        }
        get_quill(){
            return this.get_ref_quill().get_raw_quill()
        }
        get_quill_proxy() {
            return new EditorBarQuillProxy(this.get_ref_quill().get_raw_quill())
        }

    }

    export class EditorBarManager {
        canvas: any = null
        corner_drag_helper:null|CornerDragHelper = null
        ebid_to_ebcomp: any = {}//ebid->1

        editing_ebproxy:EditorBarCompProxy|null=null
        editing_ebid:string=""

        constructor(canvas: any) {
            this.canvas = canvas;
        }

        editmode_set(eb:EditorBarCompProxy,editing:boolean){

            if(editing){
                if(this.editing_ebproxy){
                    this.editmode_set(this.editing_ebproxy,false)
                }
                this.editing_ebid=eb.ebid
                this.editing_ebproxy=eb

                eb.fakeselect_timer(true)
            }else {
                this.editing_ebid=""
                this.editing_ebproxy?.set_float_set(
                    EditorBarFloatSetType.no
                )
                this.editing_ebproxy=null
                this.canvasproxy().get_content_manager().user_interact
                    .editortool_state.clear_sel_rec()

                eb.fakeselect_timer(false)
            }
            this.canvasproxy().get_content_manager().user_interact
                .editortool_state.hide()
        }
        editmode_switch(eb:EditorBarCompProxy){
            this.editmode_set(eb,eb.ebid!=this.editing_ebid)
        }

        canvasproxy(): NoteCanvasTs.NoteCanvasDataReacher {
            return NoteCanvasTs.NoteCanvasDataReacher.create(this.canvas)
        }

        //选择功能-->
        focused_ebids: any = {}//选中的editor bar id
        focus_add(ebid: string) {
            this.focused_ebids[ebid] = 1
        }

        focus_swap(ebid: string) {
            if (ebid in this.focused_ebids) {
                this.focus_del(ebid)
            } else {
                this.focus_add(ebid)
            }
        }

        focus_del(ebid: string) {
            if (ebid in this.focused_ebids) {
                delete this.focused_ebids[ebid]
            }
        }

        focus_clear() {
            this.focused_ebids = {}
        }

        focused_cnt(): number {
            return Object.keys(this.focused_ebids).length
        }

        focus_setnewpos_with_one(ebid: string,
                                 x: number,
                                 y: number) {

            // if (!(ebid in this.focused_ebids)) {
            //     console.error("ebid not in focused")
            // }
            // // console.log("")
            // const ms = _PaUtilTs.time_stamp_number()
            // const canvas = this.canvas
            // const ebdata = this.get_editor_bar_data_by_ebid(ebid)
            // const delta = this.set_new_pos(
            //     ebid, ebdata,
            //     x, y
            //     // ebid,eb,x,y
            // );
            // const focusedkeys = Object.keys(this.focused_ebids)
            // focusedkeys.forEach((v, i,) => {
            //     if (v != ebid) {
            //         const other = this.get_editor_bar_data_by_ebid(v)
            //         this.set_new_pos(v, other, other.pos_x + delta.x, other.pos_y + delta.y)
            //     }
            // })
            // console.log("focus_setnewpos_with_one dt", _PaUtilTs.time_stamp_number() - ms)
        }

        copy_selected() {

        }

        del_selected() {
            const rec = new NoteLog.Rec()
            for (const ebid in this.focused_ebids) {
                rec.add_trans(new NoteLog.SubTrans.EbDel(ebid))
            }
            const handle = this.canvasproxy().get_content_manager().notehandle
            const log = AppFuncTs.appctx.logctx.get_log_by_noteid(handle.note_id)
            if (log.try_do_ope(rec, handle)) {
                this.focus_clear()
                log.set_store_flag_after_do()
            }
            // const ebids:string[]=[]
            // for(const ebid in this.focused_ebids){
            //     this.path_removeall_to_eb(ebid)
            //     // this.canvas.line_connect_helper
            //     // .remove_bar_paths(
            //         // this.canvas, editor_bar.ebid
            //     // )
            //     delete this.canvas.editor_bars[ebid]
            //     ebids.push(ebid)
            // }
            //
            // const cvs=NoteCanvasTs.NoteCanvasDataReacher.create(this.canvas)
            // const noteid=cvs.get_content_manager().cur_note_id
            // const part=cvs.get_content_manager().part_of_storage_data
            // if(part){
            //     const ol=NoteOutlineTs.OutlineStorageStruct.proxy(
            //         part.note_outline,noteid)
            //     ebids.forEach((v)=>{
            //         for(let i=0;i<ol.outline.trees.length;i++){
            //             ol.try_remove_in_treei(i,v)
            //         }
            //     })
            //     // ol.try_remove_in_treei()
            // }
            // AppFuncTs.appctx.storage_manager.note_data_change(noteid)
        }

        path_removeall_to_eb(ebid: string) {
            const bar_data = this.get_editor_bar_data_by_ebid(ebid)

            // 遍历所有连线
            for (const i in bar_data.conns) {
                const path_key = bar_data.conns[i]
                const p = this.canvas.paths[path_key]
                let other_bar_id = p.b_bar;
                if (p.b_bar === ebid) {
                    other_bar_id = p.e_bar;
                }
                //移除对方方块对连线的存储
                Util.remove_one_in_arr(
                    this.get_editor_bar_data_by_ebid(other_bar_id).conns, path_key);
                //移除连线
                delete this.canvas.paths[path_key];
            }
            bar_data.conns = []
            //
        }

        open_right_menu_if_rightclick(e: MouseEvent, ebcomp: any) {
            if (e.buttons == 2) {
                const comproxy = EditorBarCompProxy.create(ebcomp)
                const content = new RightMenuFuncTs.RightMenuContent()
                const canvasproxy = NoteCanvasTs.NoteCanvasDataReacher.create(this.canvas)
                const ctx = canvasproxy.get_context()
                const notehandle=canvasproxy.get_content_manager().notehandle
                content
                    .add_one_selection("复制", () => {
                        this.copy_selected()
                    })
                    .add_one_selection("删除", () => {
                        this.del_selected()
                    })

                if (!(comproxy.ebid in this.focused_ebids)) {
                    //未focus,先focus，然后操作单个
                    this.focus_clear()
                    this.focus_add(comproxy.ebid)
                } else if (Object.keys(this.focused_ebids).length == 0) {
                    this.focus_add(comproxy.ebid)
                }

                if (Object.keys(this.focused_ebids).length == 1) {
                    //单个选中
                    content
                        .add_one_selection("作为根节点加入大纲", () => {
                            // const log=AppFuncTs.appctx.logctx.get_log_by_noteid()
                            this.canvasproxy().get_content_manager()
                                .notehandle.olman()
                                .withlog_add_root(
                                    comproxy.ebid
                                )?.set_store_flag_after_do()
                        })
                        .add_one_selection("加入到大纲", () => {
                            const res=canvasproxy.get_content_manager().notehandle.olman()
                                .withlog_ins2alltree(
                                    comproxy.ebid
                                )
                            // const outline = notehandle.content_data.part.note_outline
                            // const olproxy = NoteOutlineTs.OutlineStorageStruct.proxy(outline, notehandle.note_id)
                            // const res = olproxy.try_ins2trees(comproxy.ebid, canvasproxy.get_editorbar_man())
                            if (!res) {
                                ElMessage({
                                    message: '已存在于大纲中 或\n大纲中不存在与当前节点相连的文本块，无法连入',
                                    type: 'warning',
                                })
                            } else {
                                res.set_store_flag_after_do()
                                // olproxy.data_changed(ctx)
                            }
                            // const ctx = NoteCanvasTs.NoteCanvasDataReacher.create(this.canvas).get_context()
                            // const rightpart = AppRefsGetter.create(ctx.app).get_right_part()
                            //
                            //
                            // if (rightpart.$refs.note_outline.data_stored.trees.length == 0) {
                            //
                            // } else {
                            //     rightpart.$refs.note_outline.try_insert_node(ebid)
                            // }

                        })
                }
                RightMenuFuncTs.if_right_click_then_emit_bus(e, content)
            }
        }

        event_mousedown(event: MouseEvent, ebcomp: any) {
            // console.log("editor bar event_mousedown")
            const canvasproxy = NoteCanvasTs.NoteCanvasDataReacher.create(this.canvas)
            const contentman = canvasproxy.get_content_manager()
            const ebman = canvasproxy.get_editorbar_man()
            if (event.buttons == 1) {
                contentman.user_interact.recent_eb_mouse_down = event;
                //连接到复习卡片的listview
                if (contentman.linkBarToListView.is_linking) {
                    contentman.linkBarToListView.link_canvas_bar(this.canvas, ebcomp)
                    return;
                }
                //   console.log(eb);
                //   let cp = this.get_canvas_client_pos();

                //连线或拖拽或点击
                contentman.user_interact.drag_bar_helper.start_drag(NoteCanvasFunc, this.canvas,
                    event, ebcomp
                )
            }
            //右键
            this.open_right_menu_if_rightclick(event, ebcomp)

        }

        editor_bar_comp_mounted(ebcomp: any) {
            this.ebid_to_ebcomp[ebcomp.ebid] = ebcomp
        }

        editor_bar_comp_unmounted(ebcomp: any) {
            delete this.ebid_to_ebcomp[ebcomp.ebid]
        }

        add_if_no() {
            if (this.canvas.editor_bars.length === 0) {
                // this.add_editor_bar(
                //     this.new_editor_bar(0, 0)
                // );
            }
        }

        get_editor_bar_client_pos(ebid: string) {
            const op: any = this.canvasproxy().get_content_manager().user_interact
                .pos_get_content_origin_pos();
            const eb_data: any = this.canvas.editor_bars[ebid];
            return {
                x: op.x + eb_data.pos_x * this.canvas.scale,
                y: op.y + eb_data.pos_y * this.canvas.scale,
            }
        }

        get_ebid_2_data() {
            return this.canvas.editor_bars
        }

        get_editor_bar_data_by_ebid(ebid: string): EditorBar {
            return this.canvas.editor_bars[ebid]
        }

        get_editor_bar_rect_by_ebid(ebid: string): _PaUtilTs.Rect {
            const eb = this.get_editor_bar_data_by_ebid(ebid)
            return new _PaUtilTs.Rect(eb.pos_x, eb.pos_y, eb.width, eb.height)
        }

        new_editor_bar(px: number, py: number): EditorBar {
            return new EditorBar(px, py)
            // {
            //     pos_x: px,
            //     pos_y: py,
            //     width:150,
            //     height:150,
            //     content:"",
            //     conns: [],
            // }
        }

        // /**@param bar {EditorBar}
        //  **/
        // add_editor_bar(bar: any) {
        //     const canvas = this.canvas
        //     canvas.content_manager.backend_add_editor_bar_and_save(canvas.context,
        //         canvas, bar);
        //
        //
        //     const ck = canvas.chunk_helper.calc_chunk_pos(bar.pos_x, bar.pos_y);
        //     canvas.chunk_helper.add_new_2chunks(canvas.non_empty_chunks, ck);
        //     canvas.change_padding(
        //         canvas.chunk_helper.chunk_min_y * -400,
        //         canvas.chunk_helper.chunk_max_y * 400,
        //         canvas.chunk_helper.chunk_max_x * 300,
        //         canvas.chunk_helper.chunk_min_x * -300
        //     );
        //     // this.canvas.storage.save_bar();
        // }

        add_editor_bar_in_center() {
            const canvasp = this.canvasproxy()
            // canvasp.get_content_manager().user_interact.
            // console.log("add_editor_bar");
            const ui = canvasp.get_content_manager().user_interact

            const range_rec = ui.range_ref_getBoundingClientRect()

            //区域中心 client坐标
            const mid_y = (range_rec.top + range_rec.bottom) / 2;
            const mid_x = (range_rec.left + range_rec.right) / 2;

            const origin_pos = ui.pos_get_content_origin_pos();
            const px = mid_x - origin_pos.x;
            const py = mid_y - origin_pos.y;

            const log = AppFuncTs.appctx.logctx.get_log_by_noteid(
                canvasp.get_content_manager().notehandle.note_id)

            const new_bar =
                canvasp.get_editorbar_man().new_editor_bar(
                    px / canvasp.get_scale(),
                    py / canvasp.get_scale())
            const rec = new NoteLog.Rec()
                .add_trans(new NoteLog.SubTrans.EbAdd(new_bar))

            if (log.try_do_ope(rec, canvasp.get_content_manager().notehandle)) {
                log.set_store_flag_after_do()
            }
            // this.add_editor_bar(new_bar);
            // canvas.editor_bars.push(new_bar);
        }

        copy_editor_bar_data__except_conn(from: EditorBar, to: EditorBar) {
            to.pos_x = from.pos_x
            to.pos_y = from.pos_y
            to.width = from.width
            to.height = from.height
            to.content = from.content
        }

        copy_editor_bar_left_side(canvas: any, ebid: string) {
            const ebdata = this.get_editor_bar_data_by_ebid(ebid)
            const new_bar =
                canvas.editor_bar_manager.new_editor_bar(
                    ebdata.pos_x,
                    ebdata.pos_y)
            this.copy_editor_bar_data__except_conn(ebdata, new_bar)
            new_bar.pos_x -= new_bar.width + 10;
            // this.add_editor_bar(new_bar);
        }

        // //return with change
        // set_new_pos(ebid: string, eb: any, x: number, y: number): _PaUtilTs.Vec2D {
        //     const old_ck = this.canvas.chunk_helper.calc_chunk_pos(eb.pos_x, eb.pos_y);
        //     const delta = new _PaUtilTs.Pos2D(
        //         x - eb.pos_x,
        //         y - eb.pos_y
        //     )
        //     eb.pos_x = x;
        //     eb.pos_y = y;
        //     this.canvas.line_connect_helper.bar_move(this.canvas, ebid);
        //     const ck = this.canvas.chunk_helper.calc_chunk_pos(x, y);
        //     if (old_ck !== ck) {
        //         // console.log("ck", ck);
        //
        //         this.canvas.chunk_helper.move_chunk(this.canvas.non_empty_chunks, old_ck, ck);
        //         // console.log(this.canvas.non_empty_chunks);
        //         this.canvas.change_padding(
        //             this.canvas.chunk_helper.chunk_min_y * -400,
        //             this.canvas.chunk_helper.chunk_max_y * 400,
        //             this.canvas.chunk_helper.chunk_max_x * 300,
        //             this.canvas.chunk_helper.chunk_min_x * -300
        //         );
        //         // console.log(
        //         //     this.canvas.padding_add_up,
        //         //     this.canvas.padding_add_down,
        //         //     this.canvas.padding_add_left,
        //         //     this.canvas.padding_add_right
        //         // );
        //     }
        //     return delta
        // }

        corner_drag_start(drag_helper: CornerDragHelper) {
            // eslint-disable-next-line no-empty
            if (drag_helper) {
                // console.log(drag_helper)
                // console.log(this)
                this.corner_drag_helper = drag_helper
            }
        }

        content_change(ebid: string, content: any) {
            this.canvas.editor_bars[ebid].content = content;
            this.canvas.content_manager.backend_editor_bar_change_and_save(
                this.canvas.context, this.canvas,
                new EditorBarChange(
                    EditorBarFunc.EditorBarChangeType.ContentChange,
                    null,
                )
            )
            // this.canvas.storage.save_bar();
        }

        on_mouse_move(event: MouseEvent, mouse_rec: any, scale: number) {
            if (this.corner_drag_helper && event) {
                // @ts-ignore
                const data = this.get_editor_bar_data_by_ebid(this.corner_drag_helper.editor_bar.ebid);
                const delta = mouse_rec.get_delta()
                data.width += delta.dx / scale;
                data.height += delta.dy / scale;
            }
        }

        on_mouse_up() {
            if(this.corner_drag_helper){
                this.corner_drag_helper.handle_mouse_up()
                // this.canvasproxy().get_content_manager().
                this.corner_drag_helper = null
            }
        }

    }

    //
    export class DragBarHelper {
        update_cnt = 0;
        dragging = false;
        // cb=(moved:boolean,updown_dt:number)=>{}
        _start_ms = 0;
        mouse_last_pos = new _PaUtilTs.Pos2D(0, 0)
        start_in_case3 = false
        mouse_move_distance = 0
        mouse_down_eb: any
        begin_focused = false;
        last_update_time = 0;
        eb_transs: null | NoteLog.SubTrans.EbTrans[] = null

        constructor(public ui:NoteCanvasTs.UserInteract) {
        }
        calc_eb_tar_pos(canvas: any): _PaUtilTs.Pos2D {
            const origin_pos = this.ui.pos_get_content_origin_pos();
            //   var bar_pos = this.get_moving_obj_pos();

            const tarx =
                canvas.mouse_recorder.mouse_cur_x -
                origin_pos.x -
                canvas.moving_obj.drag_on_x*canvas.scale;// / canvas.scale;
            const tary =
                canvas.mouse_recorder.mouse_cur_y -
                origin_pos.y -
                canvas.moving_obj.drag_on_y*canvas.scale;// / canvas.scale;
            // console.log(
            //     "calc_eb_tar_pos",
            //     canvas.mouse_recorder.mouse_cur_y ,
            //     origin_pos.y ,
            //     canvas.moving_obj.drag_on_y*canvas.scale,
            //     tary
            // )
            return new _PaUtilTs.Pos2D(tarx / canvas.scale, tary / canvas.scale)
        }

        // _end_ms=0;
        update_moving_obj_pos() {
            const canvas =this.ui.canvas.notecanvas

            const ms = _PaUtilTs.time_stamp_number()
            const ebman = canvas.editor_bar_manager as EditorBarTs.EditorBarManager
            const canvasdr = NoteCanvasTs.NoteCanvasDataReacher.create(canvas)

            const tarpos = this.calc_eb_tar_pos(canvas)
            if (this.update_cnt == 0) {
                const nh = canvasdr.get_content_manager().notehandle
                this.eb_transs = []

                Object.keys(canvasdr.get_editorbar_man().focused_ebids).forEach((v) => {
                    const eb = canvasdr.get_content_manager().notehandle.ebman().get_ebdata_by_ebid(v)
                    const trans = new NoteLog.SubTrans.EbTrans(v, 0, 0, 0, 0)
                    trans.old_state = new NoteLog.SubTrans.EbTransState(
                        eb.pos_x, eb.pos_y, eb.width, eb.height
                    )
                    this.eb_transs?.push(trans)
                })
            }
            this.update_cnt++;
            // const bar_data = canvas.editor_bars[canvas.moving_obj.ebid];
            // console.log("update_moving_obj_pos get_content_origin_pos");

            //   console.log("canvas dx dy", dx, dy, bar_pos);

            // canvas.editor_bar_manager.get_editor_bar_data_by_ebid()
            if (canvas.content_manager.linkBarToListView.is_linking) {
                return;
            }
            const newp = new _PaUtilTs.Pos2D(
                canvas.mouse_recorder.mouse_cur_x
                , canvas.mouse_recorder.mouse_cur_y)
            this.mouse_move_distance += _PaUtilTs.Algrithms.distance_2p(newp, this.mouse_last_pos)
            this.mouse_last_pos = newp

            const mainebid = canvas.moving_obj.ebid
            if (mainebid in canvasdr.get_editorbar_man().focused_ebids) {
                const ebid_2_op: any = {}
                const getop = (ebid: string): _PaUtilTs.Pos2D => {
                    return ebid_2_op[ebid]
                }
                Object.keys(canvasdr.get_editorbar_man().focused_ebids).forEach((k) => {
                    const eb = canvasdr.get_content_manager().notehandle.ebman().get_ebdata_by_ebid(k)
                    ebid_2_op[k] = new _PaUtilTs.Pos2D(eb.pos_x, eb.pos_y)
                })
                canvasdr.get_content_manager().notehandle.ebman()
                    .onlydata_ebs_move_with_first(canvas.moving_obj.ebid,
                        Object.keys(canvasdr.get_editorbar_man().focused_ebids),
                        tarpos.x, tarpos.y, true
                        // tarx / canvas.scale,
                        // tary / canvas.scale
                    )
                Object.keys(canvasdr.get_editorbar_man().focused_ebids).forEach((k) => {
                    const eb = canvasdr.get_content_manager().notehandle.ebman().get_ebdata_by_ebid(k)
                    const op = getop(k)
                    canvasdr.get_content_manager().chunkhelper.check_eb_chunk_change(op.x, op.y, eb.pos_x, eb.pos_y)
                })
                canvasdr.get_content_manager().chunkhelper.if_chunkchange_then_recalc_range()
            }
            // ebman.focus_setnewpos_with_one(canvas.moving_obj.ebid,
            //     tarx / canvas.scale,
            //     tary / canvas.scale
            // )
            if (ms - this.last_update_time > 100) {
                // canvas.$forceUpdate()
            }
            this.last_update_time = ms
            //
            // canvas.editor_bar_set_new_pos(
            //
            // );
        }

        start_drag(NoteCanvasFunc: any, canvas: any, event: MouseEvent, eb: any) {
            const ebman = canvas.editor_bar_manager as EditorBarTs.EditorBarManager
            const ebid = eb.ebid as string
            const canvasdr = NoteCanvasTs.NoteCanvasDataReacher.create(canvas)
            canvas.mouse_recorder.call_before_move(
                event.clientX,
                event.clientY
                //   event.screenX, event.screenY
            );
            // event.stopPropagation(); //阻止传递到上层，即handle_mouse_down
            if (canvas.cursor_mode === "连线") {
                const bar_data = canvas.editor_bars[eb.ebid];
                canvasdr.get_content_manager().user_interact.line_connect_helper
                    .begin_connect_from_canvaspos(
                    NoteCanvasFunc,
                    canvas,
                    bar_data.pos_x,
                    bar_data.pos_y,
                    eb.ebid
                )
                return
            }
            if (canvas.cursor_mode === "拖拽") {
                // console.log("开始拖拽")
                if (canvas.editor_bar_manager.corner_drag_helper == null) {
                    canvas.moving_obj = eb;

                }
            }

            this.mouse_down_eb = eb
            this.start_in_case3 = false
            this.mouse_move_distance = 0
            this.mouse_last_pos = new _PaUtilTs.Pos2D(event.clientX, event.clientY)

            //情况分析
            if (!(ebid in ebman.focused_ebids)) {
                // 1.未选中，存在别的选中
                //   别的取消选中，当前选中，并拖拽
                if (!event.shiftKey) {
                    if (ebman.focused_cnt() != 0) {
                        ebman.focus_clear()
                        // ebman.focus_add(ebid)
                    }
                }
                this.begin_focused = false
                // 2.未选中，不存在别的选中
                //   当前选中，并拖拽
                ebman.focus_add(ebid)
            } else {
                this.begin_focused = true
                // 3.选中. 存在别的选中
                //   3.1.发生拖拽(update)。一起被拖拽
                //   3.2.未发生拖拽。点击操作（取消其他选择）
                if (ebman.focused_cnt() != 1) {
                    this.start_in_case3 = true;
                }
                // 4.选中，不存在别的选中
                //   拖拽
                // else{
                //
                // }
            }
            this._start_ms = _PaUtilTs.time_stamp_number()
            // this.cb=end_cb
            const ebcpos = canvas.editor_bar_manager.get_editor_bar_client_pos(eb.ebid);
            // console.log(ebpos)

            //点下时记录鼠标与文本块的相对坐标
            eb.drag_on_x = (event.clientX - ebcpos.x)/canvas.scale
            eb.drag_on_y = (event.clientY - ebcpos.y)/canvas.scale

            this.update_cnt = 0;

        }

        end_drag(event: MouseEvent, canvas: any) {
            // console.log("end_drag",canvas.moving_obj)
            const end_ms = _PaUtilTs.time_stamp_number()
            const canvasdr = NoteCanvasTs.NoteCanvasDataReacher.create(canvas)

            if (this.mouse_down_eb && this.mouse_move_distance < 2) {
                //有其他选中无拖拽，相当于点击
                const ebman = canvasdr.get_editorbar_man()
                if (!event.shiftKey) {
                    ebman.focus_clear()

                    ebman.focus_add(this.mouse_down_eb.ebid)
                } else {
                    if (this.begin_focused) {
                        ebman.focus_del(this.mouse_down_eb.ebid)
                    }
                }
            } else if (canvas.moving_obj != null && this.eb_transs) {
                this.eb_transs?.forEach((v) => {
                    const eb = canvasdr.get_content_manager().notehandle.ebman().get_ebdata_by_ebid(v.ebid)
                    v.state.copyfromdata(eb)
                })
                const notehandle = canvasdr.get_content_manager().notehandle
                const logger = canvasdr.get_context().logctx.get_log_by_noteid(notehandle.note_id)
                const rec = new NoteLog.Rec()
                rec.transs = this.eb_transs
                this.eb_transs = null
                logger.try_do_ope(rec, notehandle)
                // console.log(" end_drag", canvas.moving_obj )
                // if (this.update_cnt > 0) {
                //     // canvas.content_manager.backend_editor_bar_change_and_save(
                //     //     canvas.context, canvas,
                //     //     new EditorBarFunc.EditorBarChange(
                //     //         EditorBarFunc.EditorBarChangeType.Move,
                //     //         null,
                //     //     )
                //     // )
                //     canvas.content_manager
                //         .backend_path_change_and_save(
                //             canvas.context, canvas,
                //             new PathFunc.PathChange(
                //                 PathFunc.PathChangeType.MoveSome,
                //                 null, null
                //             )
                //         )
                //     // canvas.storage.save_all()
                // }
                // console.log(this.mouse_move_distance)
            }

            canvas.moving_obj = null;
            this.mouse_down_eb = null;
        }
    }
}