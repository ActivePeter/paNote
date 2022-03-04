<template>
  <div
    class="editor_bar"
    @mousedown="handle_mouse_down"
    @mouseup="handle_mouse_up"
    @mouseover="handle_mouse_over"
    @mouseleave="handle_mouse_leave"
    :style="{height: height+'px',width:width+'px'}"
    :id="'editor_'+ebid"
  >

    <quill-editor
      :value="content"
      :options="editorOption"
      :disabled="ebid!=editing_ebid"
      @update:value="content_change"
      ref="quill_editor_ref"
    />
    <div class="tool_line">
      <div class="editor_drag rb tool_line_bar"
           v-show="mouse_over"
           @mousedown="corner_drag_helper.handle_mouse_drag_down"
      >
      </div>

      <div
          @click="switch_mode"
          v-show="ebid==editing_ebid||mouse_over"
          class="tool_line_bar">

        {{ ebid==editing_ebid ? "done" : "edit" }}
      </div>
    </div>
  </div>
</template>

<script>
import QuillEditor from "@/components/QuillEditor";
import EditorBarFunc from "@/components/EditorBarFunc";
import RightMenuFunc from "@/components/RightMenuFunc";

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
      // content: "<p></p>",
      editorOption: {
        placeholder: "write sth",
        modules: {
          toolbar: false,
        },
      },
      editing: false,
      mouse_over:false,

      right_menu_helper:new EditorBarFunc.EditorBarRightMenuHelper()
    };
  },
  methods: {
    emit_delete(){
      this.$emit("delete",this)
    },
    content_change(content){
      // this.content=content;
      this.$emit("content_change",this.ebid,content)
    },
    choose_tool(args){
      if(args[0]=='indent'){
        if(args[1]=='foward'){
          this.$refs.quill_editor_ref.do_operation(args[0],1);
        }else{
          this.$refs.quill_editor_ref.do_operation(args[0],-1);
        }
      }else if(args[0]=='head'){
        this.$refs.quill_editor_ref.quill_format("header",args[1]);
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
        // this.drag_on_x = event.offsetX;
        // this.drag_on_y = event.offsetY;
        this.$emit("start_drag", event, this);
      }
      RightMenuFunc.if_right_click_then_emit(event,"editor_bar",this);
      // event.preventDefault();
    },
    handle_mouse_up(event) {
      // console.log(this.ebid, event);
      this.$emit("drag_release", event, this);
    },

    handle_mouse_over(){
      this.mouse_over=true;
    },
    handle_mouse_leave(){
      this.mouse_over=false;
    }
  },
  props: {
    ebid: String,
    editing_ebid:Number,
    toolbar_on:Boolean,
    width:Number,
    height:Number,
    content:String,
  },
};
</script>

<style scoped>
.editor_bar {
  background: rgb(235, 234, 234);
  /*width: 280px;*/
  /*height: 380px;*/
  /*border: 1px solid #000;*/
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
  /*position: absolute;*/
  width: 16px;
  height: 16px;

}
.editor_drag.rb{
  bottom: -16px;
  right: 0px;
  z-index: 100;
}
.tool_line{
  width: 100%;
  height: 25px;
  box-sizing: border-box;
border-left: 1px solid #ccc;
  border-right: 1px solid #ccc;
  border-bottom:1px solid #ccc ;
  background: rgb(235, 234, 234);
}
.tool_line_bar{
  float: right;
  height: 100%;
  line-height: 25px;
  padding-left: 5px;
  padding-right:5px ;
  margin-left: 5px;
  background: #a6a6a6;
  cursor:pointer
}
</style>