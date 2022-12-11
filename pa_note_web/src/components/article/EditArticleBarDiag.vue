<template>
  <div>
    <el-input v-model="article_name" placeholder="命名笔记块的文章名" />
  </div>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';


@Options({
  props: {
  }
})
export default class ArticleList extends Vue {
  $props!: {
  }
  article_name=""
   start_edit(_0_edit_1_new:number,
             ebid:string,
             articlename:string){
    this.article_name=articlename
    if(_0_edit_1_new==0){

    }else{

    }
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
