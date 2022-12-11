<template>
  <div :class="'EditorBarViewList'+class_sub">
<!--    <div>{{helper.rank}}</div>-->

<!--    edit{{editing}}-->
    <EditorBarViewList_DragBar
        v-for="(to,i) in helper.rank"
        :key="i"
        :index="i"
        :id="'bar'+to"
        :ref="'bar'+to"
        :list_helper="helper"
        :draggable="editing"
        @start_drag="start_drag"
    >
      <template v-slot:content>
<!--        {{i}}{{helper.rank[i]}}-->
        <div class="bar" v-if="helper.linkingbar_id===helper.rank[i]">
          <el-button type="text" @click="cancel_link">取消连接</el-button>
          <el-button type="text"  @click="finish_link">完成连接</el-button>
        </div>
        <div
            class="bar"
            v-if="helper.bars[to].bartype===1&&
            !helper.bars[to].linking_info&&helper.linkingbar_id!==helper.rank[i]">当前连接块未连接脑图
          <el-button type="text" @click="start_link(helper.rank[i])">开始连接</el-button></div>
        <EditorBarDataReflect
            v-if="helper.bars[to].bartype===1&&helper.bars[to].linking_info"
            :option="editorOption"
            :link_info="helper.bars[to].linking_info"
            @locate_bar="locate_bar"
        />
        <quill-editor
            v-if="helper.bars[to].bartype===0"
            :disabled="!editing"
            :options="editorOption"
            :value="helper.bars[to].text"
            :numid="to"
            @update:value_numid="content_change"
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
import {ElMessage} from "element-plus";
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
    EditorBarViewListFunc.HelperFuncs.Linking.cancel_linking_list_bar(this.helper);
  },
  unmounted() {
    window.removeEventListener("mousemove",this.mouse_move);
    window.removeEventListener("mouseup",this.mouse_up);
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
    content_change(id,con){
      this.helper.bars[id].text=con;
    },
    mouse_move(event){

      this.helper.mouse_move(this,event)
    },
    mouse_up(event){
      this.helper.mouse_up(this,event)
    },
    start_drag(bar,event){
      this.helper.bar_start_drag(this,bar,event)
    },
    // locate_bar(linkinfo){
    //   this.$emit("locate_bar",linkinfo)
    // },
    cancel_link(){
      EditorBarViewListFunc.HelperFuncs.Linking.
        cancel_linking_list_bar(this.helper)
    },
    finish_link(){
      const ok=EditorBarViewListFunc.HelperFuncs.Linking.
        try_stop_linking_list_bar(this.helper)
      if(!ok){
        ElMessage({
          message: '还没有连接到脑图块',
          type: 'warning',
        })
      }
    },
    start_link(index){
      EditorBarViewListFunc.HelperFuncs.Linking
          .set_linking_list_bar(index,this.helper)
    }
  },
  props: {
    editing: {
      type: Boolean,
      default: true
    },
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
  /*text-align: left;*/
  padding: 10px;
  border: 1px solid #ccc;
}
</style>