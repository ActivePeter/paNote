<template>
  <div>
    <el-row class="mb-4">
      <el-button round>add note bar</el-button>
    </el-row>
  </div>
  <div class="note_canvas_border">
    <NoteCanvas class="note_canvas" />
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
.note_canvas_border {
  border: 1px solid #000;
  height: calc(80vh);
}
.note_canvas {
  height: 100%;
}
</style>
