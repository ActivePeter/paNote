<template>

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
  <div class="note_canvas_border"

  >
    <NoteCanvas
      class="note_canvas"
      ref="note_canvas_ref"
      :cursor_mode="cursor_mode_select"
      @right_menu="right_menu"
    />
  </div>
  <RightMenu ref="right_menu_ref"/>
  <!-- <img alt="Vue logo" src="./assets/logo.png" />
  <HelloWorld msg="Welcome to Your Vue.js App" /> -->
</template>

<script>
// import HelloWorld from "./components/HelloWorld.vue";
import NoteCanvas from "./components/NoteCanvas.vue";
import RightMenu from "@/components/RightMenu";
export default {
  name: "App",
  components: {
    RightMenu,
    // HelloWorld,
    NoteCanvas,
  },
  methods: {
    add_editor_bar() {
      this.$refs.note_canvas_ref.add_editor_bar();
    },
    export_f(){
      this.$refs.note_canvas_ref.storage.export()
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
          _this.$refs.note_canvas_ref.storage.import_f(obj)
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
  margin-top: 60px;
}
.tool_line {
  margin-bottom: 10px;
}
.note_canvas_border {
  border: 1px solid #000;
  height: calc(80vh);
}
.note_canvas {
  height: 100%;
}
</style>
