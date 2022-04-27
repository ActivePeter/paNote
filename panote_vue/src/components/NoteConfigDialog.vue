<template>
  <el-dialog
      v-model="visible"
      title="Tips"
      width="60%"
      :before-close="_handleClose"
  >
    <span>note id {{noteid}} {{note_config_info}}</span>
    <el-collapse v-model="collapse_active_name" accordion>
      <el-collapse-item title="绑定到文件" name="1">
        <div>
          <div v-if="!note_config_info.bind_file">
            <el-button type="success" round plain
            @click="_start_bind_file"
            >当前笔记未绑定到文件，数据易丢失，点击选择文件进行绑定</el-button>
          </div>
          <div v-if="note_config_info.bind_file">
            已经绑定到 {{note_config_info.bind_file}}
            <el-button type="success" round plain
                       @click="_start_bind_file"
            >修改绑定</el-button>
            <el-button type="warning" round plain
                       @click="_cancel_bind_file"
            >取消绑定</el-button>
          </div>
        </div>
      </el-collapse-item>
      <el-collapse-item title="Feedback" name="2">
        <div>
          Operation feedback: enable the users to clearly perceive their
          operations by style updates and interactive effects;
        </div>
        <div>
          Visual feedback: reflect current state by updating or rearranging
          elements of the page.
        </div>
      </el-collapse-item>
    </el-collapse>
    <template #footer>
      <span class="dialog-footer">
<!--        <el-button @click="cancel">取消</el-button>-->
        <el-button type="primary" @click="_done"
        >保存配置</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import {NoteListFuncTs} from "@/components/NoteListFuncTs";

import  {AppFuncTs} from "@/AppFunc";
// import ipcMain = Electron.Main.ipcMain;
// import ipcRenderer = Electron.Renderer.ipcRenderer;
import {_ipc} from "@/ipc";
import {ipcRenderer} from "electron";
// import {dialog} from "electron";
// import Context = AppFuncTs.Context;
@Options({
  props: {
  }
})
export default class NoteConfigDialog extends Vue {
  $props!: {
  }
  //外部不要直接修改
  visible=false
  noteid="-1";
  collapse_active_name="1"
  note_config_info:null|NoteListFuncTs.NoteConfigInfo=null
  _ctx:null|AppFuncTs.Context=null
  _invoking=false
  // eslint-disable-next-line no-unused-vars
  show(ctx:AppFuncTs.Context,noteid:string){
    this._ctx=ctx
    //加载note相关的一系列信息
    this.note_config_info=NoteListFuncTs.get_note_config_info(
        NoteListFuncTs.get_note_list_from_ctx(ctx).notelist_manager,noteid);
    if(this.note_config_info){
      this.noteid = noteid;
      this.visible=true
    }
  }
  _handleClose(){
    this.visible=false
  }
  _done(){
    if(this._ctx&&this.note_config_info){
      this._ctx.get_notelist_manager()?.
        set_note_config_with_NoteConfigInfo(this._ctx,this.noteid,this.note_config_info)
    }
    this.visible=false
  }
  _start_bind_file(){
    if(!this._invoking){
      this._invoking=true
      ipcRenderer.invoke(_ipc._channels.start_choose_file_bind).then(
          (res)=>{
            console.log(res)
            this._invoking=false
            if(!res.canceled){
              if(this.note_config_info){
                this.note_config_info.bind_file=res.filePaths[0]
              }
            }
          }
      )
    }
  }
  _cancel_bind_file(){
    if(this.note_config_info){
      this.note_config_info.bind_file=null
    }
  }
}
</script>

t<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.cmd_name {
  display: inline-block;
  /*height: 32px;*/
  /*vertical-align: middle;*/
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}

.card {
  /*position: relative;*/
  vertical-align: middle;
}

.btns {
  float: right;
}
</style>
