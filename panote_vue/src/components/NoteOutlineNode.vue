<template>
  <div class="note_outline_node">
    <a class="link"
      @mousedown="linkclick"
    >{{text}}</a>
    <NoteOutlineNode
        v-for="(item, i) in node.child_nodes"
        :key="i"

        :tree_index="tree_index"
        :node="item"
        :editor_bars="editor_bars"
        :editor_bar_comps="editor_bar_comps"
        class="child_node"
        @node_rightclick="node_rightclick_pass"
    ></NoteOutlineNode>
  </div>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import {NoteOutlineTs} from "@/components/NoteOutlineTs";
import {AppFuncTs} from "@/AppFunc";
// import { RightMenuFuncTs } from './RightMenuFuncTs';
// import {Watch} from "vue-property-decorator";
// import {EditorBarTs} from "@/components/EditorBarTs";

@Options({
  props: {
    node:Object,
    editor_bars:Object,
    editor_bar_comps:Object,
    tree_index:Number
  }
})
export default class NoteOutline extends Vue {
  $props!: {
    node:NoteOutlineTs.OutlineStorageStructOneTreeNode,
    editor_bars:any,
    editor_bar_comps:any,
    tree_index:number
  }
  ctx=AppFuncTs.Context.getfakeone()
  get text():string{
    if(this.$props.node.cur_ebid in this.$props.editor_bar_comps
      &&"quill_editor_ref" in this.$props.editor_bar_comps[this.$props.node.cur_ebid]
            .$refs
    ){

      const t= this.$props.editor_bar_comps[this.$props.node.cur_ebid]
          .$refs.quill_editor_ref.get_raw_quill().getText() as string
      const div=t.indexOf('\n')
      return this.$props.node.cur_ebid in this.$props.editor_bar_comps?
          t.substring(0,div):""
    }
    return "editor_bar_comp not found"
  }
  created(){
    this.ctx=AppFuncTs.appctx;
  }
  node_rightclick_pass(e:MouseEvent,treei:number,ebid:string){
    this.$emit("node_rightclick",e,treei,ebid)
  }
  linkclick(e:MouseEvent){
    // console.log("linkclick",e)
    if(e.buttons==1){
      this.ctx.uiopes().locate_eb_in_cur_note2(this.$props.node.cur_ebid)
    }
    else {
      this.$emit("node_rightclick",e,this.$props.tree_index,this.$props.node.cur_ebid)
    }

  }

}
</script>

t<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.note_outline_node{
  text-align: left;
}
.child_node{
  padding-left: 5px;
}
.link{
  cursor: pointer;

}
.link:hover{
  color: #8cc5ff;
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
