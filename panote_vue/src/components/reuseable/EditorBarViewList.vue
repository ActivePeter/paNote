<template>
  <div :class="'EditorBarViewList'+class_sub">
    <div>{{}}</div>
    <EditorBarViewList_DragBar
        v-for="(v,i) in helper.bars"
        :key="i"
        :index="i"
        :id="'bar'+i"
        :ref="'bar'+i"
        :list_helper="helper"
        @start_drag="start_drag"
    >
      <template v-slot:content>
        <div class="bar" v-if="helper.linkingbar===v">
          <el-button type="text" @click="cancel_link">取消连接</el-button>
          <el-button type="text">完成连接</el-button>
        </div>
        <div
            class="bar"
            v-if="v.bartype===1&&!helper.linkingbar&&!v.linking_info">当前连接块未连接脑图
          <el-button type="text" @click="start_link(v)">开始连接</el-button></div>
        <EditorBarDataReflect
            v-if="v.bartype===1&&v.linking_info"
            :option="editorOption"
            :link_info="v.linking_info"
        />
        <quill-editor
            v-if="v.bartype===0"
            :disabled="false"
            :options="editorOption"
            :value="v.text"
        ></quill-editor>
      </template>
    </EditorBarViewList_DragBar>
  </div>
</template>

<script>
import QuillEditor from "@/components/QuillEditor";
import EditorBarViewList_DragBar from "./EditorBarViewList_DragBar"
import EditorBarViewListFunc from "@/components/reuseable/EditorBarViewListFunc";
import EditorBarDataReflect from "@/components/EditorBarDataReflect";
export default {
  name: "EditorBarViewList",
  components:{
    // eslint-disable-next-line vue/no-unused-components
    QuillEditor,
    EditorBarViewList_DragBar,
    EditorBarDataReflect
  },
  computed:{
    class_sub(){
      if(this.helper.draggingbar){
        return ' non_select'
      }else{
        return ''
      }
    },
  },
  mounted() {
    window.addEventListener("mousemove",this.mouse_move);
    window.addEventListener("mouseup",this.mouse_up);
    EditorBarViewListFunc.HelperFuncs.Linking.stop_linking_list_bar(this.helper);
  },
  data() {
    return {
      editorOption: {
        placeholder: "write sth",
        modules: {
          toolbar: false,
        },
      },
      helper:new EditorBarViewListFunc.EditorBarViewListHelper()
    };
  },
  methods: {
    mouse_move(event){

      this.helper.mouse_move(this,event)
    },
    mouse_up(event){
      this.helper.mouse_up(this,event)
    },
    start_drag(bar,event){
      this.helper.bar_start_drag(this,bar,event)
    },
    cancel_link(){
      EditorBarViewListFunc.HelperFuncs.Linking.
        stop_linking_list_bar(this.helper)
    },
    start_link(v){
      EditorBarViewListFunc.HelperFuncs.Linking
          .set_linking_list_bar(v,this.helper)
    }
  },
  props: {

  },
};
</script>

<style scoped>
.non_select{
  -webkit-touch-callout: none; /* iOS Safari */

  -webkit-user-select: none; /* Chrome/Safari/Opera */

  -khtml-user-select: none; /* Konqueror */

  -moz-user-select: none; /* Firefox */

  -ms-user-select: none; /* Internet Explorer/Edge */

  user-select: none; /* Non-prefixed version, currently

not supported by any browser */
}
.bar{
  border: 1px solid #ccc;
}
</style>