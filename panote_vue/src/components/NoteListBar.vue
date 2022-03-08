<template>
  <div class="notelist_bar"
       :style="style"
    @mousedown="handle_mouse_down"
  >
    <div v-show="editing">
      <input ref="input_ref" class="input" type=text v-model="editing_name"
             @blur="finish_edit"
      >
    </div>
    <div v-show="!editing">
      {{name}}
    </div>
  </div>

</template>

<script>
import NoteListFunc from "@/components/NoteListFunc";
import RightMenuFunc from "@/components/RightMenuFunc";
import ClickDetector from "@/components/ClickDetector";

export default {
  name: "NoteListBar",
  mounted() {
    window.addEventListener("keydown", this.handle_key_down);
  },
  data() {
    return {
      editing:false,
      editing_name:"",
      note_list_bar_helper:new NoteListFunc.NoteListBarHelper(),
      click_detector:new ClickDetector.ClickDetector(),
    };
  },
  computed:{
    style(){
      if(this.id===this.open_id){
        return {
          background: "#ebf4fd"
        }
      }else{
        return{}
      }
    }
  },
  methods: {
    handle_key_down(event){
      if(event.key==='Enter'){
        this.finish_edit();
      }
    },
    finish_edit(){
      if(this.editing){
        this.editing=false;
        this.$emit("change_name",this);
      }
    },
    start_edit(){
      this.editing_name=this.name;
      this.editing=true;
      this.$nextTick(() => {
        this.$refs.input_ref.focus();
      })
    },
    open_note(){
      this.$emit("open_note",this.id);
    },
    handle_mouse_down(){
      let _this=this;
      this.click_detector.click((cnt)=>{
        console.log("click",cnt);
        if(cnt>=2){
          _this.start_edit();
        }else if(cnt==1){
          _this.open_note();
        }
      })
      RightMenuFunc.if_right_click_then_emit(event,"notelist_bar",this);
    }
  },
  props: {
    name:String,
    id:String,
    open_id:String,
  },
};
</script>

<style scoped>
  .notelist_bar{
    padding: 10px;
    text-align: left;
    border-radius: 4px;
  }
  .notelist_bar:hover{
    background: #ebf4fd;
  }
  .input{
    border-style:none;
    border-width: 0;
    outline:0;
    background: rgba(0,0,0,0);
    font-size:100%;
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
</style>