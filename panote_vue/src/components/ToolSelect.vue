<template>
  <div :style="selected&&depth===select_depth?{background:'#eaeaea'}:{}">

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
      />
    </div>
    {{ name + (children != null ? ' >' : '') }}
  </div>
</template>

<script>
export default {
  name: "ToolSelect",
  props: {
    name: String,
    children: Array,
    index:Number,
    depth: Number,
    select_depth: Number,
    select_level: Array,
  },
  watch: {
    select_depth() {
      // console.log("select depth", v,this.select_level,this.selected)
    }
  },
  computed: {
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
</style>