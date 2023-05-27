import  {createApp} from 'vue'

import loginvue from './Login.vue'

//引入element-plus
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css'

createApp(loginvue)
    .use(ElementPlus)
    .mount('#login')
    .$nextTick(() => {
        postMessage({ payload: 'removeLoading' }, '*')
      })
// 如果不加 TypeScript 将您的代码视为全局脚本，而不是模块
// export{}