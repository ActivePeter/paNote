<template>
  <EditArticleBarDiag ref="inner_edit_bar_article"
                      v-show="inner_edit_bar_article_show">

  </EditArticleBarDiag>
  文章列表
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import EditArticleBarDiag from "@/components/article/EditArticleBarDiag.vue";


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
  start_edit(_0_edit_1_new:number,
             ebid:string,
             articlename:string){
    this.inner_edit_bar_article_show=true
    this.$refs.inner_edit_bar_article.start_edit(
        _0_edit_1_new,ebid,articlename);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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
