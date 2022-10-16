
// import Storage from "@/storage/Storage";
import EditorBarViewListFunc from "@/components/reuseable/EditorBarViewListFunc";
// import {NoteListManager} from "@/components/NoteListFunc";
import {NoteCanvasTs} from "@/components/note_canvas/NoteCanvasTs";
// import {bus, bus_event_names, bus_events} from "@/bus";
import NoteConfigDialog from "@/components/NoteConfigDialog.vue";
import {ElMessage, ElMessageBox} from "element-plus";
import {_store} from "@/logic/store";
import {NoteListFuncTs} from "@/components/NoteListFuncTs";
import {NoteLog} from "@/logic/log";
import {note} from "@/logic/note/note";
import {ReviewPartFunc} from "@/components/review_part/ReviewPartFunc";
import {ApiCaller, GetNoteMataArg, GetNotesMataArg} from "@/logic/commu/api_caller";
import {RightMenuFuncTs} from "@/components/RightMenuFuncTs";
import LoginPanel from "@/components/LoginPanel.vue";
import {AuthorityMan} from "@/logic/authority";


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
    // get_right_part():RightPart{
    //     // console.log(this.app)
    //     return this.app.$refs.right_part
    // }
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
        notelist(){
            return this.ctx.app.$refs.note_list_ref
        }
        right_menu(){
            return this.ctx.app.$refs.right_menu_ref
        }
        login_panel():LoginPanel{
            return this.ctx.app.$refs.login_panel_ref
        }
        constructor(private ctx:Context) {
        }
    }
    //ui相关的操作都写到这里
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
    export class EventCenter{
        on_commu_established(){
            this.ctx.api_caller.get_notes_mata(new GetNotesMataArg(),(reply)=>{
                console.log("reply",reply)
                this.ctx.get_notelist_manager()?.update_notelist(reply.node_id_name_list)
                this.ctx.ui_refs().notelist().$forceUpdate();
                // console.log()
            })
            this.ctx.authority_man.verify_token_when_first_load()
        }
        constructor(private ctx:Context) {
        }
    }
    export class Context{
        /****
         *  logic
         */
        app:any
        // _storage_manager:_store.IStorageManager|undefined
        private notelistman=new NoteListFuncTs.NoteListManager()
        get storage_manager():_store.IStorageManager{
            //@ts-ignore
            return undefined
        }
        api_caller:ApiCaller=new ApiCaller()
        event_center:EventCenter
        authority_man:AuthorityMan
        cur_canvasproxy:null|NoteCanvasTs.NoteCanvasDataReacher=null
        // cur_open_note_content=new note.NoteContentData(1000,{},{})
        _noteid_2_notehandle:any={}
        add_editor_bar(){
            this.ui_refs().main_canvasproxy().get_editorbar_man().add_editor_bar_in_center()
        }
        start_open_note(noteid:string){
            //1.获取笔记元信息
            this.api_caller.get_note_mata(
                new GetNoteMataArg(
                    noteid
                ),(reply)=>{
                console.log("get meta",reply)
                //2.notecanvas根据视野情况加载
                this.ui_refs().main_canvasproxy().get_content_manager().first_load_set(
                    note.NoteHandle.create(
                        noteid,note.NoteContentData.get_default())
                        .set_chunkrange(reply.min_chunkx,reply.max_chunkx,reply.min_chunky,reply.max_chunky)
                )
            })
        }
        get_notehandle(noteid:string):null|note.NoteHandle{
            if(noteid in this._noteid_2_notehandle){
                return this._noteid_2_notehandle[noteid][1]
            }
            return null
        }

        private hold_notehandle_id_for_content_manager=0
        //一个窗口持有note时，hold
        hold_notehandle(handle:note.NoteHandle,content_manager:NoteCanvasTs.ContentManager){
            content_manager.hold_notehandle_id=this.hold_notehandle_id_for_content_manager
            handle.add_holder(content_manager)
            this.hold_notehandle_id_for_content_manager++;

            if(!(handle.note_id in this._noteid_2_notehandle)){
                this._noteid_2_notehandle[handle.note_id]=[1,handle]
            }else{
                this._noteid_2_notehandle[handle.note_id][0]++
                console.log("notehandle multi hold",this._noteid_2_notehandle[handle.note_id][0]++)
            }
            this._noteid_2_notehandle[handle.note_id][1]=handle
        }
        //一个窗口切换或关闭是，unhold note
        unhold_notehandle(handle:note.NoteHandle,contentman:NoteCanvasTs.ContentManager){
            handle.remove_holder(contentman)
            contentman.hold_notehandle_id=-1

            console.log("unhold")
            if((handle.note_id in this._noteid_2_notehandle)){
                this._noteid_2_notehandle[handle.note_id][0]--
                if(this._noteid_2_notehandle[handle.note_id][0]==0){
                    delete this._noteid_2_notehandle[handle.note_id]
                }
            }
            //将handle设置为无效handle
            handle.note_id=""
        }
        //管理复习组件的状态
        // rewiew_part_man=new ReviewPartFunc.ReviewPartManager()
        logctx=new NoteLog.LogContext()
        anki_connected=false
        getter(){//新的get相关函数
            return new ContextGetter(this)
        }



        /**
         *   ui
         * */
        uiman_rightmenu
        ui_refs(){
            return new ContextUiRefGetter(this)
        }
        uiopes(){
            return new ContextUiOpes(this)
        }
        element_plus(){
            return new ContextElement()
        }
        get_notelist_manager():NoteListFuncTs.NoteListManager|null{
            return this.notelistman
            // if(this.app){
                // return this.app.app_ref_getter.get_note_list(this.app).notelist_manager
            // }
            // return null
        }


        /**
         *  init self
         * */
        static getfakeone(){
            return new Context(null)
        }
        constructor(app:any) {
            this.app=app
            this.event_center=new EventCenter(this)
            this.uiman_rightmenu=new RightMenuFuncTs.RightMenuMan(this)
            this.authority_man=new AuthorityMan(this)
        }
        init(){
            this.init_context_web()
        }
        init_context_web(){
            // this._storage_manager=new _store.WebStorageManager()
            this.api_caller.init_web(()=>{
                this.event_center.on_commu_established()
            })
        }
        init_context_electron(){

        }
    }
    export const request_for_conttext=(vueobj:any,cb:(ctx:Context)=>void)=>{
        vueobj.$emit("request_for_conttext",cb)
    }
    export let appctx: Context;

    namespace set_up_detail{
        export const notelist_rela=(ctx:Context)=>{
            // bus.off(bus_event_names.start_bind_note_2_file)
            // bus.on(bus_event_names.start_bind_note_2_file,(noteid)=>{
            //     console.log("start bind file for note",noteid)
            //     const dia=ctx.app.app_ref_getter.get_note_config_dialog(ctx.app)
            //     dia.show(ctx,noteid)
            // })
        }
        export const storage_rela=(ctx:Context)=>{
            // NoteListScanFileBind.start(ctx)
        }
    }

    export function set_ctx(ctx:AppFuncTs.Context){
        AppFuncTs.appctx=ctx;
        // console.log("set_ctx",ctx)
    }
    export function get_ctx(){
        return AppFuncTs.appctx
    }
}


// // import {NoteContentData} from "@/components/NoteCanvasFunc";
// export default {
//     AppRefsGetter,
//     Context,
//
//
// }