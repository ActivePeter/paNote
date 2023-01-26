<template>
    <el-dialog v-model="dialogFormVisible" title="登录" width="300px">
      <el-input style="height: 45px" v-model="id" placeholder="账号" autocomplete="off" />
      <div style="height: 20px"></div>
      <el-input style="height: 45px" v-model="pw" show-password placeholder="密码" autocomplete="off" />
      <template #footer>
      <span class="dialog-footer">
        <el-button style="height: 45px" @click="dialogFormVisible = false">取消</el-button>
        <el-button style="height: 45px" type="primary" @click="login"
        >登录</el-button
        >
      </span>
      </template>
    </el-dialog>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import {AppFuncTs} from "@/logic/app_func";
import { ElNotification } from 'element-plus';


@Options({
  props: {
  }
})
export default class LoginPanel extends Vue {
  $props!: {
  }
  dialogFormVisible=false
  id=""
  pw=""
  show(){
    this.dialogFormVisible=true
  }
  login(){
    AppFuncTs.get_ctx().authority_man.login(
        this.id,this.pw,(r)=>{
          if(r){

          }
          this.dialogFormVisible = false
        }
    )
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/*.cmd_name {*/
/*  display: inline-block;*/
/*  !*height: 32px;*!*/
/*  !*vertical-align: middle;*!*/
/*  position: absolute;*/
/*  top: 50%;*/
/*  transform: translateY(-50%);*/
/*}*/

/*.card {*/
/*  !*position: relative;*!*/
/*  vertical-align: middle;*/
/*}*/

/*.btns {*/
/*  float: right;*/
/*}*/
</style>
