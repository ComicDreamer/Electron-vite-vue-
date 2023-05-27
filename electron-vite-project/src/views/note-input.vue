<script>
    import eventbus from './eventbus';
    import { defineComponent, ref, onMounted, watch } from 'vue'

    //引入quill
    import Quill from 'quill';
    import 'quill/dist/quill.core.css';
    import 'quill/dist/quill.snow.css';
    import 'quill/dist/quill.bubble.css';

    import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html';

    import jsPDF from 'jspdf';
export default defineComponent ({
  //初始化函数
  setup() {
    const editor = ref(null);
    const quill = ref(null);
    const content = ref('![](./public/logo.svg)');

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

    const exportPdf = () => {
      const quills = quill.value;
      if (quills) {
        //获取delta对象
        const delta = quills.getContents();
        //转换成html文件
        const converter = new QuillDeltaToHtmlConverter(delta.ops)
        const html = converter.convert()
        console.log(html)
        //转换成Pdf文件
        const pdf = new jsPDF();
        pdf.html(html, {
          callback: function () {
            pdf.save('document.pdf');
          },
        });
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

    // 在组件挂载后初始化 Quill
    const onMounted = () => {
      initQuill();
      const button = document.getElementById('exportPdf')
      button.addEventListener('click', exportPdf);

    };

    return { editor, content, onMounted, exportPdf};
  },
  //方法
  methods: {
    updateContent(){
      console.log("updateContent")
      //全局发送消息updateContent， 参数是content， 可以发送多个参数，用都好隔开
      eventbus.emit('updateContent', this.content) 
    }
  },
  mounted(){
    this.onMounted();
  }
})
</script>
<template>
  <!--@input绑定输入事件，当输入框中的内容改变时，执行updateContent函数-->
  <div>  
    <el-input
    v-model="content"
    :rows="10"
    type="textarea"
    placeholder="Please input"
    @input="updateContent"
  />
  <!--引用editor 作为quill文本编辑器的容器-->
  <div ref="editor" ></div>
  <button id="exportPdf">Export to PDF</button>
  </div>
</template>