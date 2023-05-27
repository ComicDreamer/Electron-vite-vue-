import  {createApp} from 'vue'

import notevue from './Note.vue'
import filebarvue from './Filebar.vue';
import sidebarvue from './Sidebar.vue';

//引入element-plus
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css'

createApp(notevue)
    .use(ElementPlus)
    .mount('#note')
    .$nextTick(() => {
        postMessage({ payload: 'removeLoading' }, '*')
      })

createApp(filebarvue)
.use(ElementPlus)
.mount('#filebar')
.$nextTick(() => {
    postMessage({ payload: 'removeLoading' }, '*')
  })

createApp(sidebarvue)
.use(ElementPlus)
.mount('#sidebar')
.$nextTick(() => {
    postMessage({ payload: 'removeLoading' }, '*')
  })
// 如果不加 TypeScript 将您的代码视为全局脚本，而不是模块
// export{}