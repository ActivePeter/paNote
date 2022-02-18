<template>
  <div
    class="editor_bar"
    @mousedown="handle_mouse_down"
    @mouseup="handle_mouse_up"
  >
    editor_bar
  </div>
</template>

<script>
export default {
  name: "EditorBarMove",
  mounted() {},
  data() {
    return {
      drag_on_x: 0,
      drag_on_y: 0,
    };
  },
  methods: {
    handle_mouse_down(event) {
      this.drag_on_x = event.offsetX;
      this.drag_on_y = event.offsetY;
      this.$emit("start_drag", event, this);
    },
    handle_mouse_up() {},
  },
  props: {
    ebid: Number,
  },
};
</script>

<style scoped>
.editor_bar {
  background: gray;
  width: 100px;
  height: 100px;
  border: 1px solid #000;
}
</style>