<template>
  <div class="note_canvas" @contextmenu.prevent>
    <!-- @contextmenu.prevent 去除右键菜单 -->
    <EditorTool
        ref="editor_tool_ref"
        @change_is_show="editor_tool_change_is_show"
        @choose_tool="choose_tool"
    />
    <div
        class="range noselect"
        ref="range_ref"
        @mousedown="handle_mouse_down_on_range"
        @mouseup="handle_mouse_up"
    >
      <div
          ref="content_padding_ref"
          class="content_padding"
          :style="{
          padding:
            edge_size_h +
            padding_add_up * scale +
            'px ' +
            (edge_size_w + padding_add_right * scale + 300 * (scale - 1)) +
            'px ' +
            (edge_size_h + padding_add_down * scale + 400 * (scale - 1)) +
            'px ' +
            (edge_size_w + padding_add_left * scale) +
            'px',
        }"
      >
        <div
            ref="content_ref"
            class="content"
            :style="{
            transform: 'scale(' + scale + ')',
          }"
        >
          <svg
              v-for="(item, i) in paths"
              :key="i"
              class="path"
              version="1.1"
              :height="item.h"
              :width="item.w"
              :style="{ top: item.oy + 'px', left: item.ox + 'px' }"
          >
            <path
                :d="
                'M ' + item.bx + ' ' + item.by + ' L ' + item.ex + ' ' + item.ey
              "
                stroke="black"
                stroke-width="2"
                fill="none"
            ></path>
          </svg>
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
          <div
              class="content_chunk_range"
              :style="{
              right: -padding_add_right + 'px',
              left: -padding_add_left + 'px',
              top: -padding_add_up + 'px',
              bottom: -padding_add_down + 'px',
            }"
          ></div>
<!--          <EditorBar/>-->
          <EditorBarMove
              v-for="(item, i) in editor_bars"
              :key="i"
              :ebid="i"
              :editing_ebid="editing_editor_bar_id"
              :toolbar_on="editor_tool_helper.tool_bar_on"

              :width="item.width"
              :height="item.height"
              :content="item.content"
              :style="{ top: item.pos_y + 'px', left: item.pos_x + 'px' }"

              class="editor_bar_move"

              @content_change="editor_bar_content_change"
              @left_click="editor_bar_left_click"
              @drag_release="editor_bar_drag_release"
              @switch_mode="editor_bar_switch_mode"
              @corner_drag_start="editor_bar_corner_drag_start"
              @right_menu="right_menu"
              @delete="editor_bar_delete"
          />
        </div>
      </div>
    </div>
    <div class="info">
      scroll_enabled:{{ scroll_enabled }}, scale: {{ scale }}, dragging:
      {{ canvas_mouse_drag_helper ? canvas_mouse_drag_helper.dragging : false }}
    </div>
  </div>
</template>

<script>
import ElementResizeDetectorMaker from "element-resize-detector";
// import EditorBar from "./EditorBar.vue";
import EditorBarMove from "./EditorBarMoveTest.vue";
import NoteCanvasFunc from "./NoteCanvasFunc.js";
import EditorTool from "@/components/EditorTool";
import EditorToolFunc from "@/components/EditorToolFunc";
import EditorBarFunc from "@/components/EditorBarFunc";
import RightMenuFunc from "@/components/RightMenuFunc";
import {NoteCanvasTs} from "@/components/NoteCanvasTs";



