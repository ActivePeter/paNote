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
class CanvasDrawer {
    draw(
        // canvas
    ) {
        // let canvas_ref = canvas.$refs.canvas_ref
        // canvas_ref.width = 100 * canvas.scale
        // canvas_ref.height = 100 * canvas.scale
        // var ctx = canvas_ref.getContext("2d");
        // ctx.moveTo(0, 0);

        // ctx.lineWidth = 10;
        // ctx.lineTo(50, 50);
        // ctx.stroke();
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
    CanvasDrawer,
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
    line_connect_helper: new LineConnectHelper()
}