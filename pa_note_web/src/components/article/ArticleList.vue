<template>
  <EditArticleBarDiag ref="inner_edit_bar_article"
                      v-show="inner_edit_bar_article_show"
                      @cancel_edit="cancel"
                      @hide_edit="cancel"
  >
  </EditArticleBarDiag>
  文章列表
  <div class="article_list_bar" v-for="(item, i) in article_list"
    @click="locate(item.barid)"
  >
    {{item.artname}}
  </div>

</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import EditArticleBarDiag from "@/components/article/EditArticleBarDiag.vue";
import {note} from "@/logic/note/note";
import { AppFuncTs } from '@/logic/AppFunc';


@Options({
  components: {EditArticleBarDiag},
  props: {
  }
})
export default class ArticleList extends Vue {
  $props!: {
  }
  $refs!: {
    inner_edit_bar_article: EditArticleBarDiag
  }
  inner_edit_bar_article_show=false
  article_list:{barid:string,artname:string,edittime:number}[]=[]
  update_article_list(list:{barid:string,artname:string,edittime:number}[]){
    this.article_list=list
  }
  cancel(){
    this.inner_edit_bar_article_show=false
  }
  locate(ebid:string){
    AppFuncTs.get_ctx().ui_refs().main_canvasproxy().get_content_manager()
        .user_interact.locate_editor_bar(ebid);
  }
  start_edit(_0_edit_1_new:number,
             ebid:string,
             articlename:string,notehandle:note.NoteHandle){
    this.inner_edit_bar_article_show=true
    this.$refs.inner_edit_bar_article.start_edit(
        _0_edit_1_new,ebid,articlename,notehandle);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.article_list_bar{
  padding: 10px;
  cursor: pointer;
}
.article_list_bar:hover{
  color: #3a8ee6;
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
