<template>
  <div
    class="editor_bar"
    @mousedown="handle_mouse_down"
    @mouseup="handle_mouse_up"
  >
    <quill-editor
      v-model:value="content"
      :options="editorOption"
      :disabled="disabled"
    />
  </div>
</template>

<script>
// import EditorJS from "@editorjs/editorjs";
// import { quillEditor } from "vue-quill-editor";
export default {
  name: "EditorBarMove",
  mounted() {
    // new Quill(".editor_bar");
    // new EditorJS("editor_bar" + this.ebid);
  },
  data() {
    return {
      drag_on_x: 0,
      drag_on_y: 0,

      curTheme: "snow",
      showEditor: true,
      content: "<p>2333</p>",
      editorOption: {
        placeholder: "core",
        modules: {
          toolbar: false,
        },
      },
    };
  },
  methods: {
    handle_mouse_down(event) {
      if (event.buttons == 1) {
        this.drag_on_x = event.offsetX;
        this.drag_on_y = event.offsetY;
        this.$emit("start_drag", event, this);
      }
    },
    handle_mouse_up(event) {
      // console.log(this.ebid, event);
      this.$emit("drag_release", event, this);
    },
  },
  props: {
    ebid: Number,
  },
};
</script>

<style scoped>
.editor_bar {
  background: rgb(235, 234, 234);
  width: 280px;
  height: 380px;
  border: 1px solid #000;
}
.editor {
  height: 100%;
}
</style>