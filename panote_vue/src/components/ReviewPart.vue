<template>
  <div class="container">

    <el-select v-model="selected" class="m-2" placeholder="Select">
      <el-option
          v-for="(item, i) in review_part_man.card_set_man.cardsets"
          :key="i"
          :label="item.value"
          :value="item.value"
      >
      </el-option>

    </el-select>
    <div style="height: 10px"></div>
    <div v-if="mode==='review_cards'">
      <el-button class="add_btn" @click="switch2add_card">添加卡片组</el-button>
      <div style="height: 10px"></div>
      <el-button v-if="selected!==''" class="add_btn" @click="btn_add_card_to_cur_set">添加卡片到当前组</el-button>
    </div>
    <div v-if="mode==='add_card_set'">
      <el-input v-model="input_card_set_name" placeholder="输入卡组名" />
      <div style="height: 10px"></div>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-button class="btn" @click="switch2review_card">取消</el-button>
        </el-col>
        <el-col :span="12">
          <el-button class="btn" @click="add_card_set" :disabled="input_card_set_name.length===0">完成</el-button>
        </el-col>
      </el-row>


<!--      <el-button class="add_btn" @click="export_f">add_card_set</el-button>-->
    </div>
  </div>
</template>

<script>
import ReviewPartFunc from "@/components/ReviewPartFunc.js";
export default {
  name: "ReviewPart",
  mounted() {
  },
  data() {
    return {
      review_part_man:new ReviewPartFunc.ReviewPartManager(),
      input_card_set_name:"",

      mode:'review_cards',
      selected: '',
      // options: [
      //   // {
      //   //   value: 'Option1',
      //   //   label: 'Option1',
      //   // },
      //   // {
      //   //   value: 'Option2',
      //   //   label: 'Option2',
      //   // },
      //   // {
      //   //   value: 'Option3',
      //   //   label: 'Option3',
      //   // },
      //   // {
      //   //   value: 'Option4',
      //   //   label: 'Option4',
      //   // },
      //   // {
      //   //   value: 'Option5',
      //   //   label: 'Option5',
      //   // },
      // ]
    };
  },
  methods: {
    btn_add_card_to_cur_set(){
      this.mode=ReviewPartFunc.ReviewPartGuiMode.AddNewCard
    },
    switch2add_card(){
      this.input_card_set_name=''
      this.mode=ReviewPartFunc.ReviewPartGuiMode.AddCardSet
    },
    switch2review_card(){

      this.mode=ReviewPartFunc.ReviewPartGuiMode.ReviewCards
    },
    add_card_set(){
      this.review_part_man.card_set_man.add_card_set(this.input_card_set_name)
      this.switch2review_card()
    }
  },
  props: {},
};
</script>

<style scoped>
.editor_bar {
  background: gray;
  width: 100px;
  height: 100px;
}
.container{
  padding-left: 10px;
  padding-right: 5px;
}
.add_btn{
  width: 100%;
}
.btn{
  width: 100%;
}
</style>