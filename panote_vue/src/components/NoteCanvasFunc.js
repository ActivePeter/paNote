class ChunkHelper {
    chunk_max_x = 0;
    chunk_max_y = 0;
    chunk_min_x = 0;
    chunk_min_y = 0;
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
        console.log(this)
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
    }
}