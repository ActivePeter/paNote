<template>
  <div class="ReviewPartAddNewCard">
    <el-row :gutter="20">
      <el-col :span="12"><div class="grid-content bg-purple">
        <el-button
            class="top_btn"
          @click="cancel_add_card"
        > 取消</el-button>
      </div></el-col>
      <el-col :span="12">
        <el-button type="primary"
                   class="top_btn"
                   @click="final_add_new_card"
        >{{ editing_mode?"完成":"创建" }}</el-button>
      </el-col>
    </el-row>

    <div style="height: 10px"></div>
    <div class="title">正面</div>
    <div style="height: 10px"></div>
    <EditorBarViewList ref="front_list"></EditorBarViewList>
    <div style="height: 10px"></div>
    <div
        class="add_btn">
      <el-button
          type="text"
          @click="front_add_btn_click"
      >add</el-button>
    </div>
    <div style="height: 10px"></div>
    <div class="title">背面</div>
    <div style="height: 10px"></div>
    <EditorBarViewList
        ref="back_list"
    ></EditorBarViewList>
    <div
        class="add_btn">
      <el-button type="text"
                 @click="back_add_btn_click"
      >add</el-button>
    </div>
    <div style="height: 10px"></div>
<!--    <quill-editor-->
<!--        :content="helper.front_content"-->
<!--        :options="editorOption"-->
<!--    ></quill-editor>-->
  </div>
</template>

<script>
import {ReviewPartFunc} from "@/components/review_part/ReviewPartFunc";
import EditorBarViewList from "@/components/reuseable/EditorBarViewList"
// import EditorBarViewListFunc from "@/components/reuseable/EditorBarViewListFunc";
// import AppFunc from "@/logic/AppFunc";

export default {
  name: "ReviewPartAddNewCard",
  components:{
    EditorBarViewList
  },
  computed:{
  },
  mounted() {
    if(this.editing_mode){
      this.helper.set_content_with_card(this,this.editing_mode_card)
    }
  },
  data() {
    return {
      helper:new ReviewPartFunc.AddNewCardHelper(),
    };
  },
  methods: {
    front_add_btn_click(event){
      this.helper.add_btn_click(this.$refs.front_list,event)
    },
    back_add_btn_click(event){
      this.helper.add_btn_click(this.$refs.back_list,event)
    },
    cancel_add_card(){
      ReviewPartFunc.AddNewCard.Funcs.emit_cancel_add_new_card(this)
    },
    final_add_new_card(){
      ReviewPartFunc.AddNewCard.Funcs.emit_final_add_new_card(this)
    }
  },
  props: {
    editing_mode:Boolean,
    editing_mode_card:Object
  },
};
</script>

<style scoped>
.title{
  text-align: left;
}
.add_btn{
  text-align: left;
}
.top_btn{
  width: 100%;
}
</style>