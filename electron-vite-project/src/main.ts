import { VueElement, createApp } from 'vue'
// import "./style.css"
// import App from './App.vue'
import markdown from './views/markdown.vue';
import noteInputVue from './views/note-input.vue';
import './samples/node-api'
//引入element-plus
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css'


//将markdown.vue组件注入到id为note-output的div中
createApp(markdown)
  .mount('#note-output')
  .$nextTick(() => {
    postMessage({ payload: 'removeLoading' }, '*')
  })

//将noteInputVue.vue组件注入到id为note-input的div中 
createApp(noteInputVue)
  .use(ElementPlus)
  .mount('#note-input')    
  .$nextTick(() => {
    postMessage({ payload: 'removeLoading' }, '*')
  })
