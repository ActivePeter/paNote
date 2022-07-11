<template>
  <div class="note_outline">
    <NoteOutlineNode
        v-for="(item, i) in data_stored.trees"
        :key="i"

        :tree_index="i"
        :node="item.root_node"
        :editor_bars="editor_bars"
        :editor_bar_comps="editor_bar_comps"
        @node_rightclick="node_rightclick"
    ></NoteOutlineNode>
<!--    {{data_stored}}-->
  </div>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import {NoteOutlineTs} from "@/components/NoteOutlineTs";
// import {NoteContentData} from "@/components/NoteCanvasFunc";
// import {EditorBar} from "@/components/EditorBarFunc";
import NoteOutlineNode from "@/components/NoteOutlineNode.vue";
import {AppFuncTs} from "@/AppFunc";
import {RightMenuFuncTs} from "@/components/RightMenuFuncTs";
import {note} from "@/note";
import NoteContentData = note.NoteContentData;
// import OutlineStorageStructProxy = NoteOutlineTs.OutlineStorageStructProxy;


@Options({
  components: {NoteOutlineNode},
  props: {
  }
})
export default class NoteOutline extends Vue {
  $props!: {
  }
  notehandle=new note.NoteHandle("",NoteContentData.get_default())
  data_stored=new NoteOutlineTs.OutlineStorageStruct()
  editor_bar_comps:any
  editor_bars:any
  in_tree_nodes:any={}
  // private _ebid: string;
  // stored_load(data:NoteContentData){
  //   // this.data_stored=data.part.note_outline
  //   // this.editor_bars_ref =(data.editor_bars)
  // }
  ctx:AppFuncTs.Context=AppFuncTs.Context.getfakeone()
  created(){
    this.ctx=AppFuncTs.appctx
    this.data_stored=this.ctx.cur_open_note_content.part.note_outline
    if(this.ctx.cur_open_note_id!='-1'){
      this.editor_bars=this.ctx.cur_open_note_content.editor_bars
      this.editor_bar_comps=this.ctx.ui_refs().main_canvasproxy()
          .get_editorbar_man().ebid_to_ebcomp
    }
  }
  get_outline_proxy():NoteOutlineTs.OutlineStorageStructProxy{
    return NoteOutlineTs.OutlineStorageStruct.proxy(this.data_stored,this.notehandle.note_id)
  }
  note_loaded(
      notehandle:note.NoteHandle,
      ebid_2_eb:any,
      ebid_2_ebcomp:any
  ){
    this.notehandle=notehandle
    this.data_stored=notehandle.content_data.part.note_outline
    this.editor_bars=ebid_2_eb
    this.editor_bar_comps=ebid_2_ebcomp
    // editor_bar_comps:any
    // editor_bars:any
  }
  node_rightclick(e:MouseEvent,treei:number,ebid:string){
    console.log("node_rightclick",treei,ebid)
    const content=RightMenuFuncTs.RightMenuContent.create()
    content.add_one_selection("从大纲移除",()=>{
       const proxy=this.get_outline_proxy()
      proxy.try_remove_in_treei(treei,ebid)
      proxy.data_changed(this.ctx)
    })
    RightMenuFuncTs.if_right_click_then_emit_bus(e,content);
  }
  try_insert_node(ebid:string){
    // this._ebid = ebid;
    const helper=NoteOutlineTs.OutlineStorageStructOneTreeHelper.create(
        this.data_stored.trees[0])
    helper.join(ebid,this.editor_bars)
  }

}
</script>

t<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.note_outline{
  padding: 10px;
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
