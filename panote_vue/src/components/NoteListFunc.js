import RightMenuFunc from "@/components/RightMenuFunc";
import {bus, bus_event_names} from "@/bus";
class NoteListBarHelper{
    // eslint-disable-next-line no-unused-vars
    get_right_menu_content(note_list_bar){
        let content=new RightMenuFunc.RightMenuContent()
        content.add_one_selection("删除",()=>{

            // editor_bar.emit_delete()
            note_list_bar.$emit("delete",note_list_bar)
        })
        content.add_one_selection("绑定到文件",()=>{
            bus.emit(bus_event_names.start_bind_note_2_file,note_list_bar.id)
        })
        return content;
    }
}

export default {
    NoteListBarHelper
}