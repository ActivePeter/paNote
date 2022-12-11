// import RightMenuFunc from "@/components/RightMenuFunc";
import {RightMenuFuncTs} from "@/components/RightMenuFuncTs";
import {NoteLog} from "@/logic/log";
// import {EditorBarCompProxy} from "@/components/editor_bar/EditorBarTs";
import {EditorBarTs} from "@/components/editor_bar/EditorBarTs";
import {AppFuncTs} from "@/logic/AppFunc";

export class CornerDragHelper{
    editor_bar=null
    trans
    constructor(editor_bar) {
        this.editor_bar=editor_bar;
    }

    handle_mouse_drag_down(event){
        if(event.buttons===1){
            // console.log("handle_mouse_drag_down",tag)
            const ebcp=EditorBarTs.EditorBarCompProxy.create(
                this.editor_bar)
            const ebdata=ebcp.ebman.get_editor_bar_data_by_ebid(ebcp.ebid)
            this.trans=new NoteLog.SubTrans.EbTrans(
                ebcp.ebid,ebdata.pos_x,ebdata.pos_y,
                ebdata.width,ebdata.height
            )
            this.trans.old_state=this.trans.state.clone()
            this.editor_bar.$emit("corner_drag_start", this);
        }
    }
    handle_mouse_up(){
        console.log("eb corner drag up")
        const ebcp=EditorBarTs.EditorBarCompProxy.create(
            this.editor_bar)
        const ebman=ebcp.ebman
        const notehandle=ebman.canvasproxy().get_content_manager().notehandle
        const log=AppFuncTs.appctx.logctx.get_log_by_noteid(notehandle.note_id)
        const rec=new NoteLog.Rec()
        const ebdata=ebman.get_editor_bar_data_by_ebid(ebcp.ebid)

        this.trans.state.copyfromdata(ebdata)
        rec.add_trans(this.trans)
        // rec.add_trans(new NoteLog.SubTrans.EbConn([[bbar,ebid]]))
        log.try_do_ope(rec,notehandle)
        // log.set_store_flag_after_do()
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