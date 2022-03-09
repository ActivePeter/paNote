<template>
  <div class="container">
    <quill-editor
        :disabled="true"
        :options="option"
        :value="content"
    ></quill-editor>
  </div>
</template>

<script>
import QuillEditor from "@/components/QuillEditor";
import AppFunc from "@/AppFunc";
export default {
  name: "EditorBarDataReflect",
  components:{
    QuillEditor
  },
  computed:{
    content(){
      const canvas=AppFunc.get_ctx().app.app_ref_getter.get_note_canvas(AppFunc.get_ctx().app);
      if(canvas.content_manager.cur_note_id===this.link_info.noteid){
        return canvas.editor_bars[this.link_info.barid].content
      }
      return "note_is_not_loaded";
    }
  },
  mounted() {},
  data() {
    return {};
  },
  methods: {},
  props: {
    option:Object,
    link_info:Object
  },
};
</script>

<style scoped>
.container{
  max-height: 200px;
  overflow-y:scroll;
}
</style>