import Storage from "@/components/Storage";
class AppRefsGetter{
    get_note_canvas(app){
        return app.$refs.note_canvas_ref;
    }
    get_right_menu(app){
        return app.$refs.right_menu_ref
    }
    get_note_list(app){
        return app.$refs.note_list_ref
    }
}
class Context{
    app
    cur_open_note_id="-1"
    storage_manager=new Storage.StorageManager()

    constructor(app) {
        this.app=app
    }
}
export default {
    AppRefsGetter,
    Context
}