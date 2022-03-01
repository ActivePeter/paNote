<template>
  <div
    class="editor_bar"
    @mousedown="handle_mouse_down"
    @mouseup="handle_mouse_up"
    @click="handle_click"
    :style="{height: height+'px',width:width+'px'}"
    :id="'editor_'+ebid"
  >
    <div class="editor_drag rb"
         @mousedown="corner_drag_helper.handle_mouse_drag_down"
    >
    </div>
    <quill-editor
      v-model:value="content"
      :options="editorOption"
      :disabled="ebid!=editing_ebid"
      ref="quill_editor_ref"
    />
    <el-button class="edit_btn" type="primary" round @click="switch_mode"
      >{{ ebid==editing_ebid ? "done" : "edit" }}
    </el-button>
  </div>
</template>

<script>
import QuillEditor from "@/components/QuillEditor";
import EditorBarFunc from "@/components/EditorBarFunc";
// import $ from "jquery"
// import EditorJS from "@editorjs/editorjs";
// import { quillEditor } from "vue-quill-editor";
export default {
  name: "EditorBarMove",
  components:{
    QuillEditor
  },
  watch:{
    toolbar_on(v){
      if(v){
        this.$refs.quill_editor_ref.set_input_able(false);
      }else{
        this.$refs.quill_editor_ref.set_input_able(true);
      }
    }
  },
  mounted() {

    // this.hide_tool_bar();
    // new Quill(".editor_bar");
    // new EditorJS("editor_bar" + this.ebid);
  },
  data() {
    return {
      corner_drag_helper:new EditorBarFunc.CornerDragHelper(this),

      input_able:false,
      drag_on_x: 0,
      drag_on_y: 0,

      curTheme: "snow",
      content: "<p></p>",
      editorOption: {
        placeholder: "write sth",
        modules: {
          toolbar: false,
        },
      },
      editing: false,
    };
  },
  methods: {

    choose_tool(args){
      if(args[0]=='indent'){
        if(args[1]=='foward'){
          this.$refs.quill_editor_ref.do_operation(args[0],1);
        }else{
          this.$refs.quill_editor_ref.do_operation(args[0],-1);
        }
      }
    },
    switch_mode() {
      this.$emit("switch_mode", this);

      // this.editing = !this.editing;
      // if(this.editing){
      //   this.show_tool_bar()
      //
      // }else{
      //   this.hide_tool_bar()
      // }
    },
    corner_drag_start(event){
      this.corner_drag_helper.handle_mouse_drag_down(event)
      event.stopPropagation();
    },
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
    editing_ebid:Number,
    toolbar_on:Boolean,
    width:Number,
    height:Number,
  },
};
</script>

<style scoped>
.editor_bar {
  background: rgb(235, 234, 234);
  /*width: 280px;*/
  /*height: 380px;*/
  border: 1px solid #000;
}
.editor {
  height: 100%;
}
.edit_btn {
  position: absolute;
  right: 0;
  bottom: -40px;
}
.editor_drag{
  position: absolute;
  width: 16px;
  height: 16px;
  background: #1d1e30;
}
.editor_drag.lt{
  top: -8px;
  left: -8px;
  z-index: 100;
}
.editor_drag.rt{
  top: -8px;
  right: -8px;
  z-index: 100;
}
.editor_drag.lb{
  bottom: -8px;
  left: -8px;
  z-index: 100;
}
.editor_drag.rb{
  bottom: -8px;
  right: -8px;
  z-index: 100;
}
</style>