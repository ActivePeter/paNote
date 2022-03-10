<template>
  <div class="container">
    <div ref="top">
      <el-select v-model="review_part_man.selected_card_set" class="m-2" placeholder="Select">
        <el-option
            v-for="(item, i) in review_part_man.card_set_man.cardsets"
            :key="i"
            :label="item.value"
            :value="item.value"
        >
        </el-option>

      </el-select>
      <!--    <div>-->
      <!--      {{review_part_man.card_set_man.cardsets}}-->
      <!--    </div>-->
      <div style="height: 10px"></div>

      <div v-if="mode==='review_cards'">
        <el-button class="add_btn" @click="switch2add_card">添加卡片组</el-button>
        <div style="height: 10px"></div>
        <div v-if="review_part_man.selected_card_set!==''">
          <el-button class="add_btn" @click="btn_add_card_to_cur_set">添加卡片到当前组</el-button>
          <div style="height: 10px"></div>
        </div>
      </div>
    </div>

    <ReviewPartAddNewCard v-if="show_add_new_card_view"
                          @cancel_add_new_card="cancel_add_new_card"
                          @final_add_new_card="final_add_new_card"
    />
    <div v-if="mode==='review_cards'">

      <div v-if="review_part_man.selected_card_set!==''">
        <div class="card_list" :style="{
          height:'calc(100vh - ' +($refs.top.offsetHeight+80)+'px)'
        }">

          <el-card shadow="hover"
                   style="margin-bottom: 10px"
                   v-for="(item, i) in review_part_man.card_set_man.cardsets[review_part_man.selected_card_set].cards"
                   :key="i"
                   :body-style="{padding: '10px'}"
          >
            <ReviewPartCard

                :card_data="item"

            ></ReviewPartCard>
          </el-card>

        </div>
<!--        {{ review_part_man.card_set_man.cardsets[review_part_man.selected_card_set].cards }}-->
        <!--        {{ review_part_man.card_set_man.cardsets[review_part_man.selected_card_set]}}-->
        <!--        <div-->
        <!--            v-for="(item, i) in review_part_man.card_set_man.cardsets[review_part_man.selected_card_set].cards"-->
        <!--            :key="i"-->
        <!--        >-->
        <!--          {{item}}-->
        <!--        </div>-->
      </div>

    </div>
    <div v-if="mode==='add_card_set'">
      <el-input v-model="input_card_set_name" placeholder="输入卡组名"/>
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
import ReviewPartFunc from "@/components/ReviewPartFunc.ts";
import ReviewPartAddNewCard from "./ReviewPartAddNewCard"
import {ReviewPartFuncNew} from "@/components/ReviewPartFunc";
import {ElMessage} from "element-plus";
import ReviewPartCard from "@/components/ReviewPartCard"
import Storage from "@/components/Storage";

export default {
  name: "ReviewPart",
  components: {
    ReviewPartAddNewCard,
    ReviewPartCard
  },
  mounted() {
    Storage.ReviewPart.load_all(this.review_part_man);
  },
  computed: {
    show_add_new_card_view() {
      return this.mode === ReviewPartFunc.ReviewPartGuiMode.AddNewCard
    }
  },
  data() {
    return {
      review_part_man: new ReviewPartFunc.ReviewPartManager(),
      input_card_set_name: "",

      mode: 'review_cards',
    };
  },
  methods: {
    btn_add_card_to_cur_set() {
      this.mode = ReviewPartFunc.ReviewPartGuiMode.AddNewCard
    },
    switch2add_card() {
      this.input_card_set_name = ''
      this.mode = ReviewPartFunc.ReviewPartGuiMode.AddCardSet
    },
    switch2review_card() {

      this.mode = ReviewPartFuncNew.Enum.ReviewPartGuiMode.ReviewCards
      // this.mode=ReviewPartFunc.ReviewPartGuiMode.ReviewCards
    },
    add_card_set() {
      this.review_part_man.card_set_man.add_card_set(this.input_card_set_name)
      Storage.ReviewPart.save_all(this.review_part_man)
      this.switch2review_card()
    },
    cancel_add_new_card() {
      this.switch2review_card()
    },
    final_add_new_card(front, back) {
      const res = ReviewPartFuncNew.final_add_new_card_2_selected_set(
          this.review_part_man, front, back
      )
      if (res) {
        Storage.ReviewPart.save_all(this.review_part_man)
        this.switch2review_card()
      } else {
        ElMessage({
          message: '无法创建卡片,请检查正反面是否填写完整',
          type: 'warning',
        })
      }
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

.container {
  padding-left: 10px;
  padding-right: 5px;
}

.add_btn {
  width: 100%;
}

.btn {
  width: 100%;
}
.card_list{

  /*height: 100%;*/
  /*overflow-y: scroll;*/
}
</style>