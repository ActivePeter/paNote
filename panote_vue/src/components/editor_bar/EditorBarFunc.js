// import RightMenuFunc from "@/components/RightMenuFunc";
import {RightMenuFuncTs} from "@/components/RightMenuFuncTs";

class CornerDragHelper{
    editor_bar=null
    constructor(editor_bar) {
        this.editor_bar=editor_bar;
    }

    handle_mouse_drag_down(event){
        if(event.buttons===1){
            // console.log("handle_mouse_drag_down",tag)
            this.editor_bar.$emit("corner_drag_start", this);
        }
    }
}
export class EditorBar{
    pos_x= 0
    pos_y= 0
    width=150
    height=150
    content=""
    conns= []
    constructor(x,y) {
        this.pos_x=x;
        this.pos_y=y;
    }
}
export const EditorBarChangeType={
    Move:0,
    Resize:1,
    ContentChange:2,
    Delete:3,
    LineConnect:4,
}
export class EditorBarChange{
    /**
     *@param type {Number}
     *@param before_change {EditorBar}
     */
    type=-1
    before_change=null
    constructor(type,before_change) {
        this.type=type
        this.before_change=before_change
    }
}

class EditorBarRightMenuHelper {
    // eslint-disable-next-line no-unused-vars
    get_right_menu_content(editor_bar){
        let content=new RightMenuFuncTs.RightMenuContent()

        content.add_one_selection("复制",()=>{
            editor_bar.emit_copy()
        })
        content.add_one_selection("删除",()=>{
            console.log("删除 callback")
            editor_bar.emit_delete()
        })
        return content;
    }
}
export default {
    // editor_bar_switch_mode(canvas,eb){
    //     // console.log(eb.ebid,canvas.editing_editor_bar_id)
    //     if(eb.ebid===canvas.editing_editor_bar_id){
    //         canvas.editing_editor_bar_id='-1'
    //         canvas.editing_editor_bar=null
    //     }else{
    //         canvas.editing_editor_bar_id=eb.ebid
    //         canvas.editing_editor_bar=eb
    //     }
    // },
    CornerDragHelper,
    // EditorBarManager,
    EditorBarRightMenuHelper,
    EditorBar,
    EditorBarChange,
    EditorBarChangeType
}