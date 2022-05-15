<template>
  <div class="bottomline">
    <div class="right_bars">
      <BottomLineBar class="right_bar"
                     :name=" '更新状态'"
            :id="'update_state'" v-model:bottom_focus_id="bottom_focus"
                     ref="bar_update_state"
      />
    </div>
  </div>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import BottomLineBar from "@/components/BottomLineBar.vue";
import {Watch} from "vue-property-decorator";
@Options({
  components:{
    BottomLineBar
  },
  props: {
  },
})

export default class BottomLine extends Vue {
  // review_part_man?:ReviewPartFunc.ReviewPartManager
  bottom_focus="_"

  @Watch('bottom_focus')
  on_bottom_focus(v:string){
    console.log("on_bottom_focus",v)
  }
  $refs!:{
    bar_update_state:BottomLineBar
  }
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
}
</script>

t<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .bottomline{
    border-top: 1px solid gainsboro;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 25px;
    /*background-color: #8cc5ff;*/
  }
  .right_bars{
    float: right;
  }
  .right_bar{
    border-left: 1px solid gainsboro;
    height: 25px;
    line-height: 25px;
  }
</style>
