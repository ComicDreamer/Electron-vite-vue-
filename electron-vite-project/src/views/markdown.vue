<script>
const marked = require('marked');
import { defineComponent , onBeforeUnmount, reactive} from 'vue'
//引入全局通信eventbus
import eventbus from './eventbus';

export default defineComponent({
  setup() {
    //数据放在reactive或者ref对象中，这样在methods中才可以修改值，否则methods中不可以修改值
    const markdown = reactive({
      content: "<img src=\"./public/logo.svg\" alt=\"alt text\">"
    })

    return{
      markdown,
    }

  },
  methods:{
    // ···args代表传入参数数组
    updateContent(...args){
      //对markdown对象的属性content进行赋值
      this.markdown.content = marked.marked(args[0])
      console.log(this.markdown.content)
    }
  },
  mounted(){
    //监听updateConten消息 执行methods中的updateContent函数
    eventbus.on('updateContent', this.updateContent)

    //在退出窗口后，撤销监听
    onBeforeUnmount(() => {
      eventBus.off('updateContent', this.updateContent)
    })
  }
})

</script>

<template>
    <div class="markdown-body" v-html="markdown.content" ></div>
</template>


<style>
	.markdown-body {
		box-sizing: border-box;
		min-width: 200px;
		max-width: 980px;
		margin: 0 auto;
		padding: 45px;
	}

	@media (max-width: 767px) {
		.markdown-body {
			padding: 15px;
		}
	}
</style>