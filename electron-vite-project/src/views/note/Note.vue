<template>
    <div>
          <!--引用editor 作为quill文本编辑器的容器-->
        <div ref="editor" ></div>
            <button id="exportPdf">Export to PDF</button>
            <button @click="save">SAVE</button>
            <button @click="getDelta">GET</button>
    </div>

</template>
<script>
import { defineComponent, reactive, ref} from 'vue'

//引入quill
import Quill from 'quill';
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
const Delta = Quill.import('delta')
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html';
import { ipcRenderer } from 'electron';

export default defineComponent({
  //初始化函数
  setup() {
    const editor = ref(null);
    const quill = ref(null);
    const html = ref(null);

    //监听get-note-response消息
    ipcRenderer.on('get-note-response', (event, data) => {
        console.log('i get note response', data.delta, JSON.parse(data.delta.delta))

        //将delta的json串转换为delta对象
        const obj = JSON.parse(data.delta.delta)
        //将delta对象转换为HTML文件
        const converter = new QuillDeltaToHtmlConverter(obj.ops)
        html.value = converter.convert()
        //初始化quill编辑器的内容
        setHtml()
    })

    // 在editor组件挂载后创建 Quill 实例，并将其绑定到 quill 响应式数据中
    const createQuill = () => {
      console.log("quill created...")
      quill.value = new Quill(editor.value, {
        theme: 'snow',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ 'header': 1 }, { 'header': 2 }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'script': 'sub' }, { 'script': 'super' }],
            [{ 'indent': '-1' }, { 'indent': '+1' }],
            [{ 'direction': 'rtl' }],
            [{ 'size': ['small', false, 'large', 'huge'] }],
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'font': [] }],
            [{ 'align': [] }],
            ['clean'],
          ],
        },
      });    
    };

    // 将quill编辑器内容保存到localStorage
    const save = function(){
      console.log('i send save-note')
      ipcRenderer.send('save-note', {'delta': JSON.stringify(quill.value.getContents())})
    }

    // 导出为Pdf
    const exportPdf = function(){
      const quills = quill.value;
      if (quills) {
        //获取delta对象
        const delta = quills.getContents();
        console.log('current delta == ', delta)
        //转换成html文件
        const converter = new QuillDeltaToHtmlConverter(delta.ops)
        const html = converter.convert()
        console.log(html)
        //转换成Pdf文件

      }
    };

    // 在 editor 元素被挂载后创建 Quill 实例
    const initQuill = () => {
      if (editor.value) {
        createQuill();
      } else {
        setTimeout(initQuill, 10);
      }
    };

    //获取存储的delta
    const getDelta = function(){
      ipcRenderer.send('get-note');
      console.log('i send get-note')
    }

    //更新delta到当前页面
    const update = function(delta){
      quill.value.setContents(delta)
      console.log('current is ', quill.value.getContents)
    }

    // 在组件挂载后初始化 Quill
    const onMounted = () => {
      initQuill();
      const button = document.getElementById('exportPdf')
      button.addEventListener('click', exportPdf);
    };

    //设置之间保存的note内容
    const setHtml = function(){
        //根据DOM选中quill编辑器的部分
        const elements = document.getElementsByClassName('ql-editor');
        console.log('sethtml...', elements)
        const editor = elements[0]
        // 初始化quill编辑器内容
        editor.innerHTML = html.value
    }

    return { editor, onMounted, exportPdf, save, getDelta, update, setHtml};
  },
  mounted(){
    console.log('mounted......')
    this.getDelta();
    this.onMounted();
    this.setHtml();
  },
  
})
</script>