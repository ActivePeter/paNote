<template>
<!--  drg{{draggable}}-->
  <div class="EditorBarViewList_DragBar"
       :style="style"
  @mouseover="handle_mouse_over"
       @mouseleave="handle_mouse_leave"
  >
    <slot name="content"></slot>
    <div v-show="show_drag" class="dragbar_line"
      @mousedown="start_drag"
    >
    </div>
  </div>
</template>

<script>
export default {
  name: "EditorBarViewList_DragBar",
  mounted() {
  },
  computed:{
    show_drag(){
      if(!this.draggable){
        return false;
      }
      if(this.list_helper.draggingbar){
        return this.list_helper.draggingbar===this
      }else{
        return this.mouse_over
      }
    },
    style(){
      if(this.list_helper.draggingbar===this) {
        return {
          transform:"translate("+this.trans_x+"px,"+this.trans_y+"px)",
          opacity:0.5
        }
      }
      else{
        if(this.list_helper.offset[this.index]===1){
          return {transform:"translate(0px,"+this.list_helper.draggingbar_height+"px)",}
        }else if(this.list_helper.offset[this.index]===-1){
          return {transform:"translate(0px,"+-this.list_helper.draggingbar_height+"px)",}
        }
        else{
          return {}
        }
      }
    }
  },
  data() {
    return {
      mouse_over:false,
      trans_x:0,
      trans_y:0,
    };
  },
  methods: {
    trans(x,y){
      this.trans_x=x
      this.trans_y=y
    },
    start_drag(event){
      this.$emit("start_drag",this,event);
    },
    handle_mouse_over(){
      this.mouse_over=true;
    },
    handle_mouse_leave(){
      this.mouse_over=false;
    }
  },
  props: {
    index:Number,
    list_helper:Object,
    draggable:Boolean
  },
};
</script>

<style scoped>
.dragbar_line{
  width: 100%;
  height: 25px;
  background: #c0c0c0;
  cursor: pointer;
}
.EditorBarViewList_DragBar{
  /*transform: translate();*/
}
</style>