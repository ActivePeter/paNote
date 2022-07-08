<template>
  <div>
    reviewing
    {{$props.rpman.reviewing_state.front_linked_note_ids}}
<!--    {{}}-->
    <div v-if="$props.rpman&&$props.rpman.reviewing_state.card_id!==''">
      {{$props.rpman.reviewing_state.card_id}}
<!--      {{$props.rpman.card_set_man.cardsets[$props.rpman.selected_card_set].cards[$props.rpman.reviewing_card_id]}}-->
<!--      {{$props.rpman.card_set_man.cardsets[$props.rpman.selected_card_set].cards[$props.rpman.reviewing_card_id]}}-->
      <el-card
          shadow="hover"
          style="margin-bottom: 10px"
          :body-style="{padding: '10px'}"
      >

        <ReviewPartCard
            :card_key="$props.rpman.reviewing_state.card_id"
            :card_data="$props.rpman.card_set_man.cardsets[$props.rpman.selected_card_set].cards[$props.rpman.reviewing_state.card_id]"
            :show_back="$props.rpman.reviewing_state.show_answer"
        >

        </ReviewPartCard>
      </el-card>
      <el-button v-if="!$props.rpman.reviewing_state.show_answer" style="width: 100%" @click="show_answer">显示答案</el-button>
      <div v-else>
        <el-button  style="width: 100%; margin-bottom: 10px" @click="answer(0)">again {{answer_button_content0}}</el-button>
        <div></div>
        <el-button  style="width: 100%; margin-bottom: 10px" @click="answer(1)">hard {{answer_button_content1}}</el-button>
        <div></div>
        <el-button  style="width: 100%; margin-bottom: 10px" @click="answer(2)">good {{answer_button_content2}}</el-button>
        <div></div>
        <el-button  style="width: 100%; margin-bottom: 10px" @click="answer(3)">easy {{answer_button_content3}}</el-button>
      </div>
<!--      <el-row :gutter="10">-->
<!--        <el-col :span="12"><div class="grid-content bg-purple" />-->
<!--          <el-button style="width: 100%" @click="start_add_new_note">忘记</el-button></el-col>-->
<!--        <el-col :span="12"><div class="grid-content bg-purple" />-->
<!--          <el-button style="width: 100%" @click="load_from_file">良好</el-button></el-col>-->
<!--      </el-row>-->
<!--      <el-row :gutter="10">-->
<!--        <el-col :span="12"><div class="grid-content bg-purple" />-->
<!--          <el-button style="width: 100%" @click="start_add_new_note">添加新笔记</el-button></el-col>-->
<!--        <el-col :span="12"><div class="grid-content bg-purple" />-->
<!--          <el-button style="width: 100%" @click="load_from_file">从文件加载</el-button></el-col>-->
<!--      </el-row>-->
    </div>
  </div>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import {ReviewPartFunc} from "@/components/ReviewPartFunc";
import ReviewPartCard from "./ReviewPartCard.vue"
import { _ipc } from '@/ipc';
import {TalkPacker} from "@/talk_packer";


@Options({
  components:{
    ReviewPartCard
  },
  props: {
    // father_mount_get_rpmancb:Array
    rpman:Object
  },
})

export default class ReviewPartReviewing extends Vue {
  $props!: {
    rpman:ReviewPartFunc.ReviewPartManager
    // father_mount_get_rpmancb:any[]
  }
  get answer_button_content0(){
    const index=0
    // return ""
    if(!this.$props.rpman){
      return ""
    }
    if(index>=this.$props.rpman.reviewing_state.answer_selections.length){
      return ""
    }
    return this.$props.rpman.reviewing_state.answer_selections[index].toString()
  }
  get answer_button_content1(){
    const index=1
    // return ""
    if(!this.$props.rpman){
      return ""
    }
    if(index>=this.$props.rpman.reviewing_state.answer_selections.length){
      return ""
    }
    return this.$props.rpman.reviewing_state.answer_selections[index].toString()
  }
  get answer_button_content2(){
    const index=2
    // return ""
    if(!this.$props.rpman){
      return ""
    }
    if(index>=this.$props.rpman.reviewing_state.answer_selections.length){
      return ""
    }
    return this.$props.rpman.reviewing_state.answer_selections[index].toString()
  }
  get answer_button_content3(){
    const index=3
    // return ""
    if(!this.$props.rpman){
      return ""
    }
    if(index>=this.$props.rpman.reviewing_state.answer_selections.length){
      return ""
    }
    return this.$props.rpman.reviewing_state.answer_selections[index].toString()
  }
  // review_part_man?:ReviewPartFunc.ReviewPartManager
  mounted(){
    // const _this=this
    // this.$props.father_mount_get_rpmancb.push((rpman:ReviewPartFunc.ReviewPartManager)=>{
    //   _this.review_part_man=rpman;
    //   console.log("request_for_rpman cb",_this.review_part_man)
    // })
    // const _this=this
    // this.$nextTick(()=>{
    //   _this.$emit("request_for_rpman",)
    // })
  }
  start_edit(){

  }
  answer(index:number){
    _ipc.Tasks.tasks.send_to_anki.call(
        TalkPacker.pack_answer(index).serialize()
    )
  }
  show_answer(){
    _ipc.Tasks.tasks.send_to_anki.call(
        TalkPacker.pack_show_answer().serialize()
    )
    // this.$props.rpman.reviewing_state.show_answer=true
  }
}
</script>

t<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
