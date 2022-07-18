<template>
  <div class="note_canvas" @contextmenu.prevent>
    <!-- @contextmenu.prevent 去除右键菜单 -->
    <EditorTool
        class="editor_tool"
        ref="editor_tool_ref"
        :p_canvasdr="data_reacher"
    />
    <NoteCanvasSearchBar class="canvas_relative canvas_right"
                         v-model:note_canvas_datareacher="data_reacher"
    />
    <div
        class="range noselect"
        ref="range_ref"
        @mousedown="handle_mouse_down_on_range"
        @mouseup="handle_mouse_up"
        :style="content_manager.user_interact.scaler.interval!==0?{
          overflow:'hidden1'
        }:{}"
    >

      <div
          ref="content_padding_ref"
          class="content_padding"
          :style="{
      padding:
            edge_size_h + padding_add_up * scale +
            'px ' +
            (edge_size_w + padding_add_right * scale + 300 * (scale)) +
            'px ' +
            (edge_size_h + padding_add_down * scale + 400 * (scale - 1)) +
            'px ' +
            (edge_size_w + padding_add_left * scale) +
            'px',
        }"
          @mousedown="content_manager.user_interact.event_mousedown_bg"
      >
        <div
            ref="content_ref"
            class="content"
            :style="{
            transform: 'translate('+
             ((0) +scale_offx)+'px,'+
            ((0) +scale_offy)+'px) '
              +'scale(' + scale + ') ' }"
        >

          <div
              class="content_chunk_range"
              :style="{
              right: -padding_add_right + 'px',
              left: -padding_add_left + 'px',
              top: -padding_add_up + 'px',
              bottom: -padding_add_down + 'px',
            }"
          ></div>

          <Path
              v-for="(item, i) in paths"
              :key="i"

              :path_opacity="path_opacity"
              :path="item"

              @pathmouse="handle_pathmouse"
              class="path"
          ></Path>
          <!--          <svg-->
          <!--              v-for="(item, i) in paths"-->
          <!--              :key="i"-->
          <!--              class="path"-->
          <!--              version="1.1"-->
          <!--              :height="item.h"-->
          <!--              :width="item.w"-->
          <!--              :style="{ top: item.oy+(item.by+item.ey)/2 + 'px', left: item.ox+(item.bx+item.ex)/2 + 'px' ,-->
          <!--                opacity:path_opacity-->
          <!--              }"-->
          <!--          >-->
          <!--            <path-->
          <!--                :d="-->
          <!--                'M ' + item.bx + ' ' + item.by + ' L ' + item.ex + ' ' + item.ey-->
          <!--              "-->
          <!--                stroke="black"-->
          <!--                stroke-width="2"-->
          <!--                fill="none"-->
          <!--            ></path>-->
          <!--          </svg>-->
          <svg
              v-if="connecting_path"
              class="path"
              version="1.1"
              :height="connecting_path.h"
              :width="connecting_path.w"
              :style="{
              top: connecting_path.oy + 'px',
              left: connecting_path.ox + 'px',
            }"
          >
            <path
                :d="
                'M ' +
                connecting_path.bx +
                ' ' +
                connecting_path.by +
                ' L ' +
                connecting_path.ex +
                ' ' +
                connecting_path.ey
              "
                stroke="blue"
                stroke-width="2"
                fill="none"
            ></path>
          </svg>
          <!--          <EditorBar/>-->
          <EditorBarMove
              v-for="(item, i) in editor_bars"
              :key="i"
              :ebid="i"
              :editing_ebid="editor_bar_manager.editing_ebid"
              :toolbar_on="content_manager.user_interact.editortool_state.show"
              :search_ing="content_manager.search_in_canvas.searching"
              :search_tar="i in content_manager.search_in_canvas.searched_bars"
              :selected="i in editor_bar_manager.focused_ebids"
              :notehandle="content_manager.notehandle"
              v-model:editor_bar_manager="editor_bar_manager"

              v-show="content_manager.reviewing_state.card_id===''||
                (!content_manager.reviewing_state.show_answer&&i in content_manager.reviewing_state.front_linked_note_ids)||
                content_manager.reviewing_state.show_answer
              "

              :width="item.width"
              :height="item.height"
              :content="item.content"
              :style="{ top: item.pos_y + 'px', left: item.pos_x + 'px' }"

              class="editor_bar_move"

              @content_change="editor_bar_content_change"
              @ebmousedown="editor_bar_mousedown"
              @drag_release="editor_bar_drag_release"
              @switch_mode="editor_bar_switch_mode"
              @corner_drag_start="editor_bar_corner_drag_start"
              @right_menu="editor_bar_right_menu"
              @copy="editor_bar_copy_lside"
          />

          <PathJumpBtn v-if="content_manager.user_interact.pathjumpbtn_state
                             &&content_manager.user_interact.scaler.interval===0
                        "
                       :state="content_manager.user_interact.pathjumpbtn_state"
                       :notehandle="content_manager.notehandle"
                       @jump="path_jump"
                       @hide="content_manager.user_interact.hide_pathjumpbtn()"
          >
          </PathJumpBtn>
          <NoteCanvasSelectRange class="select_range" ref="select_range"/>
        </div>
      </div>

    </div>

    <div class="info">
      scroll_enabled:{{ scroll_enabled }}, scale: {{ scale }},
      <!--      {{'translate('+scale_offx+'px,'+scale_offy+'px)'}}, -->
      dragging:
      {{ canvas_mouse_drag_helper ? canvas_mouse_drag_helper.dragging : false }},
      <!--      {{moving_obj?"moving_obj":"no moving_obj"}},-->
      searching:{{ this.content_manager.search_in_canvas.searching }},
      {{ this.content_manager.search_in_canvas.search_time }},
      {{ this.content_manager.search_in_canvas.ui_match_case }},
      {{ this.content_manager.search_in_canvas.ui_keyword_any_or_each }}
    </div>
  </div>
