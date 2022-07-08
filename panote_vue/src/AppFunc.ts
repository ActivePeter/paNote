
import Storage from "@/storage/Storage";
import EditorBarViewListFunc from "@/components/reuseable/EditorBarViewListFunc";
// import {NoteListManager} from "@/components/NoteListFunc";
import {NoteCanvasTs} from "@/components/NoteCanvasTs";
import {bus, bus_event_names, bus_events} from "@/bus";
import NoteConfigDialog from "@/components/NoteConfigDialog.vue";
import {ElMessage, ElMessageBox} from "element-plus";

export class AppRefsGetter{
    app:any
    static create(app:any){
        const arg=new AppRefsGetter();
        arg.app=app
        return arg;
    }
    get_note_canvas(app:any){
        return app.$refs.note_canvas_ref;
    }
    get_right_menu(app:any){
        return app.$refs.right_menu_ref
    }
    get_note_list(app:any){
        return app.$refs.note_list_ref
    }
    get_note_config_dialog(app:any):NoteConfigDialog{
        return app.$refs.note_config_dialog_ref
    }
    get_right_part():RightPart{
        // console.log(this.app)
        return this.app.$refs.right_part
    }
}


export module AppFuncTs{
    import LinkingInfo = EditorBarViewListFunc.LinkingInfo;

    class ContextGetter{
        review_part_man():ReviewPartFunc.ReviewPartManager{
            return this.ctx.app.$refs.review_part_ref.review_part_man
        }
        constructor(private ctx:Context) {

        }
    }
    class ContextElement{
        _ElMessage=ElMessage
        _ElMessageBox=ElMessageBox
    }
    class ContextUiRefGetter{
        cur_canvas():any{
            return this.ctx.app.$refs.note_canvas_ref;
        }
        main_canvasproxy():NoteCanvasTs.NoteCanvasDataReacher{
            return NoteCanvasTs.NoteCanvasDataReacher.create(
                this.ctx.app.$refs.note_canvas_ref
            )
        }
        constructor(private ctx:Context) {
        }
    }
    export class ContextUiOpes{
        locate_eb_in_cur_note(linkinfo:LinkingInfo){
            this.ctx.ui_refs().main_canvasproxy()
                .get_content_manager()
                .user_interact
                .locate_editor_bar(linkinfo.barid)
        }
        locate_eb_in_cur_note2(ebid:string){
            this.ctx.ui_refs().main_canvasproxy()
                .get_content_manager()
                .user_interact
                .locate_editor_bar(ebid)
        }
        constructor(public ctx:Context) {
        }
    }
    export class Context{
        app:any
        cur_open_note_id="-1"
        cur_open_note_content=new note.NoteContentData(1000,{},{})
        noteid_2_note_content:any={}
        //管理复习组件的状态
        rewiew_part_man=new ReviewPartFunc.ReviewPartManager()
        note_loaded_and_open(handle:note.NoteHandle){
            this.note_unload_data(this.cur_open_note_id)
            this.noteid_2_note_content[handle.note_id]=handle.content_data
            this.cur_open_note_content=handle.content_data
            this.cur_open_note_id=handle.note_id
        }
        //没有canvas打开
        note_unload_data(noteid:string){
            if(noteid in this.noteid_2_note_content){

                delete this.noteid_2_note_content[noteid]
            }
        }
        storage_manager=new Storage.StorageManager(this)
        timer=new Timer.TimerState()
        ui_refs(){
            return new ContextUiRefGetter(this)
        }
        uiopes(){
            return new ContextUiOpes(this)
        }
        element_plus(){
            return new ContextElement()
        }
        getter(){//新的get相关函数
            return new ContextGetter(this)
        }
        constructor(app:any) {
            this.app=app
        }
        get_notelist_manager():NoteListFuncTs.NoteListManager|null{
            if(this.app){
                return this.app.app_ref_getter.get_note_list(this.app).notelist_manager
            }
            return null
        }
        get_bottom_line():BottomLine|null{
            if(this.app){
                return this.app.$refs.bottom_line_ref;
            }
            return null
        }
        static getfakeone(){
            return new Context(null)
        }
    }
    export const request_for_conttext=(vueobj:any,cb:(ctx:Context)=>void)=>{
        vueobj.$emit("request_for_conttext",cb)
    }
    export let appctx: Context;

    namespace set_up_detail{
        export const notelist_rela=(ctx:Context)=>{
            bus.off(bus_event_names.start_bind_note_2_file)
            bus.on(bus_event_names.start_bind_note_2_file,(noteid)=>{
                console.log("start bind file for note",noteid)
                const dia=ctx.app.app_ref_getter.get_note_config_dialog(ctx.app)
                dia.show(ctx,noteid)
            })
        }
        export const storage_rela=(ctx:Context)=>{
            NoteListScanFileBind.start(ctx)
        }
    }
    export const set_up_all=(ctx:Context)=>{
        // bus_events.cancel_listen_all()
        set_up_detail.notelist_rela(ctx);
        set_up_detail.storage_rela(ctx);

        _ipc.MainCallRender.regist(ctx)
    }
}

import Context = AppFuncTs.Context;
import {NoteListFuncTs} from "@/components/NoteListFuncTs";
import {NoteListScanFileBind} from "@/storage/NoteListScanFileBind";
import {Timer} from "@/timer/Timer";
import {_ipc} from "@/ipc";
import {ReviewPartFunc} from "@/components/ReviewPartFunc";
import BottomLine from "@/components/BottomLine.vue";
import RightPart from "@/components/RightPart.vue";
import {note} from "@/note";

// import {NoteContentData} from "@/components/NoteCanvasFunc";
export default {
    AppRefsGetter,
    Context,
    set_ctx(ctx:AppFuncTs.Context){
        AppFuncTs.appctx=ctx;
        // console.log("set_ctx",ctx)
    },
    get_ctx(){
        return AppFuncTs.appctx
    },

}