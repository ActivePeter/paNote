import RightMenuFunc from "@/components/RightMenuFunc";
class NoteListBarHelper{
    // eslint-disable-next-line no-unused-vars
    get_right_menu_content(note_list_bar){
        let content=new RightMenuFunc.RightMenuContent()
        content.add_one_selection("删除",()=>{

            // editor_bar.emit_delete()
            note_list_bar.$emit("delete",note_list_bar)
        })
        return content;
    }
}
class NoteListManager{
    data_to_storage={
        pub_notes:{},
        next_id:0
    }
    pub_note_list_mounted(context,notelist){
        // this.context=context;
        context.storage_manager.load_notelist(notelist);
    }
    pub_set_notes(){

    }
    add_new_note(context){
        console.log("add_new_note")
        this.data_to_storage.pub_notes[this.data_to_storage.next_id]={
            name:"hh",
            // content_id:"note_content_"+this.data_to_storage.next_id
        }
        let ret=this.data_to_storage.next_id
        this.data_to_storage.next_id++;
        context.storage_manager.save_notelist(this);

        return ret+"";
    }
    delete_note(ctx,note_id){
        console.log("删除 callback",this.data_to_storage,note_id)

        delete this.data_to_storage.pub_notes[note_id];
        console.log("删除 ",this.data_to_storage)
        ctx.storage_manager.save_notelist(this);
    }
    open_note(ctx,noteid){
        console.log("id compare",ctx.cur_open_note_id,noteid);
        if(ctx.cur_open_note_id!==noteid)
        {
            ctx.cur_open_note_id=noteid
            console.log("open_note",ctx,noteid);
            let note=ctx.storage_manager.load_note_all(noteid)
            let note_canvas=ctx.app.app_ref_getter.get_note_canvas(ctx.app)
            note_canvas.content_manager.first_load_set(noteid,note_canvas,note);
        }
    }
    change_note_name(ctx,noteid,name){
        console.log("change_note_name",name)
        if(noteid in this.data_to_storage.pub_notes){
            this.data_to_storage.pub_notes[noteid].name=name
            ctx.storage_manager.save_notelist(this)
        }else{
            console.log("change note failed",noteid)
        }
    }
    // eslint-disable-next-line no-unused-vars

}
export default {
    NoteListManager,
    NoteListBarHelper
}