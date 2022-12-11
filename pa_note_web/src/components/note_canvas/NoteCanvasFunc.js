//移动组件时用于重新计算区块范围
// import {NoteCanvasTs} from "@/components/NoteCanvasTs";
// import {ReviewPartFunc} from "@/components/ReviewPartFunc";
// import {NoteCanvasTs} from "@/components/NoteCanvasTs";
// import {NoteOutlineTs} from "@/components/NoteOutlineTs";
// import {LinkCanvasBarToListView} from "@/components/LinkCanvasBarToListView";



//记录并处理canvas的鼠标拖拽
class CanvasMouseDragHelper {
    dragging = false;
    start_drag_canvas() {
        this.dragging = true;

        // console.log("start_drag_canvas", this.dragging);
    }
    end_drag_canvas() {
        this.dragging = false;
        // event.preventDefault();
        // console.log("end_drag_canvas", this.dragging);
    }
    on_drag(
        canvas, event
    ) {

        // console.log("on_drag", this.dragging, event);
        if (!this.dragging) {
            return;
        }
        if (event.buttons != 2) {
            this.dragging = false;
            return;
        }
        let delta = canvas.mouse_recorder.get_delta();
        // canvas.scale_offx+=delta.dx
        // canvas.scale_offy+=delta.dy
        canvas.content_manager.user_interact.canvas_drag(
            delta.dx,
        delta.dy
        )
        // canvas.$refs.range_ref.scrollLeft -=;
        // canvas.$refs.range_ref.scrollTop -= ;
        // console.log(canvas);
        // canvas.mouse_recorder.get_delta()
        // canvas = 1
        // event = 1
    }
}
export class PathStruct {
    ox = 0;//path块原点
    oy = 0;
    b_bar = "-1";
    e_bar = "-1";
    w = 10;//path块size
    h = 10;
    bx = 0;
    by = 0;
    ex = 0;
    ey = 0;
    type=0;
    set_begin(b_bar) {
        this.b_bar = b_bar
        return this
    }
    set_end(e_bar) {
        this.e_bar = e_bar
        return this
    }
}




//废弃
class Storage{
    canvas
    constructor(canvas) {
        this.canvas=canvas;
    }
    load_all(){

        if(localStorage.next_editor_bar_id){
            if(typeof localStorage.next_editor_bar_id==="string"){

                this.canvas.next_editor_bar_id
                    =    parseInt(localStorage.next_editor_bar_id)
            }else{

                this.canvas.next_editor_bar_id
                    =    localStorage.next_editor_bar_id
            }
        }


        console.log("load_all",this.canvas.next_editor_bar_id)
        if(typeof localStorage.editor_bars=='string'){
            console.log(localStorage.editor_bars)
            try {
                let ebs = JSON.parse(localStorage.editor_bars);
                if(Array.isArray(ebs)){
                    for(let i in ebs){
                        if(ebs[i]){
                            this.canvas.editor_bar_manager.add_editor_bar(ebs[i]);
                        }
                    }
                    this.canvas.chunk_helper.first_calc_chunks(this.canvas)
                }
                else if(typeof ebs=='object'){
                    this.canvas.editor_bars= ebs;
                    this.canvas.chunk_helper.first_calc_chunks(this.canvas)
                }
                // if(!Array.isArray(this.canvas.editor_bars)){
                //     this.canvas.editor_bars=[]
                // }
            }catch (e){
                console.log(e)
            }
        }
        if(typeof localStorage.paths=='string'){
            try {
                let p = JSON.parse(localStorage.paths);
                if(typeof p=='object'){
                    this.canvas.paths=p;
                }
            }catch (e){/**@param bar {EditorBarFunc.EditorBar}
             **/
                console.log(e)
                // this.canvas.editor_bars=[]
            }
        }
        console.log(this.canvas.editor_bars);
    }
    save_all(){
        this.save_bar()
        this.save_paths()
    }
    save_bar(){
        console.log("save_all")
        localStorage.editor_bars=
            JSON.stringify(this.canvas.editor_bars);
        localStorage.next_editor_bar_id=this.canvas.next_editor_bar_id;
    }
    save_paths(){
        localStorage.paths=
            JSON.stringify(this.canvas.paths);
    }
    export(){
    }
    //废弃
    import_f(obj){
    }
}


export default {
    new_mouse_recorder: function () {
        return Object({
            mouse_last_x: 0,
            mouse_last_y: 0,
            mouse_cur_x: 0,
            mouse_cur_y: 0,
            call_before_move(mouseX, mouseY) {
                this.mouse_cur_x = this.mouse_last_x = mouseX;
                this.mouse_cur_y = this.mouse_last_y = mouseY;
            },
            update_pos_on_move(mouseX, mouseY) {
                this.mouse_last_x = this.mouse_cur_x;
                this.mouse_last_y = this.mouse_cur_y;
                this.mouse_cur_x = mouseX;
                this.mouse_cur_y = mouseY;
            },
            get_delta() {
                return {
                    dx: this.mouse_cur_x - this.mouse_last_x,
                    dy: this.mouse_cur_y - this.mouse_last_y,
                }
            }
        });
    },
    // new_chunk_helper: function () {
    //     return new ChunkHelper();
    // },
    CanvasMouseDragHelper,
    PathStruct,
    client_pos_2_canvas_item_pos(canvas, x, y) {
        let origin = canvas.get_content_origin_pos()
        return {
            x: (x - origin.x)
                / canvas.scale
            ,
            y: (y - origin.y)
                / canvas.scale
        }
    },
    Storage,
    // DragBarHelper,
    // ContentManager,
    // NoteContentData
}