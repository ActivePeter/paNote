<template>
  <div v-show="is_show" class="editor_tool">
    <div v-for="(item, i) in tools"
         :key="i"
    >
      <ToolSelect :name="item.name" :children="item.select"
                  :index="i" :depth="0"
                  :select_depth="select_depth"
                  :select_level="select_level"
      />

    </div>
  </div>
</template>

<script>
import ToolSelect from "@/components/ToolSelect";

export default {
  name: "EditorTool",
  components: {
    ToolSelect
  },
  mounted() {
    window.addEventListener("keyup", this.handle_key_up);
    window.addEventListener("keydown", this.handle_key_down);
    window.addEventListener("mousedown",this.handle_mouse_down);
  },
  data() {
    return {
      is_show: false,
      select_level: [0, 0],
      select_depth: 0,
      tools: [
        {
          name: "head",
          select: [0, 1, 2, 3, 4, 5]
        },
        {
          name: "indent",
          select: ["foward", "back"],
        }, {
          name: "bold",
          select: null
        }, {
          name: "underline",
          select: null
        },
        {
          name: "list",
          select: ["order", "disorder"]
        }
      ]
    };
  },
  watch:{
    is_show(v){
      this.$emit("change_is_show", v);
    }
  },
  methods: {
    get_range_of_depth(depth) {
      if (depth === 0) {
        return this.tools.length
      } else if (depth === 1) {
        return this.tools[this.select_level[0]].select.length
      }
    },
    if_has_next(){
      if(this.select_depth==0){
        return this.tools[this.select_level[0]].select!=null
      }
      return false
    },
    handle_mouse_down(event){
      if(this.is_show){
        event.preventDefault();
      }
    },
    handle_key_down(event){
      if(this.is_show){
        event.preventDefault();
        event.stopPropagation();
      }
    },
    handle_key_up(event) {
      if(this.is_show){

        if (event.key === 'ArrowUp') {
          if (this.select_level[this.select_depth] > 0) {
            this.select_level[this.select_depth]--;
          }
          // console.log("range", this.get_range_of_depth(this.select_depth), "1 depth", this.select_depth, "index", this.select_level[this.select_depth])
          // this.$forceUpdate()
        } else if (event.key === 'ArrowDown') {
          if (this.select_level[this.select_depth] < this.get_range_of_depth(this.select_depth)-1) {
            this.select_level[this.select_depth]++;
          }
          // this.$forceUpdate()
          // console.log("range", this.get_range_of_depth(this.select_depth), "2 depth", this.select_depth, "index", this.select_level[this.select_depth])
        } else if (event.key == 'ArrowRight') {
          if (this.select_depth < this.select_level.length - 1 && this.if_has_next()) {
            this.select_depth++;
            this.select_level[this.select_depth]=0;
          }
        } else if (event.key == 'ArrowLeft') {
          if (this.select_depth > 0) {
            this.select_depth--;
          }
        }else if (event.key<='9'&&event.key>='1'){
          //有效范围
          if (event.key-'1' < this.get_range_of_depth(this.select_depth)) {
            this.select_level[this.select_depth]=event.key-'1';
          }
        }else if(event.key=='Enter'){
          if(this.do_select()){
            this.is_show = false;
          }
          // console.log("hide tool bar",this.is_show);
        }
        event.preventDefault();
        event.stopPropagation();
      }
    },
    get_select(){
      let ret=[]
      let set=this.tools;
      let ok=false;
      for(let i=0;i<this.select_depth+1;i++){
        let selection=set[this.select_level[i]]
        if(typeof selection =='object'){

          // console.log("get_select obj",selection);
          ret.push(selection.name);
          if(selection.select==null){
            ok=true;
            break;
          }else{
            set=selection.select;
          }
        }else{

          // console.log("get_select item",selection);

          ret.push(selection);
          ok=true;
          break;
        }
      }
      if(ok){
        return ret;
      }
      return false;
    },
    do_select(){
      let g=this.get_select()
      if(g){
        this.$emit("choose_tool", g);
        return true;
      }else{
        return false;
      }
    },
    switch_show_tool_bar(canvas, editor) {
      if (canvas && editor) {
        console.log("switch_show_tool_bar")
        this.is_show = !this.is_show
      }
    },
    hide_tool_bar(canvas, editor) {
      console.log(canvas, editor)
    }
  },
  props: {},
};
</script>

<style scoped>
.editor_tool {
  background: gray;
  width: 100px;
  position: absolute;
}

.editor_tool .selected {
  background: #eaeaea;
}
</style>