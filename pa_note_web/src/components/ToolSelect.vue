<template>
  <div :style="selected&&depth===select_depth?{background:'#eaeaea'}:{}">
<!--    {{this.select_level[this.depth]}}-->
    <div v-if="children!=null&&selected"
         class="children"
    >
      <ToolSelect
          v-for="(item, i) in children"
          :key="i"
          :name="item.toString()" :children="null"

          :index="i" :depth="depth+1"
          :select_depth="select_depth"
          :select_level="select_level"
          :p_canvasdr="p_canvasdr"
      />
    </div>
    <div v-if="!special" style="position: relative">
      {{ name + (children != null ? ' >' : '') }}
    </div>
<!--    <ToolSelectSpecial-->
<!--        v-else-->
<!--        class="special"-->
<!--        :name="name"-->
<!--        :focus="depth===select_depth"-->
<!--        :p_canvasdr="p_canvasdr"-->
<!--        @spec_unmount="spec_unmount"-->
<!--    ></ToolSelectSpecial>-->
  </div>
</template>

<script>
import ToolSelectSpecial from "@/components/ToolSelectSpecial";
export default {
  name: "ToolSelect",
  // eslint-disable-next-line vue/no-unused-components
  components: {ToolSelectSpecial},
  props: {
    name: String,
    children: Array,
    index:Number,
    depth: Number,
    select_depth: Number,
    select_level: Array,
    p_canvasdr:Object
  },
  watch: {
    select_depth() {
      // console.log("select depth", v,this.select_level,this.selected)
    }
  },
  computed: {
    special(){
      return this.depth>0&&
      (this.name==='url' ||
              this.name==='color')
    },
    selected(){
      return this.index===this.select_level[this.depth];
    },
    focus_style() {
      if (this.depth === this.select_depth
      ) {
        return ''
      } else {
        return ''
      }
    }
  },
  methods:{
    // eslint-disable-next-line no-unused-vars
    spec_unmount(quill_sel){
      // if(quill_sel){
      // if(this.p_canvasdr.notecanvas){
      //   this.p_canvasdr.get_content_manager().user_interact.toolbar_spec_unmount(quill_sel)
      // }
      // }
    }
  }
}
</script>

<style scoped>
.children {
  position: absolute;
  right: -100px;
  width: 100px;
  background: gray;
}
.special{
  position: absolute;

  left: 0px;
  /*width: 00px;*/
  top: 0px;
  background: gray;
}
</style>