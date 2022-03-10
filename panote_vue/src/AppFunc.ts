
import Storage from "@/components/Storage";
import EditorBarViewListFunc from "@/components/reuseable/EditorBarViewListFunc";
import {NoteListManager} from "@/components/NoteListFunc";
import {NoteCanvasTs} from "@/components/NoteCanvasTs";


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
}


export module AppFuncTs{
    export class Context{
        app:any
        cur_open_note_id="-1"
        storage_manager=new Storage.StorageManager()
        constructor(app:any) {
            this.app=app
        }
    }
    export let appctx: Context = new Context(null);
    export const set_ctx=(ctx:Context)=>{
        appctx=ctx;
    }

    export module NoteCanvasRelate{
        export const locate_editor_bar=(barinfo:EditorBarViewListFunc.LinkingInfo)=>{
            console.log("locate_editor_bar",barinfo)
            const canvas=
                appctx.app.app_ref_getter.get_note_canvas(appctx.app);

            if(appctx.cur_open_note_id===barinfo.noteid){
                NoteCanvasTs.UiOperation.locate_editor_bar(canvas,barinfo.barid);
            }else{
                const notelist=
                    appctx.app.app_ref_getter.get_note_list(appctx.app);
                const notelistman:NoteListManager=notelist.notelist_manager;
                notelistman.open_note(appctx,barinfo.noteid)
                canvas.$nextTick(()=>{
                    NoteCanvasTs.UiOperation.locate_editor_bar(canvas,barinfo.barid);
                })
            }
        }
    }
}

import Context = AppFuncTs.Context;
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