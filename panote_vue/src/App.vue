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
    </el-row>
  </div>
  <div class="note_canvas_border">
    <NoteCanvas
      class="note_canvas"
      ref="note_canvas_ref"
      :cursor_mode="cursor_mode_select"
    />
  </div>
  <!-- <img alt="Vue logo" src="./assets/logo.png" />
  <HelloWorld msg="Welcome to Your Vue.js App" /> -->
</template>

<script>
// import HelloWorld from "./components/HelloWorld.vue";
import NoteCanvas from "./components/NoteCanvas.vue";

export default {
  name: "App",
  components: {
    // HelloWorld,
    NoteCanvas,
  },
  methods: {
    add_editor_bar() {
      this.$refs.note_canvas_ref.add_editor_bar();
    },
    export_f(){
      this.$refs.note_canvas_ref.storage.export()
    }
  },
  data() {
    return {
      cursor_mode_select: "",
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
