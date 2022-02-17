<template>
  <div class="note_canvas">
    <div
      class="range"
      ref="range_ref"
      @mousedown="handle_mouse_down"
      @mouseup="handle_mouse_up"
    >
      <div
        class="content"
        :style="{
          transform: 'scale(' + scale + ')',
          margin: edge_size_h + 'px ' + edge_size_w + 'px',
        }"
      >
        content
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

export default {
  name: "NoteCanvas",
  mounted() {
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
    handle_mouse_down() {
      this.dragging = true;
    },
    handle_mouse_move(val) {
      if (val.buttons == 1 && this.scroll_enabled) {
        console.log(val);
      } else {
        this.dragging = false;
      }
    },
    handle_mouse_up() {
      this.dragging = false;
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
</style>