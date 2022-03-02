//移动组件时用于重新计算区块范围
class ChunkHelper {
    chunk_max_x = 0;
    chunk_max_y = 0;
    chunk_min_x = 0;
    chunk_min_y = 0;
    add_new_2chunks(non_empty_chunks, ck) {
        console.log("add_new_2chunks")
        if (!(ck in non_empty_chunks)) {
            non_empty_chunks[ck] = 1
        } else {
            non_empty_chunks[ck]++;
        }
        this.recalc_chunk_range(non_empty_chunks)
    }
    calc_chunk_pos(x, y) {
        let cx = 0, cy = 0;
        cx = Math.floor(x / 300);
        cy = Math.floor(y / 400);
        return cx + "," + cy
    }
    move_chunk(non_empty_chunks, oldck, newck) {
        if (!(oldck in non_empty_chunks)) {
            console.log("no ck, not ok")
            return;
        }
        non_empty_chunks[oldck]--;
        if (non_empty_chunks[oldck] <= 0) {
            delete non_empty_chunks[oldck];
        }
        if (!(newck in non_empty_chunks)) {
            non_empty_chunks[newck] = 1;
        } else {

            non_empty_chunks[newck]++;
        }
        this.recalc_chunk_range(non_empty_chunks)
        console.log(this)
    }
    recalc_chunk_range(non_empty_chunks) {
        this.chunk_max_x = 0;
        this.chunk_max_y = 0;
        this.chunk_min_x = 0;
        this.chunk_min_y = 0;
        for (var key in non_empty_chunks) {
            let x_y = key.split(",")
            let x = parseInt(x_y[0]);
            let y = parseInt(x_y[1])
            if (x < this.chunk_min_x) {
                this.chunk_min_x = x;
            } else if (x > this.chunk_max_x) {
                this.chunk_max_x = x;
            }
            if (y < this.chunk_min_y) {
                this.chunk_min_y = y;
            } else if (y > this.chunk_max_y) {
                this.chunk_max_y = y;
            }
        }
    }
    first_calc_chunks(canvas){
        for(let i=0;i<canvas.editor_bars.length;i++){
            let bar=canvas.editor_bars[i]
            let ck = canvas.chunk_helper.calc_chunk_pos(bar.pos_x, bar.pos_y);
            canvas.chunk_helper.add_new_2chunks(canvas.non_empty_chunks, ck);
            canvas.change_padding(
                canvas.chunk_helper.chunk_min_y * -400,
                canvas.chunk_helper.chunk_max_y * 400,
                canvas.chunk_helper.chunk_max_x * 300,
                canvas.chunk_helper.chunk_min_x * -300
            );
        }

    }
}

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
class PathStruct {
    ox = 0;//path块原点
    oy = 0;
    b_bar = -1;
    e_bar = -1;
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
    set_pos(bx, by, ex, ey) {
        this.w = Math.abs(bx - ex)
        this.h = Math.abs(by - ey)
        this.ox = Math.min(ex, bx)
        this.oy = Math.min(ey, by)

        this.ex = ex - this.ox;
        this.ey = ey - this.oy;
        this.bx = bx - this.ox;
        this.by = by - this.oy;
        return this
    }
    change_end_pos(ex, ey) {
        this.set_pos(this.ox + this.bx, this.oy + this.by, ex, ey)
    }
    change_begin_pos(bx, by) {
        this.set_pos(bx, by, this.ox + this.ex, this.oy + this.ey)
    }
}
class LineConnectHelper {
    bar_move(canvas, ebid) {
        let bar_data = canvas.editor_bars[ebid]
        console
        for (let i in bar_data.conns) {
            // console.log(path)
            let path_key = bar_data.conns[i]
            let p = canvas.paths[path_key]
            if (p.e_bar == ebid) {
                p.change_end_pos(bar_data.pos_x, bar_data.pos_y)
            } else if (p.b_bar == ebid) {
                p.change_begin_pos(bar_data.pos_x, bar_data.pos_y)
            }
        }
    }
    end_connect(canvas, canvas_x, canvas_y, ebid) {
        canvas.connecting_path.change_end_pos(canvas_x, canvas_y);
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
        }
        canvas.connecting_path = null;
    }
    move_connect(NoteCanvasFunc, canvas, bclient_x, bclient_y) {
        let startp = NoteCanvasFunc.client_pos_2_canvas_item_pos(
            canvas,
            bclient_x,
            bclient_y
        );
        canvas.connecting_path.change_end_pos(
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
        canvas.connecting_path = new NoteCanvasFunc.PathStruct().set_pos(
            cx,
            cy, cx, cy
        );
        canvas.connecting_path.b_bar = ebid
        // canvas.paths.push(canvas.connecting_path);
    }
}
class Storage{
    canvas
    constructor(canvas) {
        this.canvas=canvas;
        this.load_all();
    }
    load_all(){
        console.log("load_all")
        if(typeof localStorage.editor_bars=='string'){
            console.log(localStorage.editor_bars)
            try {
                this.canvas.editor_bars = JSON.parse(localStorage.editor_bars);
                if(!Array.isArray(this.canvas.editor_bars)){
                    this.canvas.editor_bars=[]
                }
            }catch (e){
                console.log(e)
                this.canvas.editor_bars=[]
            }
        }
        console.log(this.canvas.editor_bars);
    }
    save_all(){
        console.log("save_all")
        localStorage.editor_bars=
            JSON.stringify(this.canvas.editor_bars);
    }
    export(){
        var FileSaver = require('file-saver');
        var blob = new Blob(
            [JSON.stringify(this.canvas.editor_bars)],
            {type: "text/plain;charset=utf-8"});
        FileSaver.saveAs(blob, "hello world.txt");
    }
}
class DragBarHelper{
    update_cnt=0;
    update_moving_obj_pos(canvas) {
        this.update_cnt++;
        let bar_data = canvas.editor_bars[canvas.moving_obj.ebid];
        let origin_pos = canvas.get_content_origin_pos();
        //   var bar_pos = this.get_moving_obj_pos();
        let dx =
            canvas.mouse_recorder.mouse_cur_x -
            origin_pos.x -
            canvas.moving_obj.drag_on_x * canvas.scale;
        let dy =
            canvas.mouse_recorder.mouse_cur_y -
            origin_pos.y -
            canvas.moving_obj.drag_on_y * canvas.scale;
        //   console.log("canvas dx dy", dx, dy, bar_pos);
        canvas.editor_bar_set_new_pos(
            canvas.moving_obj.ebid,
            bar_data,
            dx / canvas.scale,
            dy / canvas.scale
        );
    }
    start_drag(NoteCanvasFunc,canvas,event,eb){
        this.update_cnt=0;
        canvas.mouse_recorder.call_before_move(
            event.clientX,
            event.clientY
            //   event.screenX, event.screenY
        );
        event.stopPropagation(); //阻止传递到上层，即handle_mouse_down
        if (canvas.cursor_mode == "拖拽") {
            console.log("开始拖拽")
            if(canvas.editor_bar_manager.corner_drag_helper==null){
                canvas.moving_obj = eb;
            }
        } else if (canvas.cursor_mode == "连线") {
            let bar_data = canvas.editor_bars[eb.ebid];
            canvas.line_connect_helper.begin_connect_from_canvaspos(
                NoteCanvasFunc,
                canvas,
                bar_data.pos_x,
                bar_data.pos_y,
                eb.ebid
            );
        }
    }
    end_drag(canvas){
        if(canvas.moving_obj!=null){
            canvas.moving_obj = null;
            if(this.update_cnt>0){
                canvas.storage.save_all()
            }
        }
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
    new_chunk_helper: function () {
        return new ChunkHelper();
    },
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
    DragBarHelper,
}