import RightMenuFunc from "@/components/RightMenuFunc";
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
const EditorBarChangeType={
    Move:0,
    Resize:1,
    ContentChange:2,
    Delete:3,
    LineConnect:4,
}
class EditorBarChange{
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
class EditorBarManager{
    canvas=null
    corner_drag_helper=null
    constructor(canvas) {
        this.canvas=canvas;
    }
    delete_one(editor_bar){
        this.canvas.line_connect_helper.remove_bar_paths(
            this.canvas,editor_bar.ebid
        )
        delete this.canvas.editor_bars[editor_bar.ebid]
        this.canvas.context.storage_manager
            .save_note_editor_bars(this.canvas.content_manager.cur_note_id,this.canvas.editor_bars)
     // console.log("delete one",editor_bar)
    }
    add_if_no(){
        if(this.canvas.editor_bars.length===0){
            this.add_editor_bar(
                this.new_editor_bar(0, 0)
            );
        }
    }
    get_editor_bar_client_pos(ebid){
        let op=this.canvas.get_content_origin_pos();
        let eb_data=this.canvas.editor_bars[ebid];
        return {
            x:op.x+eb_data.pos_x*this.canvas.scale,
            y:op.y+eb_data.pos_y*this.canvas.scale,
        }
    }
    get_editor_bar_data_by_ebid(ebid){
        return this.canvas.editor_bars[ebid]
    }
    new_editor_bar(px,py){
        return new EditorBar(px,py)
        // {
        //     pos_x: px,
        //     pos_y: py,
        //     width:150,
        //     height:150,
        //     content:"",
        //     conns: [],
        // }
    }
    /**@param bar {EditorBar}
     **/
    add_editor_bar(bar){
        let canvas=this.canvas
        canvas.content_manager.backend_add_editor_bar_and_save(canvas.context,
            canvas,bar);


        let ck = canvas.chunk_helper.calc_chunk_pos(bar.pos_x, bar.pos_y);
        canvas.chunk_helper.add_new_2chunks(canvas.non_empty_chunks, ck);
        canvas.change_padding(
            canvas.chunk_helper.chunk_min_y * -400,
            canvas.chunk_helper.chunk_max_y * 400,
            canvas.chunk_helper.chunk_max_x * 300,
            canvas.chunk_helper.chunk_min_x * -300
        );
        // this.canvas.storage.save_bar();
    }
    add_editor_bar_in_center(canvas){
        console.log("add_editor_bar");
        let range_rec = canvas.$refs.range_ref.getBoundingClientRect();

        //区域中心 client坐标
        let mid_y = (range_rec.top + range_rec.bottom) / 2;
        let mid_x = (range_rec.left + range_rec.right) / 2;

        let origin_pos = canvas.get_content_origin_pos();
        let px = mid_x - origin_pos.x;
        let py = mid_y - origin_pos.y;
        let new_bar =
            canvas.editor_bar_manager.new_editor_bar(
                px / canvas.scale,
                py / canvas.scale)
        this.add_editor_bar(new_bar);
        // canvas.editor_bars.push(new_bar);
    }
    set_new_pos(ebid, eb, x, y){
        let old_ck = this.canvas.chunk_helper.calc_chunk_pos(eb.pos_x, eb.pos_y);
        eb.pos_x = x;
        eb.pos_y = y;
        this.canvas.line_connect_helper.bar_move(this.canvas, ebid);
        let ck = this.canvas.chunk_helper.calc_chunk_pos(x, y);
        if (old_ck != ck) {
            console.log("ck", ck);

            this.canvas.chunk_helper.move_chunk(this.canvas.non_empty_chunks, old_ck, ck);
            console.log(this.canvas.non_empty_chunks);
            this.canvas.change_padding(
                this.canvas.chunk_helper.chunk_min_y * -400,
                this.canvas.chunk_helper.chunk_max_y * 400,
                this.canvas.chunk_helper.chunk_max_x * 300,
                this.canvas.chunk_helper.chunk_min_x * -300
            );
            console.log(
                this.canvas.padding_add_up,
                this.canvas.padding_add_down,
                this.canvas.padding_add_left,
                this.canvas.padding_add_right
            );
        }
    }
    corner_drag_start(drag_helper){
        // eslint-disable-next-line no-empty
        if(drag_helper){
            console.log(drag_helper)
            console.log(this)
            this.corner_drag_helper=drag_helper
        }
    }
    content_change(ebid,content){
        this.canvas.editor_bars[ebid].content=content;
        this.canvas.content_manager.backend_editor_bar_change_and_save(
            this.canvas.context,this.canvas,
            new EditorBarChange(
                EditorBarChangeType.ContentChange,
                null,
            )
        )
        // this.canvas.storage.save_bar();
    }
    on_mouse_move(event,mouse_rec,scale){
        if(this.corner_drag_helper&&event){
            let data=this.get_editor_bar_data_by_ebid(
                this.corner_drag_helper.editor_bar.ebid);
            let delta=mouse_rec.get_delta()
            data.width+=delta.dx/scale;
            data.height+=delta.dy/scale;
        }
    }
    on_mouse_up(){
        this.corner_drag_helper=null
    }
}
class EditorBarRightMenuHelper {
    // eslint-disable-next-line no-unused-vars
    get_right_menu_content(editor_bar){
        let content=new RightMenuFunc.RightMenuContent()
        content.add_one_selection("删除",()=>{
            console.log("删除 callback")
            editor_bar.emit_delete()
        })
        return content;
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
    EditorBarManager,
    EditorBarRightMenuHelper,
    EditorBar,
    EditorBarChange,
    EditorBarChangeType
}