<template>
  <div class="container">
    {{ review_part_man.note_store_part ? review_part_man.note_store_part.sync_anki_serialized : "" }}
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
        <el-row :gutter="10">
          <el-col :span="12">
            <el-button class="add_btn" @click="switch2add_card">管理卡片组</el-button>
          </el-col>
          <el-col :span="12">
            <el-button class="add_btn" @click="switch2add_card">添加卡片组</el-button>
          </el-col>
        </el-row>

<!--        <div style="height: 10px"></div>-->

        <div style="height: 10px"></div>
        <div v-if="review_part_man.selected_card_set!==''">
          <el-button class="add_btn" @click="btn_add_card_to_cur_set">添加卡片到当前组</el-button>
          <div style="height: 10px"></div>

          <el-button
              style="margin-bottom: 10px"
              class="add_btn" @click="start_review_cur_card_set">
            {{review_part_man.reviewing_state.card_id===''?"开始复习":"停止复习"}}
          </el-button>
          <!--          <div style="height: 10px"></div>-->
        </div>

      </div>
    </div>

    <ReviewPartAddNewCard
        v-if="show_add_new_card_view"

        :editing_mode="review_part_man.add_new_card__editing_mode"
        :editing_mode_card="review_part_man.add_new_card__editing_mode_card"

        @cancel_add_new_card="cancel_add_new_card"
        @final_add_new_card="final_add_new_card"
    />
    <div v-if="mode==='review_cards'&&review_part_man.selected_card_set!==''">

      <!--      <div v-if="">-->

      <div class="card_list" :style="{
          height:'calc(100vh - ' +($refs.top.offsetHeight+80)+'px)'
        }">
        <ReviewPartReviewing
            v-if="review_part_man.reviewing_state.card_id!==''"
            :rpman="review_part_man"
        ></ReviewPartReviewing>
<!--        <el-card-->
<!--            v-else-->
<!--            v-for="(item, i) in review_part_man.card_set_man.cardsets[review_part_man.selected_card_set].cards"-->
<!--            :key="i"-->

<!--            shadow="hover"-->
<!--            style="margin-bottom: 10px"-->
<!--            :body-style="{padding: '10px'}"-->
<!--        >-->
          <ReviewPartCard
              v-else
              v-for="(item, i) in review_part_man.card_set_man.cardsets[review_part_man.selected_card_set].cards"
              :key="i"

              :card_key="i"
              :card_data="item"
              :show_back="true"
              @review_part_cb="review_part_cb"
          ></ReviewPartCard>
<!--        </el-card>-->

      </div>
      <!--        {{ review_part_man.card_set_man.cardsets[review_part_man.selected_card_set].cards }}-->
      <!--        {{ review_part_man.card_set_man.cardsets[review_part_man.selected_card_set]}}-->
      <!--        <div-->
      <!--            v-for="(item, i) in review_part_man.card_set_man.cardsets[review_part_man.selected_card_set].cards"-->
      <!--            :key="i"-->
      <!--        >-->
      <!--          {{item}}-->
      <!--        </div>-->
      <!--      </div>-->

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
import {ReviewPartFunc} from "@/components/ReviewPartFunc.ts";
import ReviewPartAddNewCard from "./ReviewPartAddNewCard"
// import {ReviewPartFuncNew} from "@/components/ReviewPartFunc";
// import {ElMessage} from "element-plus";
import ReviewPartCard from "@/components/ReviewPartCard"
import {bus_events} from "@/bus";
import {AppFuncTs} from "@/AppFunc";
import {_ipc} from "@/ipc";
import electron_net from "@/electron_net";
import {TalkPacker} from "@/talk_packer";
import {_ReviewPartSyncAnki} from "@/components/ReviewPartSyncAnki";
import ReviewPartReviewing from "@/components/ReviewPartReviewing";

export default {
  name: "ReviewPart",
  components: {
    ReviewPartAddNewCard,
    ReviewPartCard,
    ReviewPartReviewing
  },
  mounted() {
    console.log("")
    // Storage.ReviewPart.load_all(this.review_part_man);
    bus_events.events.note_canvas_data_loaded.listen(this.note_canvas_loaded)
    // AppFuncTs.request_for_conttext(this, (ctx) => {
    //   this.review_part_man.mount(ctx)
    // })
    // for(const key in this.mount_getrpman_cbs){
    //   this.mount_getrpman_cbs[key]
    // }
  },
  created() {
    this.review_part_man.mount(AppFuncTs.appctx)
  },
  unmounted() {
    bus_events.events.note_canvas_data_loaded.cancel(this.note_canvas_loaded)
  },
  computed: {
    show_add_new_card_view() {
      return this.mode === ReviewPartFunc.ReviewPartGuiMode.AddNewCard || this.mode === ReviewPartFunc.ReviewPartGuiMode.EditCard
    }
  },
  data() {
    return {
      mount_getrpman_cbs:[],
      review_part_man: new ReviewPartFunc.ReviewPartManager(),
      input_card_set_name: "",//添加卡组模式下的输入框内容
      mode: 'review_cards',
    };
  },
  methods: {
    review_part_cb(cb) {
      cb(this)
    },
    note_canvas_loaded(canvas) {
      // console.log("note_canvas_loaded",canvas)
      this.review_part_man.note_canvas_loaded(canvas)
    },
    btn_add_card_to_cur_set() {
      this.mode = ReviewPartFunc.ReviewPartGuiMode.AddNewCard
      this.review_part_man.add_new_card__editing_mode = false
    },
    switch2add_card() {
      this.input_card_set_name = ''
      this.mode = ReviewPartFunc.ReviewPartGuiMode.AddCardSet
    },
    switch2review_card() {
      // console.log("switch2review_card")
      this.mode = ReviewPartFunc.Enum.ReviewPartGuiMode.ReviewCards
      // this.mode=ReviewPartFunc.ReviewPartGuiMode.ReviewCards
    },
    add_card_set() {
      ReviewPartFunc.CardSetManager.add_card_set(
          this.review_part_man.card_set_man,
          this.review_part_man, this.input_card_set_name
      )
      // Storage.ReviewPart.save_all(this.review_part_man)
      this.switch2review_card()
    },
    cancel_add_new_card() {
      this.switch2review_card()
    },
    final_add_new_card(front, back) {
      ReviewPartFunc.Funcs.edit_data_with_buffer_change.final_add_or_edit_card(
          this, front, back
      )
    },
    start_review_cur_card_set() {
      if(this.review_part_man.reviewing_state.card_id===''){
        this.review_part_man.reviewing_state.try_start_review_flag=true;
        const netman = electron_net.get_net_manager()
        if (netman && netman.connected) {
          _ipc.Tasks.tasks.send_to_anki.call(TalkPacker.pack_start_review(
              new _ReviewPartSyncAnki._OneOperation.OpeCardSet(
                  this.review_part_man.note_id, this.review_part_man.selected_card_set))
              .serialize())
        }
      }else{
        this.review_part_man.reviewing_state.card_id=''
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

.card_list {

  /*height: 100%;*/
  overflow-y: scroll;
}
</style>