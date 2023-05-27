import  {createApp} from 'vue'

import sidebar from './Sidebar.vue'
import search from './search.vue'

//引入element-plus
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css'


createApp(sidebar)
    .use(ElementPlus)
    .mount('#sidebar')
    .$nextTick(() => {
        postMessage({ payload: 'removeLoading' }, '*')
      })
   
createApp(search)
    .use(ElementPlus)
    .mount('#search')
    .$nextTick(() => {
        postMessage({ payload: 'removeLoading' }, '*')
    })
