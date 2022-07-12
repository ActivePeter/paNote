<template>
  <div
    :class="'editor_bar'+select_class"
    @mousedown="handle_mouse_down"
    @mouseup="handle_mouse_up"
    @mouseover="handle_mouse_over"
    @mouseleave="handle_mouse_leave"
    :style="{height: height+'px',width:width+'px',opacity:opacity_str}"
    :id="'editor_'+ebid"
  >
    <quill-editor
      :value="content"
      :options="editorOption"
      :disabled="ebid!==editing_ebid"
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
          v-show="ebid===editing_ebid||mouse_over"
          class="tool_line_bar">

        {{ ebid===editing_ebid ? "done" : "edit" }}
      </div>
    </div>
  </div>
</template>

<script>
import QuillEditor from "@/components/QuillEditor";
import EditorBarFunc from "@/components/EditorBarFunc";
// import {RightMenuFuncTs} from "@/components/RightMenuFuncTs";
import {_PaUtilTs} from "@/3rd/pa_util_ts";
// import RightMenuFunc from "@/components/RightMenuFunc";

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
  computed:{
    select_class(){
      if(this.selected){
        return ' selected'
      }else{
        return ''
      }
    },
    opacity_str(){
      if(!this.search_ing){
        return "100%"
      }
      if(this.search_tar){
        return "100%"
      }
      return "20%"
    }
  },
  mounted() {
    // const _this=this;
    // console.log("rigst")
    // this.mouse_up_down_rec.set_click_callback(()=>{
    //   // console.log("click cb")
    //   RightMenuFuncTs.if_right_click_then_emit_bus(
    //       _this.mouse_up_down_rec._up,this.right_menu_helper.get_right_menu_content(this)
    //   )
    //   // RightMenuFuncTs.if_right_click_then_emit(
    //   //     _this.mouse_up_down_rec._up,"editor_bar",this);
    // })
    this.$nextTick(()=>{
      this.editor_bar_manager.editor_bar_comp_mounted(this)
    })
    // this.hide_tool_bar();
    // new Quill(".editor_bar");
    // new EditorJS("editor_bar" + this.ebid);
  },
  unmounted() {
    this.editor_bar_manager.editor_bar_comp_unmounted(this)
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

      right_menu_helper:new EditorBarFunc.EditorBarRightMenuHelper(),
      mouse_up_down_rec:new _PaUtilTs.MouseDownUpRecord()
    };
  },
  methods: {
    emit_copy(){
      this.$emit("copy",this)
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
        // eslint-disable-next-line no-empty
      }else if(args[0]=='code'){
        this.$refs.quill_editor_ref.do_operation('code',true);
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
    // handle_mouse_click(event){
    //   console.log("editor bar click")
    // },
    handle_mouse_down(event) {
      // console.log("eb mouse down")
      // this.mouse_up_down_rec.down(event)
      // if (event.buttons === 1) {
        // this.drag_on_x = event.offsetX;
        // this.drag_on_y = event.offsetY;
        this.$emit("ebmousedown", event, this);
      // }else
      // event.preventDefault();
    },
    handle_mouse_up(event) {
      // this.mouse_up_down_rec.up(event)
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
    editing_ebid:String,
    toolbar_on:Boolean,
    width:Number,
    height:Number,
    content:String,
    search_ing:Boolean,
    search_tar:Boolean,
    selected:Boolean(false),

    editor_bar_manager:Object,//vmodel
  },
};
</script>

<style scoped>
.editor_bar.selected{
  border-width: 4px;
  margin-left: -3px;
  margin-top: -3px;
}
.editor_bar {
  background: rgba(235, 234, 234,90%);
  /*width: 280px;*/
  /*height: 380px;*/
  /*box-sizing: border-box;*/
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