</template>

<script>
// import EditorBar from "./EditorBar.vue";

import ElementResizeDetectorMaker from "element-resize-detector";
import EditorBarMove from "./editor_bar/EditorBarMoveTest.vue";
import EditorTool from "@/components/EditorTool";
import NoteCanvasSearchBar from "@/components/NoteCanvasSearchBar"
// import SelectRange from "@/3rd/pa_comps/SelectRange"

import NoteCanvasFunc from "./NoteCanvasFunc.js";
import EditorToolFunc from "@/components/EditorToolFunc";
// import EditorBarFunc from "@/components/EditorBarFunc";
// import RightMenuFunc from "@/components/RightMenuFunc";
import {NoteCanvasTs} from "@/components/NoteCanvasTs";
// import {_PaUtilTs} from "@/3rd/pa_util_ts";
// import {RightMenuFuncTs} from "@/components/RightMenuFuncTs";
import {EditorBarTs} from "@/components/editor_bar/EditorBarTs";
import NoteCanvasSelectRange from "@/components/NoteCanvasSelectRange";
import {AppFuncTs} from "@/AppFunc";
import Path from "@/components/Path";
import PathJumpBtn from "@/components/PathJumpBtn";


export default {
  name: "NoteCanvas",
  components: {
    // eslint-disable-next-line vue/no-unused-components
    PathJumpBtn,
    // eslint-disable-next-line vue/no-unused-components
    Path,
    NoteCanvasSelectRange,
    // EditorBar,
    // eslint-disable-next-line vue/no-unused-components
    EditorBarMove,
    EditorTool,
    NoteCanvasSearchBar,
  },
  watch: {
    cursor_mode(val) {
      console.log("mode select", val);
    },
    // editing_editor_bar_id(val){
    //   if(_PaUtilTs._JudgeType.is_number(val)){
    //     this.editing_editor_bar_id=val.toString()
    //   }
    // }
  },
  computed: {
    path_opacity() {
      if (this.content_manager.search_in_canvas.searching) {
        return "30%"
      } else {
        return "100%"
      }
    },
    connecting_path() {
      return this.content_manager.user_interact.line_connect_helper.connecting_path
    }
  },
  created() {
    this.context = AppFuncTs.appctx
    this.data_reacher = new NoteCanvasTs.NoteCanvasDataReacher(this)
    this.content_manager = new NoteCanvasTs.ContentManager(this)
  },
  unmounted() {
    window.removeEventListener("keyup", this.handle_key_up);
    window.removeEventListener("keydown", this.handle_key_down);

    window.removeEventListener("mousewheel", this.handle_scroll);
    window.removeEventListener("mouseup", this.handle_mouse_up);
    window.removeEventListener("mousemove", this.handle_mouse_move);

    this.content_manager.canvas_unmount()
  },
  mounted() {
    // this.$emit("get_context",this);

    // this.chunk_helper ;
    this.storage = new NoteCanvasFunc.Storage(this)
    // this.editor_bar_manager=new EditorBarTs.EditorBarManager(this)
    this.mouse_recorder = NoteCanvasFunc.new_mouse_recorder();
    this.canvas_mouse_drag_helper = new NoteCanvasFunc.CanvasMouseDragHelper();
    this.content_manager.search_in_canvas.init_refs(this.editor_bars, this.editor_bar_manager)

    // this.storage.load_all();
    // this.editor_bar_manager.add_if_no()

    // this.paths.push(new NoteCanvasFunc.PathStruct().set_pos(100, 0, 0, 100));
    // this.paths.push(new NoteCanvasFunc.PathStruct().set_pos(0, 0, 150, 100));

    window.addEventListener("keyup", this.handle_key_up);
    window.addEventListener("keydown", this.handle_key_down);

    window.addEventListener("mousewheel", this.handle_scroll);
    window.addEventListener("mouseup", this.handle_mouse_up);
    window.addEventListener("mousemove", this.handle_mouse_move);

    this.$refs.range_ref.addEventListener("scroll", this.handle_scroll_bar);
    this.$refs.range_ref.addEventListener(
        "mousewheel",
        this.handle_range_scroll
    );

    this.$refs.select_range.init(this.data_reacher, this.content_manager.user_interact.select_range_down_check_ok)

    let _this = this;
    let erd = ElementResizeDetectorMaker();

    erd.listenTo(this.$refs.range_ref, function (element) {
      var width = element.offsetWidth;
      var height = element.offsetHeight;
      console.log("Size: " + width + "x" + height);
      //根据画布区域大小计算白边尺寸

      if (width > 100) {
        _this.edge_size_w = width - 80;
      } else {
        _this.edge_size_w = width;
      }
      if (height > 100) {
        _this.edge_size_h = height - 80;
      } else {
        _this.edge_size_h = height;
      }
    });
  },
  data() {
    return {
      //context ref
      data_reacher: null,
      context: AppFuncTs.Context.getfakeone(),

      //界面效果相关
      scroll_enabled: false,
      scale: 1,
      scale_offx: 0,
      scale_offy: 0,
      scale_step: 0.14,
      edge_size_w: 100,
      edge_size_h: 100,

      //note chunk边界计算值
      padding_add_up: 0,
      padding_add_down: 0,
      padding_add_left: 0,
      padding_add_right: 0,
      //   record_content_rect: null, //for moving

      //data to save->
      editor_bars: {},
      next_editor_bar_id: 1000,
      paths: {},

      //manage data
      content_manager: null,

      //区块管理
      chunk_helper: null,
      // non_empty_chunks: {
      //   "0,0": 0,
      // },

      //交互相关
      canvas_mouse_drag_helper: null,
      mouse_recorder: null,
      moving_obj: null,

      //文本块编辑
      editing_editor_bar: null,
      editing_editor_bar_id: "-1",
      editor_bar_manager: new EditorBarTs.EditorBarManager(this),
      editor_tool_helper: new EditorToolFunc.EditorToolHelper(),

      //存储
      storage: null,

      state_ts: new NoteCanvasTs.NoteCanvasStateTs()
    };
  },
  methods: {

    path_jump(a, b) {
      this.content_manager.user_interact.pathjump(a, b)

    },
    // set_context(ctx){
    //
    //   // console.log(this,this.note)
    //   this.context=ctx;
    //   // this..pub_note_list_mounted(ctx,this);
    // },

    editor_bar_right_menu(event, tag, obj) {
      this.content_manager.user_interact.open_right_menu_eb(event, tag, obj)
      // RightMenuFuncTs.continue_emit(event,tag,obj,this);
    },
    // editor_tool_change_is_show(is_show) {
    //   this.editor_tool_helper.switch_tool_bar(this, is_show)
    // },
    // choose_tool(args) {
    //   this.editor_tool_helper.choose_tool(this, args)
    // },
    // try_switch_tool_bar_state() {
    //   // this.editor_tool_helper.
    //   if (this.editing_editor_bar) {
    //     this.$refs.editor_tool_ref.switch_show_tool_bar(
    //         this,
    //         this.editing_editor_bar
    //     );
    //   }
    // },
    // add_editor_bar() {
    //   this.editor_bar_manager.add_editor_bar_in_center(this);
    // },
    // update_moving_obj_pos() {
    //   this.drag_bar_helper.update_moving_obj_pos(this);
    // },
    handle_scroll_bar(event) {
      this.content_manager.user_interact.event_canvas_move(true, event)
    },
    handle_range_scroll(event) {
      this.content_manager.user_interact.event_rangescroll(event)
    },
    handle_key_up(val) {
      this.content_manager.user_interact
          .keyman.event_keyup(val)
    },
    handle_key_down(val) {
      this.content_manager.user_interact
          .keyman.event_keydown(val)
    },
    handle_scroll(val) {
      //   console.log("handle_scroll", val);
      this.content_manager.user_interact.event_mousescroll(val)
    },
    handle_mouse_down_on_range(event) {
      this.content_manager.user_interact.event_mousedown_range(event)

    },
    handle_mouse_move(val) {
      // if (val.buttons != 0) {
      this.content_manager.user_interact.event_mouse_move(val)

      // }
    },
    handle_mouse_up(event) {
      this.content_manager.user_interact.event_mouse_up(event)
    },
    handle_pathmouse(event, path) {
      this.content_manager.user_interact.event_pathmouse(event, path)
    },
    get_canvas_client_pos() {
      let r = this.$refs.range_ref.getBoundingClientRect();
      return {
        y: r.top, //- this.$refs.range_ref.scrollTop,
        x: r.left, // - this.$refs.range_ref.scrollLeft,
      };
    },
    scale_canvas(dir, event) {
      let scale_bak = this.scale;
      if (Math.abs(scale_bak - 0.1) < 0.0001 ||
          Math.abs(scale_bak - 3) < 0.0001
      ) {
        return
      }
      if (dir > 0) {
        scale_bak += this.scale_step;
        if (scale_bak > 3) {
          scale_bak = 3
        }
      } else {
        scale_bak -= this.scale_step;
        if (scale_bak < 0.1) {
          scale_bak = 0.1
        }
      }

      if (scale_bak < 3 && scale_bak > 0.1) {
        this.content_manager.user_interact.scaler.set_tar_scale(scale_bak, event)
        // NoteCanvasTs.UiOperation.final_set_scale(this,scale_bak,event)
        // this.final_set_scale(scale_bak);
      }

    },
    // final_set_scale(scale) {
    //
    //   this.scale = scale;
    //   // this.canvas_drawer.draw(this);
    // },
    // change_padding(u, d, r, l) {
    //
    // },

    //区域原点的client坐标
    get_content_origin_pos() {
      // console.log("get_content_origin_pos",this,this.$refs.range_ref)
      let range_rec = this.$refs.range_ref.getBoundingClientRect();
      let pos = {
        x:
            range_rec.left -
            this.$refs.range_ref.scrollLeft +
            this.edge_size_w +
            this.padding_add_left * this.scale,
        y:
            range_rec.top -
            this.$refs.range_ref.scrollTop +
            this.edge_size_h +
            this.padding_add_up * this.scale,
      };

      return pos;
    },
    editor_bar_copy_lside(editorbar) {
      this.editor_bar_manager.copy_editor_bar_left_side(this, editorbar.ebid)
    },
    editor_bar_corner_drag_start(a) {
      if (this.content_manager.linkBarToListView.is_linking) {
        return;
      }
      this.editor_bar_manager.corner_drag_start(a)
    },
    editor_bar_switch_mode(eb) {
      // if(this.content_manager.linkBarToListView.is_linking){
      //   return;
      // }
      this.editor_bar_manager.editmode_switch(
          EditorBarTs.EditorBarCompProxy.create(eb))
      // EditorBarFunc.editor_bar_switch_mode(this, eb);
    },
    editor_bar_drag_release(event, bar) {
      this.content_manager.user_interact.event_mouse_up_on_eb(event, bar)
    },
    editor_bar_content_change(ebid, content) {
      //判断是否刚刚加载笔记
      NoteCanvasTs.NoteCanvasDataReacher.create(this).get_content_manager()
          .notehandle.ebman().withlog_eb_edit(ebid, content)
      // this.content_manager.
      // if(this.content_manager.linkBarToListView.is_linking){
      //   return;
      // }
      // this.editor_bar_manager.content_change(ebid,content);
    },
    editor_bar_mousedown(event, eb) {
      this.content_manager.user_interact.event_mousedown_eb(event, eb);
    },
  },
  props: {
    cursor_mode: String,
  },
};
</script>

<style scoped>
.editor_tool {
  z-index: 400;
}

.info {
  float: left;
}

.range {
  height: 100%;
  overflow: scroll;

}

.content {
  /*background-color: rgb(255, 200, 200);*/
  height: 400px;
  width: 300px;
  transform-origin: 0 0 0;
}

.editor_bar_move {
  position: absolute;
}

.content_chunk_range {
  position: absolute;
  border: 1px solid #000;
}

#canvas {
  /* height: 100%; */
  /* width: 100%; */
  position: absolute;
  top: 0;
  left: 0;
  width: 100px;
  height: 100px;
}

.path {
  position: absolute;
  top: 0;
  left: 0;
}

.noselect {

  -webkit-touch-callout: none; /* iOS Safari */

  -webkit-user-select: none; /* Chrome/Safari/Opera */

  -khtml-user-select: none; /* Konqueror */

  -moz-user-select: none; /* Firefox */

  -ms-user-select: none; /* Internet Explorer/Edge */

  user-select: none;
  /* Non-prefixed version, currently

 not supported by any browser */

}

.canvas_relative {
  position: absolute;

}

.canvas_right {
  right: 25px;
  top: 10px;
}

.note_canvas {
  position: relative;
}
</style>