<template>
  <EditorBarReflect
      class="editor_bar"

    :editorbar="eb1"
    :style="eb1style"
  ></EditorBarReflect>
  <EditorBarReflect
      class="editor_bar"
      :editorbar="eb2"
      :style="eb2style"
  ></EditorBarReflect>
  <div class="pathjumpbtn"
    :style="style"
       @mouseenter="mouseover"
       @mouseleave="mouseout"
  >
    <div class="child child1"
         @mouseover="mouseenter1"
         @mouseout="mouseleave1"
      @mousedown="mouseup1"
    ><ArrowLeft style="width: 1.2em; height: 1.2em;margin: 5px;"></ArrowLeft></div>
    <div class="child"
      @mousedown="rightmenu"
    ><MoreFilled style="width: 1.2em; height: 1.2em;margin: 5px;"></MoreFilled></div>
    <div class="child child2"
         @mouseover="mouseenter2"
         @mouseout="mouseleave2"
         @mousedown="mouseup2"
    ><ArrowRight style="width: 1.2em; height: 1.2em;margin: 5px;"></ArrowRight></div>
  </div>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import {NoteCanvasTs} from "@/components/note_canvas/NoteCanvasTs";
import {ArrowLeft, ArrowRight, MoreFilled} from "@element-plus/icons-vue";
import EditorBarReflect from "@/components/editor_bar/EditorBarReflect.vue";
import { note } from '@/note';
import {EditorBar} from "@/components/editor_bar/EditorBarFunc";
import {RightMenuFuncTs} from "@/components/RightMenuFuncTs";
import {_path} from "@/note/path";
// import {_PaUtilTs} from "@/3rd/pa_util_ts";


@Options({
  components: {EditorBarReflect, MoreFilled, ArrowLeft,ArrowRight},
  props: {
    state:Object,
    notehandle:Object,
    scale:Number,
  },
  emits: ['jump', 'hide']
})
export default class Path extends Vue {
  $props!: {
    state:NoteCanvasTs.PathJumpBtnState,
    notehandle:note.NoteHandle,
    scale:number
  }

  get eb1style(){

    if(!this.eb1) {
      return ""
    }
    const w=Math.min(this.eb1.width,200)
    const h=Math.min(this.eb1.height,200)
    let top=this.$props.state.pos.y
        -50*Math.sin(this.$props.state.pathcomp.pathdesc.rotate/180*Math.PI)
    let left=this.$props.state.pos.x
        -50*Math.cos(this.$props.state.pathcomp.pathdesc.rotate/180*Math.PI)
    // let mw=0,mh=0
    if(Math.cos(
        this.$props.state.pathcomp.pathdesc.rotate/180*Math.PI)>0){
      left-=w/this.$props.scale
    }
    if(Math.sin(
        this.$props.state.pathcomp.pathdesc.rotate/180*Math.PI)>0){
      top-=h/this.$props.scale
    }
    return {
      width:w+'px',
      height:h+'px',
      top:0,
      left:0,
      opacity:'80%',
      // top:top+'px',
      // left:left+'px',
      transformOrigin:'0 0 0',
      transform:'translate('+left+'px,'+top+'px) '+
          'scale('+1/this.$props.scale+')'
    }
  }
  get eb2style(){
    if(!this.eb2) {
      return ""
    }
    const w=Math.min(this.eb2.width,200)
    const h=Math.min(this.eb2.height,200)
    let left =this.$props.state.pos.x
        +50*Math.cos(this.$props.state.pathcomp.pathdesc.rotate/180*Math.PI)
    let top=this.$props.state.pos.y+50*Math.sin(
        this.$props.state.pathcomp.pathdesc.rotate/180*Math.PI)
    if(Math.cos(
        this.$props.state.pathcomp.pathdesc.rotate/180*Math.PI)<0){
      left-=w/this.$props.scale
    }
    if(Math.sin(
        this.$props.state.pathcomp.pathdesc.rotate/180*Math.PI)<0){
      top-=h/this.$props.scale
    }
    return {
      width:w+'px',
      height:h+'px',
      top:top+'px',
      left:left+'px',
      opacity:'80%',
      transformOrigin:'0 0 0',
      transform:'scale('+1/this.$props.scale+')'
    }
  }
  get eb2():EditorBar{
    return this.$props.notehandle.content_data.editor_bars[
        this.$props.state.pathcomp.$props.path.e_bar]
  }
  get eb1():EditorBar{
    return this.$props.notehandle.content_data.editor_bars[
        this.$props.state.pathcomp.$props.path.b_bar]
  }
  get style(){
    return {
      top:this.$props.state.pos.y-15+'px',
      left:this.$props.state.pos.x-50+'px',
      transform:'rotate('+this.$props.state.pathcomp.pathdesc.rotate+'deg)'
    }
  }
  timer:null|number=null

