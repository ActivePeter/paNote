<template>
  <div class="container">
    <el-button style="width: 100%" @click="start_add_new_note">添加新笔记</el-button>
    <!--  </el-row>/-->
    <div style="height: 10px"></div>
    <NoteListBar
        v-for="(item, i) in notelist_manager.data_to_storage.pub_notes"
        :key="i"
        :id="i"
        :name="item.name"
        :open_id="open_id"

        @right_menu="note_list_bar_right_menu"
        @delete="note_list_bar_delete"
        @change_name="note_list_bar_change_name"
        @open_note="open_note"
    ></NoteListBar>
  </div>
<!--  <div class="note_list">Note_list</div>-->
<!--  <el-row>-->

</template>

<script>
// import NoteListFunc from "@/components/NoteListFunc";
import NoteListBar from "@/components/NoteListBar";
import RightMenuFunc from "@/components/RightMenuFunc";
import {NoteListFuncTs} from "@/components/NoteListFuncTs";
export default {
  name: "NodeList",
  components:{
    NoteListBar
  },
  mounted() {
    this.$emit("get_context",this);
  },
  data() {
    return {
      context:null,
      notelist_manager:new NoteListFuncTs.NoteListManager()
    };
  },
  methods: {
    set_context(ctx){
      this.context=ctx;
      this.notelist_manager.pub_note_list_mounted(ctx,this);
    },
    open_note(note_id){
      this.notelist_manager.open_note(this.context,note_id)
    },
    start_add_new_note(){
      this.notelist_manager.add_new_note(this.context);
    },
    init(context){
      this.context=context;
      this.notelist_manager.pub_note_list_mounted(context,this);
    },
    note_list_bar_right_menu(event,tag,obj){
      RightMenuFunc.continue_emit(event,tag,obj,this);
    },
    note_list_bar_delete(note_list_bar){
      this.notelist_manager.delete_note(this.context,note_list_bar.id);
    },
    note_list_bar_change_name(bar){
      console.log("note_list_bar_change_name")
      this.notelist_manager.change_note_name(this.context,bar.id,bar.editing_name)
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