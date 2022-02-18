<template>
  <div class="note_canvas">
    <div
      class="range"
      ref="range_ref"
      @mousedown="handle_mouse_down"
      @mouseup="handle_mouse_up"
    >
      <div
        class="content_padding"
        :style="{
          padding:
            edge_size_h +
            padding_add_up +
            'px ' +
            (edge_size_w + padding_add_right) +
            'px ' +
            (edge_size_h + padding_add_down) +
            'px ' +
            (edge_size_w + padding_add_left) +
            'px',
        }"
      >
        <div
          class="content"
          :style="{
            transform: 'scale(' + scale + ')',
          }"
        >
          content
          <div
            class="content_chunk_range"
            :style="{
              right: -padding_add_right + 'px',
              left: -padding_add_left + 'px',
              top: -padding_add_up + 'px',
              bottom: -padding_add_down + 'px',
            }"
          ></div>
          <EditorBar />
          <EditorBarMove
            v-for="(item, i) in editor_bars"
            :key="i"
            :ebid="i"
            class="editor_bar_move"
            :style="{ top: item.pos_y + 'px', left: item.pos_x + 'px' }"
            @start_drag="editor_bar_start_drag"
          />
        </div>
      </div>
    </div>
    <div class="info">
      scroll_enabled:{{ scroll_enabled }}, scale: {{ scale }}, dragging:
      {{ dragging }}
    </div>
  </div>
</template>

