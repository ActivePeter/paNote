<template>
  <div class="btnset">
    <el-tooltip
    placement="top"
    content="撤回跳转"
    >
      <div class="btn"
      @mouseup="event_mouse_back"
      >
        <el-icon><Back /></el-icon>
      </div>
    </el-tooltip>
    <el-tooltip
        placement="top"
        content="重新跳转"
    >

      <div class="btn"
           @mouseup="event_mouse_redo"
      >
        <el-icon><Right /></el-icon>
      </div>
    </el-tooltip>
  </div>
<!--  <el-tooltip-->
<!--      placement="left-start"-->
<!--  >-->
<!--    <template #content>-->
<!--      <div v-html="hover_str"></div>-->
<!--    </template>-->
<!--    <div class="linkbar_holder"-->
<!--         :style="style_holder"-->
<!--    @mouseup="event_mouseup"-->
<!--         @mousedown="event_mousedown"-->
<!--    >-->
<!--      <el-icon><Switch class="linkbar_holder_switch"></Switch></el-icon>-->
<!--    </div>-->
<!--  </el-tooltip>-->
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import {NoteCanvasTs} from "@/components/note_canvas/NoteCanvasTs";
import {Back, Right, Switch} from "@element-plus/icons-vue";


@Options({
  components: {Right, Back, Switch},
  props: {
    canvasp:Object
  }
})
export default class CanvasJumpUndo extends Vue {
  $props!: {
    canvasp:NoteCanvasTs.NoteCanvasDataReacher
  }
  event_mouse_back(){
    // this.$props.canvasp.get_content_manager().user_interact.event_mouseup_on_linkbar_holder()
    // console.log("")
    this.$props.canvasp.get_content_manager().user_interact
        .scroll_jump_ope(true,true)
  }
  event_mouse_redo(){
    this.$props.canvasp.get_content_manager().user_interact
        .scroll_jump_ope(false,true)
    // this.$props.canvasp.get_content_manager().user_interact.event_mouseup_on_linkbar_holder()
    // console.log("")
  }
  // event_mousedown(e:MouseEvent){
  //   this.$props.canvasp.get_content_manager().user_interact
  //       .line_connect_helper.conti_from_hold(e,this.$props.canvasp)
  // }
}
</script>

t<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.btn{
  /*padding: 5px;*/
  /*padding-left:10px ;*/
  /*padding-right:10px ;*/
  /*line-height: 30px;*/
  cursor: pointer;
  line-height: 1;
  padding: 4px 13px;
  align-content: space-between;
}
.btn:hover{
  background: #409eff;
  color: #eee;
}
.btnset{
  border-radius: 5px;
  border:1px dashed #ccc;
  /*height: 30px;*/
  background: rgba(235, 234, 234,90%);
  width: max-content;
  display: flex;
  flex-direction: row;

  /*line-height: 30px;*/
  color:#aaa;
}
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
