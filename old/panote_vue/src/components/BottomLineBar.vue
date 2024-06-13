<template>
  <div class="bar"
    @mouseover="event_mouseover"
       @mouseout="event_mouseout"
       @click="event_click"
       @blur="event_blur"
  >
    <el-popover

        placement="top-start"
        :width="200"
        v-model:visible="popo_visible"
    >
      <div>
        <div class="floatwin_title">
          当前更新状态
        </div>
        <div class="floatwin_close"
          @click="floatwin_close"
        >
          x
        </div>
        <UpdateState ref="update_state_ref" v-if="$props.id==='update_state'"/>
      </div>
      <template #reference>
        {{ $props.name}}
      </template>
    </el-popover>
  </div>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
// import {ReviewPartFunc} from "@/components/ReviewPartFunc";
import {BottomLineFunc} from "@/components/BottomLineFunc";
import {Watch} from "vue-property-decorator";
import UpdateState from "@/components/UpdateState.vue";

@Options({
  components:{
    UpdateState
  },
  props: {
    name:String,
    type:String,
    bottom_focus_id:String,
    id:String
  },
  emits:['update:bottom_focus_id'],
})

export default class BottomLineBar extends Vue {
  _BottomLineFunc=BottomLineFunc
  @Watch('bottom_focus_id')
  on_bottom_focus_id(){
    this.update_popo_visible()
  }

  $props!: {
    name:string,
    type:string,
    bottom_focus_id:string,
    id:string
  }
  $refs!:{
    update_state_ref:UpdateState
  }
  popo_visible=false
  update_popo_visible(){
    if(this.$props.bottom_focus_id==this.$props.id){
      this.popo_visible=true
    }else{
      this.popo_visible=false
    }
  }
  event_mouseover(){

  }
  event_mouseout(){

  }
  floatwin_close(){
    this.$emit('update:bottom_focus_id',"")
  }
  event_click(){
    // console.log( 'update:bottom_focus_id',this.$props.id)
    this.$emit('update:bottom_focus_id',this.$props.id)
    // this.popo_visible=true
  }
  event_blur(){
    // this.popo_visible=false
  }
  // review_part_man?:ReviewPartFunc.ReviewPartManager
  mounted(){
    this.update_popo_visible()
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
.bar{
  padding-left: 5px;
  padding-right: 5px;
  font-size: 12px;
  cursor: pointer;
}
.floatwin_title{
  display: inline-block;
  font-size: 16px;
  margin-bottom: 8px;
}
.floatwin_close{
  float: right;
  cursor: pointer;
}
</style>
