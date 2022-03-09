
import Storage from "@/components/Storage";
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
class Context{
    app:any
    cur_open_note_id="-1"
    storage_manager=new Storage.StorageManager()
    constructor(app:any) {
        this.app=app
    }
}

let appctx: Context = new Context(null);
export default {
    AppRefsGetter,
    Context,
    set_ctx(ctx:Context){
        appctx=ctx;
        // console.log("set_ctx",ctx)
    },
    get_ctx(){
        return appctx
    }
}