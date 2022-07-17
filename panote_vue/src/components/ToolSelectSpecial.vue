<template>
  <div :style="focus?{background:'#eaeaea'}:{}">
    <div v-if="name==='url'">
      <FlatInput v-model:value="url"

      ></FlatInput>
    </div>
  </div>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import FlatInput from "@/3rd/pa_comps/flat_input.vue";
import {NoteCanvasTs} from "@/components/NoteCanvasTs";
// import {Watch} from "vue-property-decorator";


@Options({
  components: {FlatInput},
  props: {
    name:String,
    focus:Boolean,
    p_canvasdr:Object
  }
})
export default class ToolSelectSpecial extends Vue {
  $props!: {
    name:string,
    focus:boolean,
    p_canvasdr:NoteCanvasTs.NoteCanvasDataReacher
  }
  url=""
  canvasdr=new NoteCanvasTs.NoteCanvasDataReacher(null)

  quill_sel:any=null
  // @Watch

  mounted(){
    this.canvasdr=this.$props.p_canvasdr
    const sel=this.quill_sel=this.canvasdr.get_editorbar_man().editing_ebproxy?.get_quill_proxy().get_selection()
    console.log("quill sel",sel)
  }
  unmounted(){
    this.$emit("spec_unmount",this.quill_sel)
    // const quill=this.canvasdr.get_editorbar_man().editing_ebproxy?.get_quill_proxy()
    // if(quill?.is_blur()){
    //   quill?.set_selection(this.quill_sel.index,this.quill_sel.length)
    //   console.log('setsel')
    // }
    // this.quill_sel
  }
}
</script>

t<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
