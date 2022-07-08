<template>
  <div ref="anchor">
    <div
        @contextmenu.prevent
        class="right_menu"
         ref="right_menu_ref"
         v-show="show"
         :style="{
           top:pos_y+'px',
           left:pos_x+'px',
         }"
    >
      <div v-for="(item, i) in content"
           :key="i"
        @click="click_selection(item)"
      >
        {{item.text}}
      </div>
    </div>
  </div>
</template>

<script>
import {bus_events} from "@/bus";
import {RightMenuFuncTs} from "@/components/RightMenuFuncTs";

export default {
  name: "RightMenu",
  mounted() {
    window.addEventListener("mousedown", this.handle_mouse_down);
    bus_events.events.right_menu_open.listen(this.bus_right_menu)
  },
  unmounted() {
    window.removeEventListener("mousedown", this.handle_mouse_down)
    bus_events.events.right_menu_open.cancel(this.bus_right_menu)
  },
  data() {
    return {
      show:false,
      pos_x:0,
      pos_y:0,
      content:[]
    };
  },
  methods: {
    //右键菜单bus回调
    bus_right_menu(args){
      RightMenuFuncTs.Ope.with(this)
        .on_bus_right_menu(args)
    },
    click_selection(item){
      item.callback()
      this.show=false
    },
    // eslint-disable-next-line no-unused-vars
    right_menu(event,tag,obj){

      console.log("right menu call",tag)
      // let rect=this.$refs.anchor.getBoundingClientRect()
      this.show=true;
      this.pos_x=event.clientX;//-rect.left;
      this.pos_y=event.clientY;//-rect.top;
      if(tag==="editor_bar"){
        let content=obj.right_menu_helper.get_right_menu_content(obj);
        this.content=content.arr;
      }
      else if(tag==="notelist_bar"){
        let content=obj.note_list_bar_helper.get_right_menu_content(obj);
        this.content=content.arr;
        // eslint-disable-next-line no-empty
      }else if("arr" in obj){
        this.content=obj.arr
      }

      // this.$forceUpdate();
      // console.log(this.pos_x,this.pos_y)
      event.stopPropagation();
    },
    handle_mouse_down(event){
      // console.log("right menu mouse down")
      if(this.$refs.right_menu_ref&&this.show){
        let rect=this.$refs.right_menu_ref.getBoundingClientRect();
        {
          rect.x -= 1;
          rect.y -= 1;
          rect.height += 2;
          rect.width += 2;
        }
        // console.log(event.clientX,event.clientY,rect)
        if(!(event.clientX>=rect.left&&event.clientX<=rect.right
            &&event.clientY<=rect.bottom&&event.clientY>=rect.top)
        ){
          console.log("click out of right menu")
          this.show=false;
        }
      }
    }
  },
  props: {},
};
</script>

<style scoped>
.right_menu {
  position: absolute;
  background: gray;
  width: 100px;
  height: 100px;
  z-index: 302;
}
</style>