<template>
  <div class="searchbar">
    <FlatInput class="input" v-model:value="searchstr"></FlatInput>
    <div class="scbtns">
      <el-icon v-if="searchstr!==''"
               class="scbtn icobtn"
        @click="cleartext"
      ><DeleteFilled></DeleteFilled></el-icon>
      <el-popover
          width="170px"
      >
        <template #reference>
          <el-icon class="icobtn"><MoreFilled></MoreFilled></el-icon>
        </template>
        <div class="setline">区分大小写<el-checkbox
          v-model="note_canvas_datareacher.notecanvas.content_manager.search_in_canvas.ui_match_case"
        ></el-checkbox></div>
        <div >包含
          <span :style="keyword_any_or_each?style_keyword_sel:style_keyword_unsel"
          @click="set_keyword_any_each(true)"
          >
            任意</span>/<span
              :style="keyword_any_or_each?style_keyword_unsel:style_keyword_sel"
              @click="set_keyword_any_each(false)"
          >全部</span>
          关键字
<!--          <el-checkbox-->
<!--          v-model="note_canvas_datareacher.notecanvas.content_manager.search_in_canvas.ui_keyword_any_or_each"-->
<!--        ></el-checkbox>-->
        </div>
      </el-popover>
      <el-button :icon="Search" circle @click="canvas_search"/>
    </div>
<!--    {{searchstr}}-->
  </div>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import FlatInput from "@/3rd/pa_comps/flat_input.vue";
import {Search,DeleteFilled,MoreFilled} from "@element-plus/icons-vue";
import {ElIcon} from "element-plus";
import {NoteCanvasTs} from "@/components/NoteCanvasTs";
import {Watch} from "vue-property-decorator";
// import {Watch} from "vue-property-decorator";

@Options({
  components:{
    FlatInput,
    ElIcon,
    DeleteFilled,
    MoreFilled,
    // ElCheckbox
  },
  props: {
    note_canvas_datareacher:Object
  },

})
export default class NoteCanvasSearchBar extends Vue {
  $props!: {
    note_canvas_datareacher:NoteCanvasTs.NoteCanvasDataReacher
  }
  searchstr=''
  @Watch('searchstr')
  w_searchstr(v:string){
    if(v==''){
      this.$props.note_canvas_datareacher.get_content_manager().search_in_canvas.clear_search()
    }
  }
  get style_keyword_sel(){
    return {color: 'green'};
  }
  get style_keyword_unsel(){
    return {
      cursor: 'pointer'};
  }
  set_keyword_any_each(v:boolean){
    this.$props.note_canvas_datareacher.get_content_manager().search_in_canvas.ui_keyword_any_or_each=v
  }
  get keyword_any_or_each(){
    return this.$props.note_canvas_datareacher.get_content_manager().search_in_canvas.ui_keyword_any_or_each
  }
  // set_match_case=false
  // set_keyword_any_or_each=false
  // @Watch('set_match_case')
  // w_set_match_case(v:boolean){
  //   console.log("w_set_match_case")
  //   this.$props.note_canvas_datareacher.get_content_manager().search_in_canvas.ui_match_case=v;
  // }
  // @Watch('set_keyword_any_or_each')
  // w_set_keyword_any_or_each(v:boolean){
  //   this.$props.note_canvas_datareacher.get_content_manager().search_in_canvas.ui_keyword_any_or_each=v;
  // }

  //icons
  Search=Search
  DeleteFilled=DeleteFilled
  cleartext(){
    this.searchstr=''
    this.$props.note_canvas_datareacher.get_content_manager().search_in_canvas.clear_search();
  }
  start_edit(){

  }
  canvas_search(){
    this.$props.note_canvas_datareacher.get_content_manager().search_in_canvas.start_search(
        this.searchstr
    )
    // this.$emit("canvas_search",this.searchstr)
  }
}
</script>

t<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.setline{
  display: flex;
  justify-content: space-between;
  line-height: 32px;
}
.searchbar{
  position: relative;
  height: 40px;
  min-width: 70px;
  border: 1px solid #ccc;
  border-radius: 20px;

  background: rgba(235, 234, 234,90%);
  /*background: #8a8a8a;*/
  z-index: 1;
}
.icobtn{
  color: gray;
  cursor: pointer;
  margin-right: 5px;
}
.scbtns{
  position: absolute;
  top: 4px;
  right: 4px;
  display:flex;
  align-items:center;

}
.scbtn{
  height: 32px;
}
.input{
  line-height: 40px;
  padding-right: 38px;
  padding-left: 10px;
  /*padding: 10px;*/
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
