<template>
  <quill-editor
      :disabled="true"
      :options="editorOption"
      :value="editorbar.content"
  ></quill-editor>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import QuillEditor from "@/components/QuillEditor.vue";
import { EditorBar } from './EditorBarFunc';
@Options({
  props: {
    editorbar:Object
  },
  components:{
    QuillEditor
  }
})
export default class EditorBarReflect extends Vue {
  $props!: {
    editorbar:EditorBar
  }
  editorOption= {
    placeholder: "write sth",
    modules: {
      toolbar: false,
    },
  }
}
</script>

t<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/*.cmd_name {*/
/*  display: inline-block;*/
/*  !*height: 32px;*!*/
/*  !*vertical-align: middle;*!*/
/*  position: absolute;*/
/*  top: 50%;*/
/*  transform: translateY(-50%);*/
/*}*/

/*.card {*/
/*  !*position: relative;*!*/
/*  vertical-align: middle;*/
/*}*/

/*.btns {*/
/*  float: right;*/
/*}*/
</style>