export default {
  name: "NoteCanvas",
  components: {
    // EditorBar,
    // eslint-disable-next-line vue/no-unused-components
    EditorBarMove,
    EditorTool,
  },
  watch: {
    cursor_mode(val) {
      console.log("mode select", val);
    },
  },
  computed:{
  },
  mounted() {
    this.$emit("get_context",this);

    this.chunk_helper = NoteCanvasFunc.new_chunk_helper();
    this.storage=new NoteCanvasFunc.Storage(this)
    this.editor_bar_manager=new EditorBarFunc.EditorBarManager(this)
    this.mouse_recorder = NoteCanvasFunc.new_mouse_recorder();
    this.canvas_mouse_drag_helper = new NoteCanvasFunc.CanvasMouseDragHelper();

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
      context:null,

      scroll_enabled: false,
      scale: 1,
      scale_step: 0.1,
      edge_size_w: 100,
      edge_size_h: 100,

      padding_add_up: 0,
      padding_add_down: 0,
      padding_add_left: 0,
      padding_add_right: 0,

      moving_obj: null,
      //   record_content_rect: null, //for moving
      editor_bars: {},
      next_editor_bar_id:1000,
      mouse_recorder: null,

      chunk_helper: null,
      non_empty_chunks: {
        "0,0": 0,
      },
      canvas_mouse_drag_helper: null,
      paths: {},
      connecting_path: null,

      editing_editor_bar: null,
      editing_editor_bar_id: -1,
      editor_bar_manager: null,

      editor_tool_helper: new EditorToolFunc.EditorToolHelper,

      storage:null,
      drag_bar_helper:new NoteCanvasFunc.DragBarHelper,

      line_connect_helper:new NoteCanvasFunc.LineConnectHelper,
      content_manager:new NoteCanvasFunc.ContentManager,
      state_ts:new NoteCanvasTs.NoteCanvasStateTs()
    };
  },
  methods: {
    set_context(ctx){
      // console.log(this,this.note)
      this.context=ctx;
      // this..pub_note_list_mounted(ctx,this);
    },

    right_menu(event,tag,obj){
      RightMenuFunc.continue_emit(event,tag,obj,this);
    },
    editor_tool_change_is_show(is_show) {
      this.editor_tool_helper.switch_tool_bar(this, is_show)
    },
    choose_tool(args) {
      this.editor_tool_helper.choose_tool(this, args)
    },
    try_switch_tool_bar_state() {
      // this.editor_tool_helper.
      if (this.editing_editor_bar) {
        this.$refs.editor_tool_ref.switch_show_tool_bar(
            this,
            this.editing_editor_bar
        );
      }
    },
    add_editor_bar() {
      this.editor_bar_manager.add_editor_bar_in_center(this);
    },
    update_moving_obj_pos() {
      this.drag_bar_helper.update_moving_obj_pos(this);
    },
    handle_scroll_bar(event) {
      if (
          this.moving_obj
          //   && this.record_content_rect != null
      ) {
        console.log("handle_scroll_bar",this.moving_obj,event);
        this.update_moving_obj_pos();
      }
    },
    handle_range_scroll(event) {
      //缩放模式下，阻止原生滚动事件
      if (this.scroll_enabled) {
        event.preventDefault();
      }
    },
    handle_key_up(val) {
      if (val.key === "b") {
        console.log("handle_key_up", val);
        this.scroll_enabled = false;
      }
    },
    handle_key_down(val) {
      if (val.key === "b"&&val.ctrlKey) {
        console.log("handle_key_down", val);
        this.scroll_enabled = true;
      }
      if (val.key === "/") {
        this.try_switch_tool_bar_state();
      }
    },
    handle_scroll(val) {
      //   console.log("handle_scroll", val);
      if (this.scroll_enabled) {
        this.scale_canvas(val.deltaY);
      }
    },
    handle_mouse_down_on_range(event) {
      //   let cp = this.get_canvas_client_pos();
      this.mouse_recorder.call_before_move(
          event.clientX, // + cp.x,
          event.clientY //+ cp.y
          //   event.screenX, event.screenY
      );
      console.log("note canvase mouse down");
      //   this.dragging = true;
      this.canvas_mouse_drag_helper.start_drag_canvas();
    },
    handle_mouse_move(val) {
      if (val.buttons != 0) {
        //有按键按下
        // let cp = this.get_canvas_client_pos();
        this.mouse_recorder.update_pos_on_move(
            val.clientX, //+ cp.x,
            val.clientY //+ cp.y
            //   event.screenX, event.screenY
        );
        // let delta = this.mouse_recorder.get_delta();

        //拖拽画布
        this.canvas_mouse_drag_helper.on_drag(this, val);



        //拖拽文本块
        if (this.moving_obj != null) {
          this.update_moving_obj_pos();
          //   let bar_data = this.editor_bars[this.moving_obj.ebid];

          //   this.editor_bar_set_new_pos(
          //     bar_data,
          //     bar_data.pos_x + delta.dx / this.scale,
          //     bar_data.pos_y + delta.dy / this.scale
          //   );
          //   console.log("bar_data", bar_data);
        }else{
          //编辑器拖拽相关
          this.editor_bar_manager.on_mouse_move(event,
              this.mouse_recorder)
        }
        if (this.connecting_path != null) {
          this.line_connect_helper.move_connect(
              NoteCanvasFunc,
              this,
              val.clientX,
              val.clientY
          );
        }
      }
    },
    handle_mouse_up(event) {
      //   this.dragging = false;
      console.log("handle_mouse_up")

      this.drag_bar_helper.end_drag(this.context,this);
      this.canvas_mouse_drag_helper.end_drag_canvas(event);
      if (this.connecting_path) {
        this.connecting_path = null;
      }
      this.editor_bar_manager.on_mouse_up();
    },
    get_canvas_client_pos() {
      let r = this.$refs.range_ref.getBoundingClientRect();
      return {
        y: r.top, //- this.$refs.range_ref.scrollTop,
        x: r.left, // - this.$refs.range_ref.scrollLeft,
      };
    },
    scale_canvas(dir) {
      let scale_bak = this.scale;
      if (dir > 0) {
        scale_bak += this.scale_step;
      } else {
        scale_bak -= this.scale_step;
      }
      if (scale_bak < 3 && scale_bak > 0.1) {
        this.final_set_scale(scale_bak);
      }
      if (this.moving_obj) {
        this.update_moving_obj_pos();
      }
    },
    final_set_scale(scale) {
      this.scale = scale;
      this.canvas_drawer.draw(this);
    },
    change_padding(u, d, r, l) {
      console.log("change padding", u, d, r, l);
      let dl = l - this.padding_add_left;
      let dh = u - this.padding_add_up;

      this.padding_add_up = u;
      this.padding_add_down = d;
      this.padding_add_right = r;
      this.padding_add_left = l;

      if (dl != 0) {
        console.log("dr", this.$refs.range_ref.scrollLeft, dl);
        this.$refs.range_ref.scrollLeft += dl * this.scale;
      }

      //   console.log(u, this.padding_add_up);
      //   console.log(l, this.padding_add_left);
      if (dh != 0) {
        console.log("dh", this.$refs.range_ref.scrollTop, dh);
        this.$refs.range_ref.scrollTop += dh * this.scale;
      }
    },

    //区域原点的client坐标
    get_content_origin_pos() {
      console.log("get_content_origin_pos",this,this.$refs.range_ref)
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
    editor_bar_delete(editor_bar){
      if(this.content_manager.linkBarToListView.is_linking){
        return;
      }
      this.editor_bar_manager.delete_one(editor_bar)
    },
    editor_bar_corner_drag_start(a){
      if(this.content_manager.linkBarToListView.is_linking){
        return;
      }
      this.editor_bar_manager.corner_drag_start(a)
    },
    editor_bar_switch_mode(eb) {
      if(this.content_manager.linkBarToListView.is_linking){
        return;
      }
      EditorBarFunc.editor_bar_switch_mode(this, eb);
    },
    editor_bar_drag_release(event, bar) {
      if (event && this.connecting_path) {
        let bar_data = this.editor_bars[bar.ebid];
        this.line_connect_helper.end_connect(
            this,
            bar_data.pos_x,
            bar_data.pos_y,
            bar.ebid
        );
      }
    },
    editor_bar_set_new_pos(ebid, eb, x, y) {
      if(this.content_manager.linkBarToListView.is_linking){
        return;
      }
      this.editor_bar_manager.set_new_pos(ebid,eb,x,y);
      //   let ebw = 100;
      //   let ebh = 100;
      //超出原有范围需要重新设置背景面板的size
    },
    editor_bar_content_change(ebid,content){
      if(this.content_manager.linkBarToListView.is_linking){
        return;
      }
      this.editor_bar_manager.content_change(ebid,content);
    },
    editor_bar_left_click(event, eb) {
      if(this.content_manager.linkBarToListView.is_linking){
        this.content_manager.linkBarToListView.link_canvas_bar(this,eb)
        return;
      }
      //   console.log(eb);
      //   let cp = this.get_canvas_client_pos();
      this.drag_bar_helper.start_drag(NoteCanvasFunc,this,
        event,eb
      )

      //   this.record_content_rect = this.$refs.content_ref.getBoundingClientRect();
    },
  },
  props: {
    cursor_mode: String,
  },
};
</script>

<style scoped>
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

  user-select: none; /* Non-prefixed version, currently

not supported by any browser */

}
</style>