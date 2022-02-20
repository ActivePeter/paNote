import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';


createApp(App)
    .use(ElementPlus)
    .component('QuillEditor', QuillEditor)
    .mount('#app')
