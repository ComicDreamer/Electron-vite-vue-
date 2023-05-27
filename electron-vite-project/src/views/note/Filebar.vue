<template>
    <div>
      <ul>
        <li v-for="(item, index) in fileDir" :key="index">
          <span>{{ item.name }}</span>
          <button v-if="item.type === 'directory'" @click="addFile(item)">添加文件</button>
          <button v-if="item.type === 'directory'" @click="addDir(item)">添加子目录</button>
          <file-bar v-if="item.type === 'directory'" :fileDir="item.children"></file-bar>
        </li>
      </ul>
    </div>
  </template>
  
  <script>
import { isNullOrUndefined } from 'util';
import { defineComponent, reactive, ref } from 'vue';
// 在父组件外部定义变量 原始的FileDir值只初始化一次
const initialized = ref(false)

  export default defineComponent({
    //设置组件标签名
    name: 'file-bar',
    //设置组件接受参数
    props: {
      fileDir: {
          //类型为数组
        type: Array,
        default: () => []
      }
    },
    //设置组件id
    components: {
      filebar
    },

    //接受参数
    setup(props) {
        const fileDir = ref(null)

        //初始化FileDir
        const initFileDir = function(){
            console.log('initFileDir...')
            // 第一次访问LocalStorage中的FileDir
            if (!initialized.value){
                console.log(initialized)
                initialized.value = true
                fileDir.value = [
                    {name: 'a', type: 'file'},
                    {name: 'b', type:'directory', children: [
                        {name: 'c', type: 'file'}
                    ]}
                ]
            }else{
                // 将FileDir设为传入的参数，也就是原来的FireDir的child属性
                fileDir.value = props.fileDir
            }
        }
        //添加文件
      const addFile = (directory) => {
        directory.children.push({ name: '新文件', type: 'file' });
      };
        //添加目录
      const addDir = (directory) => {
        directory.children.push({ name: '新目录', type: 'directory', children: [] });
      };
  
      return {
        fileDir,
        addFile,
        addDir,
        initFileDir
      };
    },
    mounted(){
        this.initFileDir()
    }
  });
  </script>
  
