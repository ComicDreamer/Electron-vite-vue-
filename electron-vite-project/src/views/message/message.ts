import  {createApp} from 'vue'

import communicatevue from './Communicate.vue'
import sidebarvue from './Sidebar.vue'

//引入element-plus
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css'

createApp(communicatevue)
    .use(ElementPlus)
    .mount('#communicate')
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