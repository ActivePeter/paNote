class CornerDragHelper{
    editor_bar=null
    constructor(editor_bar) {
        this.editor_bar=editor_bar;
    }

    handle_mouse_drag_down(){
        // console.log("handle_mouse_drag_down",tag)
        this.editor_bar.$emit("corner_drag_start", this);
    }
}
class EditorBarManager{
    canvas=null
    corner_drag_helper=null
    constructor(canvas) {
        this.canvas=canvas;
    }
    get_editor_bar_data_by_ebid(ebid){
        return this.canvas.editor_bars[ebid]
    }
    new_editor_bar(px,py){
        return {
            pos_x: px,
            pos_y: py,
            width:150,
            height:150,
            conns: [],
        }
    }
    add_editor_bar(bar){
        this.canvas.editor_bars.push(bar);
    }
    corner_drag_start(drag_helper){
        // eslint-disable-next-line no-empty
        if(drag_helper){
            console.log(drag_helper)
            console.log(this)
            this.corner_drag_helper=drag_helper
        }
    }
    on_mouse_move(event,mouse_rec){
        if(this.corner_drag_helper&&event){
            let data=this.get_editor_bar_data_by_ebid(
                this.corner_drag_helper.editor_bar.ebid);
            let delta=mouse_rec.get_delta()
            data.width+=delta.dx;
            data.height+=delta.dy;
        }
    }
    on_mouse_up(){
        this.corner_drag_helper=null
    }
}
export default {
    editor_bar_switch_mode(canvas,eb){
        console.log(eb.ebid,canvas.editing_editor_bar_id)
        if(eb.ebid===canvas.editing_editor_bar_id){
            canvas.editing_editor_bar_id=-1
            canvas.editing_editor_bar=null
        }else{
            canvas.editing_editor_bar_id=eb.ebid
            canvas.editing_editor_bar=eb
        }
    },
    CornerDragHelper,
    EditorBarManager
}