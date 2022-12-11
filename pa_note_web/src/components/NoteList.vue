<template>
  <div class="container">
    <el-row :gutter="0">
<!--      <el-col :span="12"><div class="grid-content bg-purple" />-->
        <el-button style="width: 100%" @click="start_add_new_note">添加新笔记</el-button>
<!--      </el-col>-->
<!--      <el-col :span="12"><div class="grid-content bg-purple" />-->
<!--        <el-button style="width: 100%" @click="load_from_file">从文件加载</el-button></el-col>-->
    </el-row>

    <!--  </el-row>/-->
    <div style="height: 10px"></div>
    <NoteListBar
        v-if="uibind"
        v-for="(item, i) in uibind.notelist"
        :key="item[0]"
        :id="item[0]"
        :name="item[1]"
        :open_id="open_id"
        :data="item"

        @right_menu="note_list_bar_right_menu"
        @delete="note_list_bar_delete"
        @change_name="note_list_bar_change_name"
    ></NoteListBar>
  </div>
<!--  <div class="note_list">Note_list</div>-->
<!--  <el-row>-->

</template>

<script>
// import NoteListFunc from "@/components/NoteListFunc";
import NoteListBar from "@/components/NoteListBar";
// import RightMenuFunc from "@/components/RightMenuFunc";
import {NoteListFuncTs} from "@/components/NoteListFuncTs";
//import {bus_events} from "@/bus";
import {RightMenuFuncTs} from "@/components/RightMenuFuncTs";
import {AppFuncTs} from "@/logic/AppFunc";

export default {
  name: "NodeList",
  components:{
    NoteListBar
  },
  created() {
    // this.context=AppFuncTs.get_ctx()
    this.uibind=this.get_manager().uibind;
  },
  mounted() {
  },
  unmounted() {
  },
  data() {
    return {
      uibind:undefined
    };
  },
  methods: {
    get_manager(){
      return AppFuncTs.get_ctx().get_notelist_manager()
    },
    // set_context(ctx){
    //   this.context=ctx;
    //   this.notelist_manager.pub_note_list_mounted(ctx,this);
    // },
    // open_note(note_id){
    //   this.notelist_manager.open_note(this.context,note_id)
    // },
    start_add_new_note(){
      this.get_manager().add_new_note();
    },
    init(context){
      // this.context=context;
      // this.notelist_manager.pub_note_list_mounted(context,this);
    },
    note_list_bar_right_menu(event,tag,obj){
      // RightMenuFuncTs.continue_emit(event,tag,obj,this);
    },
    note_list_bar_delete(note_list_bar){
      // this.notelist_manager.delete_note(this.context,note_list_bar.id);
    },
    note_list_bar_change_name(bar){
      // console.log("note_list_bar_change_name")
      // this.notelist_manager.change_note_name(this.context,bar.id,bar.editing_name)
    }
  },
  props: {
    open_id:String
  },
};
</script>

<style scoped>
.container{
  padding-right: 10px;
}
</style>