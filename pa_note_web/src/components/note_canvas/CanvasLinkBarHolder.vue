<template>
  <el-tooltip
      placement="top"
  >
    <template #content>
      <div v-html="hover_str"></div>
    </template>
    <div class="linkbar_holder"
         :style="style_holder"
    @mouseup="event_mouseup"
         @mousedown="event_mousedown"
    >
      <el-icon><Switch class="linkbar_holder_switch"></Switch></el-icon>
    </div>
  </el-tooltip>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import {NoteCanvasTs} from "@/components/note_canvas/NoteCanvasTs";
import {Switch} from "@element-plus/icons-vue";


@Options({
  components: {Switch},
  props: {
    canvasp:Object
  }
})
export default class CanvasLinkBarHolder extends Vue {
  $props!: {
    canvasp:NoteCanvasTs.NoteCanvasDataReacher
  }
  get hover_str(){
    const lh=this.$props.canvasp.notecanvas.content_manager.user_interact.line_connect_helper;
    if(lh.holder_connect_path){
      return "<span>从此处拖拽可以继续连线</span>"
    }
    return "<span>在区域内释放连线可以暂时持有</span><br>" +
        "      <span>以便远距离链接</span>"
  }
  get style_holder(){
    const lh=this.$props.canvasp.notecanvas.content_manager.user_interact.line_connect_helper;
    if(lh.holder_connect_path){
      return {
        background:'#409eff',
        color:'#eee'
      }
    }
    return {
      color:'#aaa'
    }
  }
  event_mouseup(){
    this.$props.canvasp.get_content_manager().user_interact.event_mouseup_on_linkbar_holder()
    // console.log("")
  }
  event_mousedown(e:MouseEvent){
    this.$props.canvasp.get_content_manager().user_interact
        .line_connect_helper.conti_from_hold(e,this.$props.canvasp)
  }
}
</script>

t<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.linkbar_holder{
  /*width: 40px;*/
  /*height: 30px;*/
  border-radius: 5px;
  border:1px dashed #ccc;
  background: rgba(235, 234, 234,90%);
  line-height: 1;
  padding: 4px 13px;
  align-items: center;
  /*text-align: center;*/
}
.linkbar_holder_switch{
  /*margin-top: 14px;*/
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
