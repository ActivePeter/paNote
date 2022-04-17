<template>
  <SideBarContainer
      class="container"
      :width="240"
      :on_left="true"
  >
    <template v-slot:sidebar>
      <NoteList ref="note_list_ref"
                :open_id="context.cur_open_note_id"
                @right_menu="right_menu"
                @get_context="get_context"
      ></NoteList>
    </template>
    <template v-slot:content>
      <div>
        <el-row class="tool_line">
          <el-button @click="add_editor_bar">add note bar</el-button>
          <div style="width: 10px"></div>
          <el-radio-group v-model="cursor_mode_select" size="medium">
            <el-radio-button label="拖拽"></el-radio-button>
            <el-radio-button label="连线"></el-radio-button>
            <el-radio-button label="选择"></el-radio-button>
          </el-radio-group>
          <div style="width: 10px"></div>
          <el-button @click="export_f">export</el-button>
          <div style="width: 10px"></div>
          <el-button @click="import_f">import</el-button>
          <input v-if="file" type="file" ref="file_ref" style="display: none" @change="read_f">
        </el-row>
      </div>
      <SideBarContainer
          :width="240"
          :on_left="false"
      >
        <template v-slot:sidebar>

          <ReviewPart class="review_part"
          ></ReviewPart>
        </template>
        <template v-slot:content>
          <div class="note_canvas_border content">
            <NoteCanvas
                class="note_canvas"
                ref="note_canvas_ref"
                :cursor_mode="cursor_mode_select"
                @right_menu="right_menu"
                @get_context="get_context"
            />
          </div>
        </template>

      </SideBarContainer>
    </template>

  </SideBarContainer>

  <RightMenu ref="right_menu_ref"/>
  <!-- <img alt="Vue logo" src="./assets/logo.png" />
  <HelloWorld msg="Welcome to Your Vue.js App" /> -->
</template>

<script>
// import HelloWorld from "./components/HelloWorld.vue";
import NoteCanvas from "./components/NoteCanvas.vue";
import RightMenu from "@/components/RightMenu";
import ReviewPart from "@/components/ReviewPart";
import SideBarContainer from "@/components/reuseable/SideBarContainer";
import NoteList from "@/components/NoteList";
import AppFunc from "@/AppFunc";
import Storage from "@/components/Storage";

// import electron_net from "@/electron_net";
export default {
  name: "App",
  components: {
    RightMenu,
    // HelloWorld,
    NoteCanvas,
    ReviewPart,
    SideBarContainer,
    NoteList,
  },
  mounted() {
    this.context.app=this;
    this.$refs.note_list_ref.init(this.context);

    AppFunc.set_ctx(this.context)
    // this.net_manager=electron_net.load_net_manager();
  },
  methods: {
    get_context(obj){
      obj.set_context(this.context)
      // obj.context=this.context;
    },
    add_editor_bar() {

      this.$refs.note_canvas_ref.add_editor_bar();
    },
    export_f(){
      Storage.Port.export_all_as_file(this.context)
      // this.context.storage_manager.PortModule_export_cur_file(this.context);
      // this.$refs.note_canvas_ref.storage.export()
    },
    import_f(){
      console.log("import_f")
      this.$refs.file_ref.click();
    },
    read_f(){
      var selectedFile = this.$refs.file_ref.files[0];
      this.file=false;
      var name = selectedFile.name; //读取选中文件的文件名
      var size = selectedFile.size; //读取选中文件的大小

      console.log("文件名:" + name + "大小:" + size);
      var reader = new FileReader(); //这是核心,读取操作就是由它完成.
      reader.readAsText(selectedFile); //读取文件的内容,也可以读取文件的URL
      let _this=this;
      this.$nextTick(() => {
        this.file=true;
      })
      reader.onload = function() {
        //当读取完成后回调这个函数,然后此时文件的内容存储到了result中,直接操作即可
        console.log(this.result);
        try {
          let obj=JSON.parse(this.result)
          console.log(obj)
          Storage.Port.import_all(_this.context,obj);
          // _this.context.storage_manager.PortModule_import_2_cur_file(_this.context,obj);
        }catch (e){
          console.log(e)
        }
      }

    },
    right_menu(event,tag,obj){
      this.$refs.right_menu_ref.right_menu(event,tag,obj);
    }
  },
  data() {
    return {
      cursor_mode_select: "",
      file:true,
      context:new AppFunc.Context(this),
      app_ref_getter:new AppFunc.AppRefsGetter()
      // net_manager:null
    };
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;

}
.tool_line {
  margin-bottom: 10px;
}
.note_canvas_border {
  border: 1px solid #000;
  height: calc(100vh - 80px);
}
.note_canvas {
  height: 100%;
}
.review_part{
  height: calc(100vh - 80px);
  overflow-y: hidden;
}
</style>