  rightmenu(e:MouseEvent){
    const handle=this.$props.notehandle
    const p=note.NoteHandlePathProxy.create(this.$props.state.pathcomp.$props.path)
    const pk=p.get_pathkey()
    const c=
        RightMenuFuncTs.RightMenuContent.create()
            .add_one_selection("删除连接",()=>{
              handle.pathman().withlog_del_path(
                  pk)
                  ?.set_store_flag_after_do()
            })
            .add_one_selection("切换类型",()=>{
              const prop=p.get_pathprop()
              prop.type++;
              if(prop.type==_path.PathType.end){
                prop.type=_path.PathType.solid
              }

              handle.pathman().withlog_changeprop(
                  p,prop
              )?.set_store_flag_after_do()
            })
    RightMenuFuncTs.emitbus(e,c)
  }

  upcb:null|Function=null

  show_eb2=false
  mouseenter2(){
    this.show_eb2=true
  }
  mouseleave2(){
    this.show_eb2=false
  }


  show_eb1=false
  mouseenter1(){
    this.show_eb1=true
  }
  mouseleave1(){
    this.show_eb1=false
  }

  mouseup(){
    window.removeEventListener("mouseup",this.mouseup)
    this.upcb?.()
  }
  mouseup1(e:MouseEvent){
    this.upcb=()=>{
      // console.log(e)
      if(e.buttons===1)this.jump(true)
    }
    window.addEventListener("mouseup",this.mouseup)
  }
  mouseup2(e:MouseEvent){
    this.upcb=()=>{
      if(e.buttons===1)this.jump(false)
    }
    window.addEventListener("mouseup",this.mouseup)
  }
  jump(to_begin:boolean){
    this.$emit("jump",to_begin,this.$props.state)
  }
  mouseover(){
    if(this.timer){
      window.clearTimeout(this.timer)
      this.timer=null
    }
  }
  mouseout(){
    // console.log("mouseout")
    // const _this=this

    this.$emit("hide")
    // this.timer=window.setTimeout(()=>{

      // this.$emit("hide")
    // },100)
  }
}
</script>

<style scoped>
.editor_bar{
  background: #e8f3ff;
  opacity: 80%;
  position: absolute;
  z-index: 10;
}
.pathjumpbtn{
  display: flex;
  align-content: space-around;
  border-radius: 40px;
  position: absolute;
  width: 100px;
  height: 30px;
  /*width: 50px;*/
  /*height: 50px;*/
  background: #8cc5ff;

  cursor: pointer;
}
.pathjumpbtn .child{
  width: 50%;
  line-height: 30px;
  color: #0066cc;
  /*height: 100%;*/
}
.pathjumpbtn .child:hover{
  background: #3a8ee6;

  /*height: 100%;*/
}
.pathjumpbtn .child2:hover{
  /*background: #3a8ee6;*/
  border-bottom-right-radius:15px ;
  border-top-right-radius: 15px;
  /*height: 100%;*/
}
.pathjumpbtn .child1:hover{
  /*background: #3a8ee6;*/
  border-bottom-left-radius:15px ;
  border-top-left-radius: 15px;
  /*height: 100%;*/
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
