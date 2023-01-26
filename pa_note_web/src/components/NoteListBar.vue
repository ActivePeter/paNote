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
      {{ name }}
      <span>
        <el-tooltip
            v-if=" 'new_edit' in data && data['new_edit']"

            class="box-item"
            effect="light"
            :content="'bind_file' in data?'数据变更即将同步至文件':'数据变更即将同步至缓存'"
            placement="right-start"
        >
          <el-icon color="#409EFC" class="is-loading">
            <Loading/>
          </el-icon>
        </el-tooltip>
        <el-tooltip
            v-else

            class="box-item"
            effect="light"
            :content="'bind_file' in data?'数据已同步至文件':'数据已同步至缓存'"
            placement="right-start"
        >

          <el-icon color="#409EFC">
            <Finished/>
          </el-icon>
        </el-tooltip>
        <el-tooltip
            v-if="'bind_file' in data"
            effect="light"
            content="已绑定到文件"
            placement="right-start"
        >
        <el-icon color="#">
            <Link/>
          </el-icon>
        </el-tooltip>
      </span>
    </div>
  </div>

</template>

<script>
import NoteListFunc from "@/components/NoteListFunc";
// import RightMenuFunc from "@/components/RightMenuFunc";
import ClickDetector from "@/components/ClickDetector";
import {Loading, Finished,Link} from "@element-plus/icons-vue";
import {NoteListBarTs} from "@/components/NoteListBarTs";
import {AppFuncTs} from "@/logic/app_func";

export default {
  name: "NoteListBar",
  components: {
    Loading,
    Finished,
    Link
  },
  mounted() {
    window.addEventListener("keydown", this.handle_key_down);
  },
  unmounted() {
    window.removeEventListener("keydown", this.handle_key_down);
  },
  data() {
    return {
      editing: false,
      editing_name: "",
      note_list_bar_helper: new NoteListFunc.NoteListBarHelper(),
      click_detector: new ClickDetector.ClickDetector(),
    };
  },
  computed: {
    style() {
      if (this.id === this.open_id) {
        return {
          background: "#ebf4fd"
        }
      } else {
        return {}
      }
    }
  },
  methods: {
    handle_key_down(event) {
      if (event.key === 'Enter') {
        this.finish_edit();
      }
    },
    finish_edit() {
      if (this.editing) {
        this.editing = false;
        this.$emit("change_name", this);
      }
    },
    start_edit() {
      this.editing_name = this.name;
      this.editing = true;
      this.$nextTick(() => {
        this.$refs.input_ref.focus();
      })
    },
    handle_mouse_down(event) {
      NoteListBarTs.handle_mouse_down(this,event)
    },
    open_note(){
      // console.log("open")
      AppFuncTs.get_ctx().start_open_note(this.id)
    }
  },
  props: {
    name: String,
    id: String,
    open_id: String,
    data: Object
  },
};
</script>

<style scoped>
.notelist_bar {
  padding: 10px;
  text-align: left;
  border-radius: 4px;
}

.notelist_bar:hover {
  background: #ebf4fd;
}

.input {
  border-style: none;
  border-width: 0;
  outline: 0;
  background: rgba(0, 0, 0, 0);
  font-size: 100%;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>