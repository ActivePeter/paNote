<template>
  <div class="ReviewPartCard">
<!--    <el-row :gutter="20">-->
<!--      <el-col :span="12"><div class="grid-content bg-purple">-->
<!--        <el-button-->
<!--            class="top_btn"-->
<!--          @click="cancel_add_card"-->
<!--        >取消</el-button>-->
<!--      </div></el-col>-->
<!--      <el-col :span="12">-->
<!--        <el-button type="primary"-->
<!--                   class="top_btn"-->
<!--                   @click="final_add_new_card"-->
<!--        >创建</el-button>-->
<!--      </el-col>-->
<!--    </el-row>-->
<!--    data:{{card_data}}-->
    <div class="title">正面</div>
    <div style="height: 10px"></div>
    <EditorBarViewList ref="front_list"
      :editing="false"
    ></EditorBarViewList>
    <div style="height: 10px"></div>
    <div class="title">背面</div>
    <div style="height: 10px"></div>
    <EditorBarViewList
        ref="back_list"
        :editing="false"
    ></EditorBarViewList>
<!--    <div style="height: 10px"></div>-->
<!--    <quill-editor-->
<!--        :content="helper.front_content"-->
<!--        :options="editorOption"-->
<!--    ></quill-editor>-->
  </div>
</template>

<script>
import EditorBarViewList from "@/components/reuseable/EditorBarViewList"
import EditorBarViewListFunc from "@/components/reuseable/EditorBarViewListFunc";
// import AppFunc from "@/AppFunc";

export default {
  name: "ReviewPartCard",
  components:{
    EditorBarViewList
  },
  computed:{
  },
  watch:{
    card_data(v){
      console.log("card data change",this.card_data)
      this.sync_card_data(v)
    }
  },
  mounted() {
    this.sync_card_data(this.card_data)
  },
  data() {
    return {
    };
  },
  methods: {
    sync_card_data(v){
      if(v){
        EditorBarViewListFunc.HelperFuncs.Setter.set_bars_directly(
            this.$refs.front_list.helper,
            v.front
        )
        EditorBarViewListFunc.HelperFuncs.Setter.set_bars_directly(
            this.$refs.back_list.helper,
            v.back
        )
      }
    }
  },
  props: {
    card_data:{
        type: Object,
        default: null

    }
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