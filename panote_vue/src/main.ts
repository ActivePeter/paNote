import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import {ipcRenderer} from "electron";

// import { QuillEditor } from '@vueup/vue-quill'
// import '@vueup/vue-quill/dist/vue-quill.snow.css';
// global
// import { quillEditor } from 'vue3-quill'
// import toolbar from 'toolbar'
// Quill.register('modules/toolbar', toolbar)

// Create the Application's main menu


const app = createApp(App)
app
    .use(ElementPlus)
    // .component('QuillEditor', QuillEditor)
    .mount('#app')