<script>
import ElementResizeDetectorMaker from "element-resize-detector";
import EditorBar from "./EditorBar.vue";
import EditorBarMove from "./EditorBarMoveTest.vue";
import NoteCanvasFunc from "./NoteCanvasFunc.js";
export default {
  name: "NoteCanvas",
  components: {
    EditorBar,
    EditorBarMove,
  },
  mounted() {
    this.mouse_recorder = NoteCanvasFunc.new_mouse_recorder();
    this.chunk_helper = NoteCanvasFunc.new_chunk_helper();
    window.addEventListener("keyup", this.handle_key_up);
    window.addEventListener("keydown", this.handle_key_down);

    window.addEventListener("mousewheel", this.handle_scroll);
    window.addEventListener("mouseup", this.handle_mouse_up);
    window.addEventListener("mousemove", this.handle_mouse_move);
    this.$refs.range_ref.addEventListener(
      "mousewheel",
      this.handle_range_scroll
    );
    let erd = ElementResizeDetectorMaker();
    let _this = this;
    erd.listenTo(this.$refs.range_ref, function (element) {
      var width = element.offsetWidth;
      var height = element.offsetHeight;
      console.log("Size: " + width + "x" + height);
      //根据画布区域大小计算白边尺寸
      if (width > 100) {
        _this.edge_size_w = width - 80;
      } else {
        _this.edge_size_w = width;
      }
      if (height > 100) {
        _this.edge_size_h = height - 80;
      } else {
        _this.edge_size_h = height;
      }
    });
  },
  data() {
    return {
      scroll_enabled: false,
      scale: 1,
      scale_step: 0.1,
      dragging: false,
      edge_size_w: 100,
      edge_size_h: 100,
      moving_obj: null,
      editor_bars: [
        {
          pos_x: 0,
          pos_y: 0,
        },
      ],
      mouse_recorder: null,
      padding_add_up: 0,
      padding_add_down: 0,
      padding_add_left: 0,
      padding_add_right: 0,
      chunk_helper: null,
      non_empty_chunks: {
        "0,0": 1,
      },
    };
  },
  methods: {
    handle_range_scroll(event) {
      if (this.scroll_enabled) {
        event.preventDefault();
      }
    },
    handle_key_up(val) {
      if (val.key == "b") {
        console.log("handle_key_up", val);
        this.scroll_enabled = false;
      }
    },
    handle_key_down(val) {
      if (val.key == "b") {
        console.log("handle_key_down", val);
        this.scroll_enabled = true;
      }
    },
    handle_scroll(val) {
      if (this.scroll_enabled) {
        console.log("handle_scroll", val);
        this.scale_canvas(val.deltaY);
      }
    },
    handle_mouse_down(event) {
      this.mouse_recorder.call_before_move(
        event.clientX,
        event.clientY
        //   event.screenX, event.screenY
      );
      console.log("note canvase mouse down");
      this.dragging = true;
    },
    handle_mouse_move(val) {
      if (val.buttons != 0) {
        //有按键按下
        this.mouse_recorder.update_pos_on_move(
          val.clientX,
          val.clientY
          //   event.screenX, event.screenY
        );
        let delta = this.mouse_recorder.get_delta();

        //拖拽画布
        if (val.buttons == 1 && this.scroll_enabled) {
          console.log(val);
        } else {
          this.dragging = false;
        }
        //拖拽文本块
        if (this.moving_obj != null) {
          let bar_data = this.editor_bars[this.moving_obj.ebid];

          this.editor_bar_set_new_pos(
            bar_data,
            bar_data.pos_x + delta.dx / this.scale,
            bar_data.pos_y + delta.dy / this.scale
          );
          //   console.log("bar_data", bar_data);
        }
      }
    },
    handle_mouse_up() {
      this.dragging = false;
      this.moving_obj = null;
    },
    scale_canvas(dir) {
      let scale_bak = this.scale;
      if (dir > 0) {
        scale_bak += this.scale_step;
      } else {
        scale_bak -= this.scale_step;
      }
      if (scale_bak < 3 && scale_bak > 0.1) {
        this.final_set_scale(scale_bak);
      }
    },
    final_set_scale(scale) {
      this.scale = scale;
    },
    change_padding(u, d, r, l) {
      console.log("change padding", u, d, r, l);
      let dl = l - this.padding_add_left;
      let dh = u - this.padding_add_up;

      this.padding_add_up = u;
      this.padding_add_down = d;
      this.padding_add_right = r;
      this.padding_add_left = l;

      if (dl != 0) {
        console.log("dr", this.$refs.range_ref.scrollLeft, dl);
        this.$refs.range_ref.scrollLeft += dl;
      }

      //   console.log(u, this.padding_add_up);
      //   console.log(l, this.padding_add_left);
      if (dh != 0) {
        console.log("dh", this.$refs.range_ref.scrollTop, dh);
        this.$refs.range_ref.scrollTop += dh;
      }
    },
    editor_bar_set_new_pos(eb, x, y) {
      let old_ck = this.chunk_helper.calc_chunk_pos(eb.pos_x, eb.pos_y);
      eb.pos_x = x;
      eb.pos_y = y;
      let ck = this.chunk_helper.calc_chunk_pos(x, y);
      if (old_ck != ck) {
        console.log("ck", ck);

        this.chunk_helper.move_chunk(this.non_empty_chunks, old_ck, ck);
        console.log(this.non_empty_chunks);
        this.change_padding(
          this.chunk_helper.chunk_min_y * -400,
          this.chunk_helper.chunk_max_y * 400,
          this.chunk_helper.chunk_max_x * 300,
          this.chunk_helper.chunk_min_x * -300
        );
        console.log(
          this.padding_add_up,
          this.padding_add_down,
          this.padding_add_left,
          this.padding_add_right
        );
      }

      //   let ebw = 100;
      //   let ebh = 100;
      //超出原有范围需要重新设置背景面板的size
    },
    editor_bar_start_drag(event, eb) {
      //   console.log(eb);
      this.mouse_recorder.call_before_move(
        event.clientX,
        event.clientY
        //   event.screenX, event.screenY
      );
      event.stopPropagation(); //阻止传递到上层，即handle_mouse_down
      this.moving_obj = eb;
    },
  },
  props: {},
};
</script>

<style scoped>
.info {
  float: left;
}
.range {
  height: 100%;
  overflow: scroll;
}
.content {
  background-color: rgb(255, 200, 200);
  height: 400px;
  width: 300px;
}
.editor_bar_move {
  position: absolute;
}
.content_chunk_range {
  position: absolute;
  border: 1px solid #000;
}
</style>