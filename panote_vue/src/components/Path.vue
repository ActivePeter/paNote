<template>
  <svg
      class="path"
      version="1.1"
      :height="10"
      :width="pathdesc.len"
      :style="svgstyle"
      @mousemove="event_mousemove"
  >

<!--    {{path.len}}-->
    <path
        :d="'M ' + 0+ ' ' + 5 + ' L ' +pathdesc.len + ' ' + 5 "
        stroke="black"
        stroke-width="1.3"
        fill="none"
    ></path>
  </svg>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import {PathStruct} from "@/components/NoteCanvasFunc";


@Options({
  props: {
    path:Object,
    path_opacity:String
  }
})
export default class Path extends Vue {
  $props!: {
    path:PathStruct
    path_opacity:string
  }
  get svgstyle(){
    const v:any=
    { top: this.pathdesc.y-5 + 'px', left:this.pathdesc.x + 'px' ,
        opacity:this.$props.path_opacity,

        transform:'rotate('+this.pathdesc.rotate+'deg)'
    }
    v['transform-origin']='0 5px 0'
    return v
  }
  get pathdesc(){
    // const x=(this.$props.path.bx)+this.$props.
    const dx=this.$props.path.ex-this.$props.path.bx
    const dy=this.$props.path.ey-this.$props.path.by
    const len= Math.sqrt(dx*dx+dy*dy)
    return {
      len:len,
      width:3,
      x:this.$props.path.ox+ this.$props.path.bx,
      y:this.$props.path.oy+ this.$props.path.by,
      // offx:Math.abs(dx)-len/2,
      // offy:Math.abs(dy),
      rotate:Math.atan2(dy,dx)/Math.PI*180
    }
  }
  event_mousemove(event:MouseEvent){
    this.$emit("pathmouse",event,this)
  }
}
</script>

<style scoped>
.path{
  position: absolute;
  cursor: pointer;
}
.hoverbtns{
  z-index: 10;
  position: absolute;
  width: 10px;
  height: 10px;
  background: #8cc5ff;
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
