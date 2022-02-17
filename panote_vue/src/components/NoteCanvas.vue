<template>
  <div class="note_canvas">
    <div class="range">
      <div class="content" :style="{ transform: 'scale(' + scale + ')' }">
        content
      </div>
    </div>
    <div class="info">
      scroll_enabled:{{ scroll_enabled }} scale: {{ scale }}
    </div>
  </div>
</template>
<script>
export default {
  name: "NoteCanvas",
  mounted() {
    window.addEventListener("keyup", this.handle_key_up);
    window.addEventListener("keydown", this.handle_key_down);
    window.addEventListener("mousewheel", this.handle_scroll);
  },
  data() {
    return {
      scroll_enabled: false,
      scale: 1,
      scale_step: 0.01,
    };
  },
  methods: {
    handle_key_up(val) {
      if (val.key == " ") {
        console.log("handle_key_up", val);
        this.scroll_enabled = false;
      }
    },
    handle_key_down(val) {
      if (val.key == " ") {
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
  position: relative;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: rgb(255, 200, 200);
  height: 100%;
}
</style>