<template>
  <div class="out_range">
    <SideBarContainer
        class="container"
        :width="240"
        :on_left="true"
    >
      <template v-slot:sidebar>
        <NoteList ref="note_list_ref"
                  @right_menu="right_menu"
                  @get_context="get_context"
        ></NoteList>
      </template>
      <template v-slot:content>
        <div>
          <el-row class="tool_line">
            <el-button-group>
              <el-button disabled="true" @click="maincanvas_undo"><el-icon><ArrowLeft /></el-icon>撤回</el-button>
              <el-button disabled="true" @click="maincanvas_redo">
                取消撤回 <el-icon><ArrowRight /></el-icon>
              </el-button>
            </el-button-group>
            <div style="width: 10px"></div>
            <el-button @click="add_editor_bar">add note bar</el-button>
            <div style="width: 10px"></div>
            <el-radio-group v-model="cursor_mode_selected" >
              <el-radio-button label="拖拽"></el-radio-button>
              <el-radio-button label="连线"></el-radio-button>
              <!--            <el-radio-button label="选择"></el-radio-button>-->
            </el-radio-group>
            <div style="width: 10px"></div>
            <el-button v-show="showlogbar" @click="show_log_panel">
              登录
            </el-button>
            <input v-if="file" type="file" ref="file_ref" style="display: none" @change="read_f">
          </el-row>
        </div>
        <SideBarContainer
            :width="240"
            :on_left="false"
        >
          <template v-slot:sidebar>
            <RightPart ref="right_part">
              <ReviewPart
                  class="review_part"
                  ref="review_part_ref"
                  @request_for_conttext="handle_request_for_conttext"
              ></ReviewPart>
            </RightPart>
          </template>
          <template v-slot:content>
            <div class="note_canvas_border content">
              <NoteCanvas
                  class="note_canvas"
                  ref="note_canvas_ref"
                  :cursor_mode="cursor_mode_selected"
                  @right_menu="right_menu"
                  @get_context="get_context"
              />
            </div>
          </template>

        </SideBarContainer>
      </template>
    </SideBarContainer>
    <RightMenu ref="right_menu_ref"></RightMenu>
    <LoginPanel ref="login_panel_ref"></LoginPanel>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { AppFuncTs } from './logic/AppFunc';
import HelloWorld from './components/HelloWorld.vue';
import SideBarContainer from "@/components/reuseable/SideBarContainer.vue";
import NoteCanvas from "./components/note_canvas/NoteCanvas.vue";
import NoteList from "./components/NoteList.vue"
import RightMenu from "./components/RightMenu.vue"
import LoginPanel from "@/components/LoginPanel.vue";

// import AppFunc from './logic/AppFunc';

@Options({
  components: {
    LoginPanel,
    HelloWorld,
    SideBarContainer,
    NoteCanvas,
    NoteList,
    RightMenu
  },
})
export default class App extends Vue {
  context:undefined|AppFuncTs.Context
  cursor_mode_selected=""
  showlogbar=false

  created() {
    this.context=new AppFuncTs.Context(this)
    this.context.init();
    this.context.app = this;
    AppFuncTs.set_ctx(this.context)
  }
  add_editor_bar(){
    this.context?.add_editor_bar()
  }
  show_log_panel(){
    // this.$refs.login_panel_ref.show()
    this.context?.ui_refs().login_panel().show()
  }
}
</script>

<style>
body{
  margin: 0px;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;

}
.out_range{
  padding-top: 10px;
  padding-left: 10px;
}
.tool_line {
  margin-bottom: 10px;
}

.note_canvas_border {
  border: 1px solid gainsboro;
  height: calc(100vh - 100px);
}

.note_canvas {
  height: 100%;
}

.review_part {
  height: calc(100vh - 100px);
  overflow-y: hidden;
}
</style>
