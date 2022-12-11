<template>
  <div class="updatestate">
<!--    {{state}}-->
    <div v-if="state===states.checking">
      正在获取版本信息
    </div>
    <div v-else-if="state===states.already">
      已经更新到最新版，点击刷新
    </div>
    <div v-else-if="state===states.downloading">
      正在下载最新版
    </div>
    <div v-else-if="state===states.need">
      版本信息获取失败，点击重新加载
    </div>
    <div v-else-if="state===states.downloaded">
      <div
          v-if="install_after_close"
      >
        新版本安装包已下载，关闭程序后将自行安装
<!--        <el-button ></el-button>-->
      </div>
<!--      <div-->
<!--        v-else-->
<!--      >-->
<!--        <div style="height: 10px;width: 1px;"></div>-->
<!--        <el-button @click="immediate_install_update">立即关闭软件并安装</el-button>-->
<!--      </div>-->
    </div>
  </div>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
// import {_ipc} from "@/ipc";
// import {Watch} from "vue-property-decorator";
@Options({
  components:{
  },
  props: {
  },
})

export default class UpdateState extends Vue {
  static states={
    already:"already",//已经最新，给一个刷新按钮
    need:"need",//检测失败或下载失败，给一个button手动更新
    downloading:"downloading",//下载中
    checking:"checking",//最开始状态，检查更新中，1若有，更新 2失败，设置为need 3已经最新,设置为already
    downloaded:"downloaded"
  }
  states=UpdateState.states
  state=UpdateState.states.downloaded
  install_after_close=false
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
  set_state(state:string){
    this.state=state
  }
  // immediate_install_update(){
  //   _ipc.Tasks.tasks.auto_update_render_call_main.call();
  // }
}
</script>

t<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
