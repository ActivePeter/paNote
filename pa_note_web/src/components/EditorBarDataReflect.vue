<template>
  <div class="container">
    <quill-editor
        :disabled="true"
        :options="option"
        :value="content"
    ></quill-editor>

    <el-button class="menu_btn" :icon="icon" size="small" circle
      @click="locate_bar"
    ></el-button>
  </div>
</template>

<script>
import QuillEditor from "@/components/QuillEditor";
import AppFunc, {AppFuncTs} from "@/logic/AppFunc";
import { Search } from '@element-plus/icons-vue'

export default {
  name: "EditorBarDataReflect",
  components:{
    QuillEditor,
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
  created() {
    this.ctx=AppFuncTs.appctx
  },
  mounted() {

  },
  data() {
    return {
      icon:Search,
      ctx:new AppFuncTs.Context(null)
    };
  },
  methods: {
    locate_bar(){
      this.ctx.uiopes().locate_eb_in_cur_note(this.link_info)
    }
    // locate_bar(){
    //   this.$emit("locate_bar",this.link_info)
    //   // console.log("locate_bar")
    //   // AppFuncTs.NoteCanvasRelate.locate_editor_bar(this.link_info)
    // }
  },
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
  position: relative;
  /*box-sizing: border-box;*/
}
.menu_btn{
  position: absolute;
  top: 10px;
  right: 10px;

}
</style>