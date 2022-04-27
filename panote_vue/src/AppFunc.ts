
import Storage from "@/storage/Storage";
import EditorBarViewListFunc from "@/components/reuseable/EditorBarViewListFunc";
// import {NoteListManager} from "@/components/NoteListFunc";
import {NoteCanvasTs} from "@/components/NoteCanvasTs";
import {bus,bus_event_names} from "@/bus";
import NoteConfigDialog from "@/components/NoteConfigDialog.vue";

class AppRefsGetter{
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
}


export module AppFuncTs{
    export class Context{
        app:any
        cur_open_note_id="-1"
        storage_manager=new Storage.StorageManager(this)
        constructor(app:any) {
            this.app=app
        }
        get_notelist_manager():NoteListFuncTs.NoteListManager|null{
            if(this.app){
                return this.app.app_ref_getter.get_note_list(this.app).notelist_manager
            }
            return null
        }
    }
    export let appctx: Context|null;
    appctx=null
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
        set_up_detail.notelist_rela(ctx);
        set_up_detail.storage_rela(ctx);
    }
    export module NoteCanvasRelate{
        export const locate_editor_bar=(barinfo:EditorBarViewListFunc.LinkingInfo)=>{
            if(appctx){
                console.log("locate_editor_bar",barinfo)
                const canvas=
                    appctx.app.app_ref_getter.get_note_canvas(appctx.app);

                if(appctx.cur_open_note_id===barinfo.noteid){
                    NoteCanvasTs.UiOperation.locate_editor_bar(canvas,barinfo.barid);
                }else{
                    const notelist=
                        appctx.app.app_ref_getter.get_note_list(appctx.app);
                    const notelistman:NoteListFuncTs.NoteListManager=notelist.notelist_manager;
                    notelistman.open_note(appctx,barinfo.noteid)
                    canvas.$nextTick(()=>{
                        NoteCanvasTs.UiOperation.locate_editor_bar(canvas,barinfo.barid);
                    })
                }
            }
        }
    }
}

import Context = AppFuncTs.Context;
import {NoteListFuncTs} from "@/components/NoteListFuncTs";
import {NoteListScanFileBind} from "@/storage/NoteListScanFileBind";
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