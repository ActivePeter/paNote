<template>
  <div
  >

    <div
        v-show="show_range"
        class="select_rect"
        :style="rectstyle"
    >

    </div>
  </div>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import {NoteCanvasTs} from "@/components/note_canvas/NoteCanvasTs";
// import {EditorBar} from './EditorBarFunc';
import {_PaUtilTs} from "@/3rd/pa_util_ts";
// import {camelize} from "vue";

@Options({
  props: {
    maxw:Number,
    maxh:Number,
    // canstart:Object//传入一个promise判断能否开始拖拽
  }
})

//撑满父组件，父组件需要为position:relative
export default class NoteCanvasSelectRange extends Vue {
  $props!: {
  }
  get rectstyle(){
    return {
      left:this.rectx+"px",
      top:this.recty+"px",
      width:this.rectw+"px",
      height:this.recth+"px"
    }
  }
  get rectx(){
    return this._beginx>this._movex?
        this._movex-this._off_client_x
        :this._beginx-this._off_client_x
  }
  get recty(){
    return this._beginy>this._movey?
        this._movey-this._off_client_y
        :this._beginy-this._off_client_y
  }
  get rectw(){

    return this._beginx<this._movex?
        this._movex-this._beginx
        :this._beginx-this._movex
  }
  get recth(){

    return this._beginy<this._movey?
        this._movey-this._beginy
        :this._beginy-this._movey
  }
  show_range=false
  _beginx=0
  _beginy=0
  _movex=100
  _movey=100
  set beginx(x:number){
    // if(x<this._off_client_x){x=this._off_client_x}
    this._beginx=x;
  }
  set beginy(x:number){
    // if(x<this._off_client_y){x=this._off_client_y}
    this._beginy=x;
  }
  set movex(x:number){
    // if(x<this._off_client_x){x=this._off_client_x}
    this._movex=x;
  }
  set movey(x:number){
    // if(x<this._off_client_y){x=this._off_client_y}
    this._movey=x;
  }
  _off_client_x=0
  _off_client_y=0
  last_scan_aabb_ms=0
  // eslint-disable-next-line no-unused-vars
  can_start_select=(_:MouseEvent)=>{return false}
  // eslint-disable-next-line no-unused-vars
  init(canvas:NoteCanvasTs.NoteCanvasDataReacher,can_start_select:(_:MouseEvent)=>boolean){
    this.can_start_select=can_start_select

  }
  mounted(){
    const recorder=NoteCanvasTs.NoteCanvasDataReacher.create(this.$parent).get_content_manager().user_interact.mouse_drag_recorder;
    recorder.listen(recorder.down_callers.canvas_bg,
        (recorder1,event1)=>{
          const canvas=NoteCanvasTs.NoteCanvasDataReacher.create(this.$parent)
          if(event1.type==NoteCanvasTs.CanvasMouseDragEvent.Types.down){
            console.log("ranger sel","down")
            if(event1.event.buttons==1&&
                canvas.get_content_manager().user_interact._recent_eb_mouse_down!=event1.event){
              this.show_range=true
              this._movex=this._beginx=event1.cv_x
              this._movey=this._beginy=event1.cv_y


              //若没有按shift 清除原有选中
              if(!event1.event.shiftKey){
                canvas.get_editorbar_man().focus_clear()
              }
            }
          }else if(event1.type==NoteCanvasTs.CanvasMouseDragEvent.Types.move){
            if(!this.show_range)return;
            // this.show_range=true
            console.log("ranger sel","move")
            this._movex=event1.cv_x;
            this._movey=event1.cv_y;
            const ms=_PaUtilTs.time_stamp_number()
            if(ms-this.last_scan_aabb_ms>100){
              this.last_scan_aabb_ms=ms
              // const canvas=NoteCanvasTs.NoteCanvasDataReacher.create(this.$parent)

              //若没有按shift 清除原有选中
              if(!event1.event.shiftKey){
                canvas.get_editorbar_man().focus_clear()
              }
              const ebkeys=Object.keys( canvas.get_editor_bars())
              const selrect=new _PaUtilTs.Rect(this.rectx,this.recty,this.rectw,this.recth)

              // let colided_ebids=[]
              ebkeys.forEach((ebk)=>{
                const ebrect=canvas.get_editorbar_man().get_editor_bar_rect_by_ebid(ebk)
                if(_PaUtilTs.Algrithms.aabb_test(selrect,ebrect)){
                  // colided_ebids.push(ebk)
                  canvas.get_editorbar_man().focus_add(ebk)
                }
              })

            }
          }else{
            this.show_range=false;
            console.log("ranger sel","up")
          }
        })
    // window.addEventListener("mousedown",this.mousedown)
    // window.addEventListener("mouseup",this.mouseup)
    // const rect=(this as any).$refs.select_range.getBoundingClientRect()
    // this._off_client_x=rect.left
    // this._off_client_y=rect.top

  }
  unmounted(){
    // window.removeEventListener("mousedown",this.mousedown)
    // window.removeEventListener("mouseup",this.mouseup)
  }

  mousedown(e:MouseEvent){
    // console.log("sr mouse down")
    if(e.buttons==1){
      if(this.can_start_select(e)){
        // if(res)
        {
          this.show_range=true
          console.log("SelectRange",e)
          this.beginx=this.movex=e.clientX
          this.beginy=this.movey=e.clientY
          window.addEventListener("mousemove", this.mousemove)
        }
      }
    }
    // e.stopPropagation()
  }
  mousemove(e:MouseEvent){

    // console.log("SelectRange move",e)
    this.movex=e.clientX
    this.movey=e.clientY
  }
  mouseup(){
    window.removeEventListener("mousemove", this.mousemove)
    this.show_range=false
  }
}
</script>

t<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.select_range{
  background: #8cc5ff;
  /*visibility: hidden;*/
  opacity: 50%;
  position: absolute;
  top: 0;
  /*right: 0;*/
  /*width: 0;*/
  /*height: 0;*/
  left: 0;
  /*bottom: 0;*/
}
.select_rect{
  position: absolute;
  background: #2aa198;
  width: 100px;
  height: 100px;

  /*top: 0;*/
  /*: 0;*/
  pointer-events: none;
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
