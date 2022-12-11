<template>
  <div :style="{'padding-right':'10px','padding-left':'10px'}">
    <el-input v-model="article_name" placeholder="命名笔记块的文章名" />
    <div style="height: 10px"/>
    <el-row :gutter="10">
      <el-col :span="12"> <el-button style="width: 100%"
        @click="upload_article_title"
      >完成</el-button></el-col>
      <el-col :span="12"> <el-button style="width: 100%"
        @click="cancel()"
      >取消</el-button></el-col>
    </el-row>
    <div style="height: 10px"/>

  </div>
</template>

<script lang="ts">
import { AppFuncTs } from '@/logic/AppFunc';
import { note } from '@/logic/note/note';
import {Options, Vue} from 'vue-class-component';


@Options({
  props: {
  }
})
export default class EditArticleBarDiag extends Vue {
  $props!: {
  }
  article_name=""
  // ebid=""
  // notehandle:undefined|note.NoteHandle=undefined
   start_edit(_0_edit_1_new:number,
             ebid:string,
             articlename:string,
            notehandle:note.NoteHandle){
    this.article_name=articlename
     // this.notehandle=notehandle
    if(_0_edit_1_new==0){

    }else{

    }
  }
  upload_article_title(){
    this.$emit("hide_edit")
    AppFuncTs.get_ctx().logic_articleman.upload_article_title(this.article_name)
      .then(()=>{
        // if (AppFuncTs.get_ctx().logic_articleman.notehandle){
          const v=AppFuncTs.get_ctx().logic_articleman.notehandle?.note_id
        if(v){
          AppFuncTs.get_ctx().logic_articleman.load_article_list_and_update_ui(
              v
          )
        }

        // }
      })
  }
  cancel(){
    this.$emit("cancel_edit")
  }
}
</script>

t<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
