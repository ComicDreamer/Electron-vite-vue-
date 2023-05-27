import  {createApp} from 'vue'

import userprofilevue from './Userprofile.vue'
import sidebarvue from './Sidebar.vue'

//引入element-plus
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css'


createApp(userprofilevue)
    .use(ElementPlus)
    .mount('#userprofile')
    .$nextTick(() => {
        postMessage({ payload: 'removeLoading' }, '*')
      })
   
      
createApp(sidebarvue)
.use(ElementPlus)
.mount('#sidebar')
.$nextTick(() => {
    postMessage({ payload: 'removeLoading' }, '*')
  })
