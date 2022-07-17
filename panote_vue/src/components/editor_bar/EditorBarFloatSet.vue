<template
>

  <el-popover
      placement="top-start"
      :title="title"
      :width="200"
      trigger="hover"
      content="this is content, this is content, this is content"
      :visible="type!==floatset_types.no"
  >
    <template #default>
      <div class="floatset"
           v-if="type===floatset_types.url">
        <FlatInput
            class="input"
            v-model:value="this.urlsetdata.show"
            pre="显示文字"
        ></FlatInput>
        <div style="height: 10px"/>
        <FlatInput
            class="input"
            v-model:value="this.urlsetdata.url"
            pre="链接"
        ></FlatInput>
        <div style="height: 10px"/>
        <el-button size="small" class="btn"
          @mouseup="cancel"
        >取消</el-button>
        <el-button size="small" class="btn"
                   type="primary"
        >完成</el-button>
      </div>
    </template>
    <template #reference>
      <div
          v-if="type===floatset_types.url"
          class="pos"
         :style="{left:posdata.x-3+'px',
            top:posdata.y+'px'
          }"
      >

      </div>
    </template>
  </el-popover>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import {EditorBarTs} from "@/components/editor_bar/EditorBarTs";
import {EditorBarFloatSetTs} from "@/components/editor_bar/EditorBarFloatSetTs";
import FlatInput from "@/3rd/pa_comps/flat_input.vue";
// import {Watch} from "vue-property-decorator";
// import {Watch} from "@element-plus/icons-vue";
// import { Watch } from '@element-plus/icons-vue/dist/types';


@Options({
  components: {FlatInput},
  props: {
    ebcomp:Object,
    type:Number,
  }
})

export default class EditorBarFloatSet extends Vue {
  $props!: {
    ebcomp:EditorBarTs.EditorBarCompProxy,
    type:EditorBarFloatSetTs.EditorBarFloatSetType
  }
  posdata={
    x:0,
    y:0,
  }
  urlsetdata={
    show:"",
    url:""
  }

  // @Watch('canvas.scale')
  // watch_scale() {
  //   console.log("canvas scale")
  //   this.update_pos()
  // }
  get title(){
    if(this.$props.type==this.floatset_types.url){
      return "插入超链接"
    }
    return "无效值"
  }
  canvas:any={
    scale:1
  }
  update_pos(){
    const canvasp=this.$props.ebcomp.ebman.canvasproxy()
    this.canvas=canvasp.notecanvas
    const editortool_state=canvasp.get_content_manager().user_interact.editortool_state
    const sel=editortool_state.editor_sel
    if(sel){
      const bound=this.$props.ebcomp.get_quill().getBounds(sel.index,sel.length)
      console.log("sel bound",bound)
      this.posdata.x=bound.left/canvasp.get_scale()
      this.posdata.y=bound.top/canvasp.get_scale()
      // this.posdata.x
    }else{
      console.log("sel no")
    }
  }
  mounted(){
    {
      const canvasp=this.$props.ebcomp.ebman.canvasproxy()
      this.canvas=canvasp.notecanvas
      this.update_pos()
    }
  }
  cancel(){
    // if(this.$props.type==this.floatset_types.url){
      this.$props.ebcomp.set_float_set(this.floatset_types.no)
    // }
  }
  floatset_types=EditorBarFloatSetTs.EditorBarFloatSetType
}
</script>

t<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.pos{
  /*left: 100px;*/
  position: absolute;
}
.floatset{
  z-index: 10;
  /*border: 1px solid gainsboro;*/
  text-align: left;
}
.input{
  /*padding: 10px 10px 0 10px;*/
  font-size: 13px;
}
.btn{
  margin: 0px 10px 0px 0px;
  color: #0066cc;
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
