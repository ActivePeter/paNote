<template>
  <el-card class="ReviewPartCard" @mousedown="on_mouse_down"

           shadow="hover"
           style="margin-bottom: 10px"
           :body-style="{padding: '10px'}"
  >

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

    <div v-show="show_back" class="title">背面</div>
    <div v-show="show_back" style="height: 10px"></div>
    <EditorBarViewList
        v-show="show_back"
        ref="back_list"
        :editing="false"
    ></EditorBarViewList>

    <!--    <div style="height: 10px"></div>-->
    <!--    <quill-editor-->
    <!--        :content="helper.front_content"-->
    <!--        :options="editorOption"-->
    <!--    ></quill-editor>-->
  </el-card>
</template>

<script>
import EditorBarViewList from "@/components/reuseable/EditorBarViewList"
import EditorBarViewListFunc from "@/components/reuseable/EditorBarViewListFunc";
import {RightMenuFuncTs} from "@/components/RightMenuFuncTs";
import {ReviewPartCardFunc} from "@/components/review_part/ReviewPartCardFunc";
// import AppFunc from "@/logic/AppFunc";

export default {
  name: "ReviewPartCard",
  components: {
    EditorBarViewList
  },
  computed: {},
  watch: {
    card_data(v) {
      console.log("card data change", this.card_data)
      this.sync_card_data(v)
    }
  },
  mounted() {
    this.sync_card_data(this.card_data)
  },
  data() {
    return {};
  },
  methods: {
    on_mouse_down(e) {
      // console.log("reviewpartcard", e)
      this.$emit("review_part_cb", (review_part) => {
        RightMenuFuncTs.if_right_click_then_emit_bus(e, ReviewPartCardFunc.construct_right_menu(review_part, this))
      })
    },
    sync_card_data(v) {
      if (v) {
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
    card_key: String,
    card_data: {
      type: Object,
      default: null

    },
    show_back: Boolean
  },
};
</script>

<style scoped>
.title {
  text-align: left;
}

.add_btn {
  text-align: left;
}

.top_btn {
  width: 100%;
}
</style>