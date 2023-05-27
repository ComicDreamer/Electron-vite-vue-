import  {createApp} from 'vue'

import registervue from './register.vue'
//引入element-plus
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css'


createApp(registervue)
    .use(ElementPlus)
    .mount('#register')
    .$nextTick(() => {
        postMessage({ payload: 'removeLoading' }, '*')
      })
   
