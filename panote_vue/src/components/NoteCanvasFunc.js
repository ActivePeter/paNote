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
    CanvasMouseDragHelper
}