<template>
  <div class="editor_bar">editor_bar
    <div id="editorjs"></div>
  </div>
</template>

<script>
import EditorJS from '@editorjs/editorjs';

export default {
  name: "EditorBar",
  mounted() {},
  data() {
    return {};
  },
  methods: {},
  props: {},
};


const editor = new EditorJS();// eslint-disable-line no-unused-vars

</script>

<style scoped>
.editor_bar {
  background: gray;
  width: 100px;
  height: 100px;
}
</style>