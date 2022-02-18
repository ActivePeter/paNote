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
    return {};
  },
  methods: {
    handle_mouse_down(event) {
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