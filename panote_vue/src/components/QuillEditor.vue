<template>
  <section ref="editor"></section>
</template>

<script>
import 'quill/dist/quill.core.css'
import '../assets/quill.snow.css'
// import 'quill/dist/quill.snow.css'
// import 'quill/dist/quill.bubble.css'
import Quill from '../3rd/quill-1.3.7/quill.js'
import { onMounted, ref, watch, onUnmounted, onBeforeUnmount } from 'vue'
const defaultOptions = {
  theme: 'snow',
  boundary: document.body,
  modules: {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ header: 1 }, { header: 2 }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ script: 'sub' }, { script: 'super' }],
      [{ indent: '-1' }, { indent: '+1' }],
      [{ direction: 'rtl' }],
      [{ size: ['small', false, 'large', 'huge'] }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ color: [] }, { background: [] }],
      [{ font: [] }],
      [{ align: [] }],
      ['clean'],
      ['link', 'image', 'video']
    ]
  },
  placeholder: 'Insert content here ...',
  readOnly: false
}
export default {
  name: 'quill-editor',
  props: {
    content: String,
    value: String,
    disabled: {
      type: Boolean,
      default: false
    },
    options: {
      type: Object,
      required: false,
      default: () => ({})
    },
    numid:Number,
    strid:String,
  },
  emits: ['ready', 'change', 'input', 'blur', 'focus', 'update:value','update:value_numid'],
  setup(props, context) {
    const state = {
      editorOption: {},
      quill: null
    }

    let _content = ''
    watch(
        ()=>props.input_able,
        val=>{
          state.quill.inputAble=val;
        }
    )
    watch(
        () => props.value,
        val => {
          if (state.quill) {
            if (val && val !== _content) {
              _content = val
              state.quill.pasteHTML(val)
            } else if (!val) {
              state.quill.setText('')
            }
          }
        }
    )
    watch(
        () => props.content,
        val => {
          if (state.quill) {
            if (val && val !== _content) {
              _content = val
              state.quill.pasteHTML(val)
            } else if (!val) {
              state.quill.setText('')
            }
          }
        }
    )
    watch(
        () => props.disabled,
        val => {
          if (state.quill) {
            state.quill.inputAble=true;
            state.quill.enable(!val)
          }
        }
    )
    const editor = ref(null)
    const mergeOptions = (def, custom) => {
      for (const key in custom) {
        if (!def[key] || key !== 'modules') {
          def[key] = custom[key]
        } else {
          mergeOptions(def[key], custom[key])
        }
      }
      return def
    }
    const initialize = () => {
      if (editor.value) {
        // Options
        state.editorOption = mergeOptions(defaultOptions, props.options)
        state.editorOption.readOnly = props.disabled ? true : false
        // Instance
        state.quill = new Quill(editor.value, state.editorOption)

        // console.log('intilized')
        // Set editor content
        if (props.value) {
          state.quill.pasteHTML(props.value)
        }
        // Mark model as touched if editor lost focus
        state.quill.on('selection-change', (range) => {
          if (!range) {
            context.emit('blur', state.quill)
          } else {
            context.emit('focus', state.quill)
          }
        })
        // Update model if text changes
        state.quill.on('text-change', () => {
          // diabled editor after content initialized
          if (props.disabled) {
            state.quill.enable(false)
          }
          let html = editor.value.children[0].innerHTML
          const quill = state.quill
          const text = state.quill.getText()
          if (html === '<p><br></p>') html = ''
          _content = html

          context.emit('update:value_numid',props.numid,_content);
          context.emit('update:value', _content)
          context.emit('change', { html, text, quill })
        })
        // Emit ready event
        context.emit('ready', state.quill)
      }
    }
    onBeforeUnmount(() => {
      const editorToolbar = editor.value.previousSibling
      if (editorToolbar && editorToolbar.className &&editorToolbar.className.indexOf('ql-toolbar') > -1) {
        editorToolbar.parentNode.removeChild(editorToolbar)
      }
    })
    onMounted(() => {
      initialize()
    })
    onUnmounted(() => {
      state.quill = null
    })
    return {
      editor,
      set_input_able(v){
        if(state.quill){
          state.quill.inputAble=v;
        }
      },
      quill_format(op_type,op_arg){
        state.quill.format(op_type, op_arg, Quill.sources.USER);
      },
      do_operation(op_type,op_arg){
        switch (op_type){
          case 'indent':
          {
            let range = state.quill.getSelection();
            let formats = state.quill.getFormat(range);
            let indent = parseInt(formats.indent || 0);
            // if (formats.direction === 'rtl') modifier *= -1;
            state.quill.format('indent', indent + op_arg, Quill.sources.USER);

          }
            break;
          case 'code':
          {
            let range = state.quill.getSelection();
            let formats = state.quill.getFormat(range);
            // console.log("r,f",range,formats)
            state.quill.formatLine(range, { 'code-block': !formats['code-block'] });
          }
            break;

        }
      }
    }
  }
}
</script>