//移动组件时用于重新计算区块范围
import Util from "@/components/reuseable/Util";
import EditorBarFunc from "@/components/EditorBarFunc";
import PathFunc from "@/components/PathFunc";
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
        canvas.$refs.range_ref.scrollLeft -= delta.dx;
        canvas.$refs.range_ref.scrollTop -= delta.dy;
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
    set_begin(b_bar) {
        this.b_bar = b_bar
    }
    set_end(e_bar) {
        this.e_bar = e_bar
    }

}
class LineConnectHelper {
    path_set_pos(path,bx, by, ex, ey) {
        path.w = Math.abs(bx - ex)
        path.h = Math.abs(by - ey)
        path.ox = Math.min(ex, bx)
        path.oy = Math.min(ey, by)

        path.ex = ex - path.ox;
        path.ey = ey - path.oy;
        path.bx = bx - path.ox;
        path.by = by - path.oy;
        return path
    }
    path_change_end_pos(path,ex, ey) {
        this.path_set_pos(path,path.ox + path.bx, path.oy + path.by, ex, ey)
    }
    path_change_begin_pos(path,bx, by) {
        this.path_set_pos(path,bx, by, path.ox + path.ex, path.oy + path.ey)
    }
    remove_bar_paths(canvas,ebid){
        let bar_data = canvas.editor_bars[ebid]

        // 遍历所有连线
        for (let i in bar_data.conns) {
            let path_key = bar_data.conns[i]
            let p = canvas.paths[path_key]
            let other_bar_id=p.b_bar;
            if(p.b_bar===ebid){
                other_bar_id=p.e_bar;
            }
            //移除对方方块对连线的存储
            Util.remove_one_in_arr(
                canvas.editor_bars[other_bar_id].conns,path_key);
            //移除连线
            delete canvas.paths[path_key];
        }
        bar_data.conns=[]
    }
    bar_move(canvas, ebid) {
        let bar_data = canvas.editor_bars[ebid]
        // console
        for (let i in bar_data.conns) {
            // console.log(path)
            let path_key = bar_data.conns[i]
            let p = canvas.paths[path_key]
            if (p.e_bar == ebid) {
                this.path_change_end_pos(p,bar_data.pos_x, bar_data.pos_y)
            } else if (p.b_bar == ebid) {
                this.path_change_begin_pos(p,bar_data.pos_x, bar_data.pos_y)
            }
        }
    }
    end_connect(canvas, canvas_x, canvas_y, ebid) {
        this.path_change_end_pos(canvas.connecting_path,
            canvas_x, canvas_y,
            )

        canvas.connecting_path.e_bar = ebid;
        let bbar = canvas.connecting_path.b_bar
        let key1 = bbar + ',' + ebid
        if ((key1) in canvas.paths || (ebid + ',' + bbar) in canvas.paths || ebid == bbar) {
            canvas.connecting_path = null;
        } else {
            canvas.paths[key1] = canvas.connecting_path;
            console.log(
                "valid one", key1
            )

            canvas.editor_bars[bbar].conns.push(key1)
            canvas.editor_bars[ebid].conns.push(key1)

            canvas.content_manager.backend_path_change_and_save(
                canvas.context,canvas,
                new PathFunc.PathChange(
                    PathFunc.PathChangeType.Add,
                    null,
                    null
                )
            )
            canvas.content_manager.backend_editor_bar_change_and_save(
                canvas.context,canvas,
                new EditorBarFunc.EditorBarChange(
                    EditorBarFunc.EditorBarChangeType.LineConnect,
                    null,
                ),
            )
            // canvas.storage.save_all();
            // canvas.storage.save_paths();
        }
        canvas.connecting_path = null;
    }
    move_connect(NoteCanvasFunc, canvas, bclient_x, bclient_y) {
        let startp = NoteCanvasFunc.client_pos_2_canvas_item_pos(
            canvas,
            bclient_x,
            bclient_y
        );
        this.path_change_end_pos(
            canvas.connecting_path,
            startp.x,
            startp.y,
        );
    }
    // begin_connect_from_clientpos(NoteCanvasFunc, canvas, bclient_x, bclient_y) {
    //     let startp = NoteCanvasFunc.client_pos_2_canvas_item_pos(
    //         canvas,
    //         bclient_x,
    //         bclient_y
    //     );
    //     canvas.connecting_path = new NoteCanvasFunc.PathStruct().set_pos(
    //         startp.x,
    //         startp.y,
    //         startp.x,
    //         startp.y
    //     );
    //     canvas.paths.push(canvas.connecting_path);
    // }
    begin_connect_from_canvaspos(NoteCanvasFunc, canvas, cx, cy, ebid) {
        // let startp = NoteCanvasFunc.client_pos_2_canvas_item_pos(
        //     canvas,
        //     bclient_x,
        //     bclient_y
        // );
        canvas.connecting_path =
            this.path_set_pos(new NoteCanvasFunc.PathStruct(),
                cx, cy, cx, cy
            )


        canvas.connecting_path.b_bar = ebid
        // canvas.paths.push(canvas.connecting_path);
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
        var FileSaver = require('file-saver');
        var blob = new Blob(
            [JSON.stringify({
                editor_bars:this.canvas.editor_bars,
                next_editor_bar_id:this.canvas.next_editor_bar_id,
                paths:this.canvas.paths
            })],
            {type: "text/plain;charset=utf-8"});
        FileSaver.saveAs(blob, "hello world.txt");
    }
    //废弃
    import_f(obj){
        if('paths' in obj && 'editor_bars' in obj && 'next_editor_bar_id' in obj){
            localStorage.editor_bars=JSON.stringify(obj.editor_bars);
            localStorage.paths=JSON.stringify(obj.paths);
            localStorage.next_editor_bar_id=obj.next_editor_bar_id;
            this.load_all();
        }
        // const reader = new FileReader();

        // reader.onload = e => console.log(e.target.result);

        // reader.readAsText(file);
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
    LineConnectHelper,
    Storage,
    // DragBarHelper,
    // ContentManager,
    // NoteContentData
}