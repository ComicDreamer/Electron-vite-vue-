<template>
    <div>
      <el-menu
      default-active="2"
      class="el-menu-vertical-demo"
      :collapse="isCollapse"
      @open="handleOpen"
      @close="handleClose"
      >
          <el-menu-item index="1" style="padding: 0 0px;">         
            <img @click="close" class="icon" src="../../assets/close.svg" style="width: 1.5em; height: 1.5em; margin-bottom: 25px;" >  
          </el-menu-item>
          <el-menu-item index="2" style="padding: 0 0px;"  @click="changeCollapse">
              <img style="width: 1.5em; height: 1.5em; margin-bottom: 25px;"
                src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
              >
          </el-menu-item>
          <el-menu-item index="3" @click="jumpToWord" style="padding: 0 0px;"> 
            <img class="icon" src="../../assets/word.svg" style="width: 1.5em; height: 1.5em; margin-bottom: 25px;" >        
          </el-menu-item>          <el-menu-item index="3" @click="jumpToUserprofile" style="padding: 0 0px;"> 
            <img class="icon" src="../../assets/message.svg" style="width: 1.5em; height: 1.5em; margin-bottom: 25px;" >        
          </el-menu-item>
      </el-menu>
    </div>
  </template>
  <script>
  import { defineComponent, reactive, ref} from 'vue'
  import {ipcRenderer} from 'electron'
  
  export default defineComponent({
      setup() {
          //导航栏是否展开
          const isCollapse = ref(false);
          const jumpToUserprofile = function(){
            ipcRenderer.send('jump-to-userprofile')
          }
          //关闭窗口
          const close = function(){
              console.log('i click close on sidebar...')
              ipcRenderer.send('close-win')
          }
          //改变导航栏展开状态
          const changeCollapse = function(){
            console.log('collapse has changed...')
            isCollapse.value = !isCollapse.value
          }
          //跳转到笔记窗口
          const jumpToWord = function(){
            ipcRenderer.send('jump-to-word')
          }
          return {
              isCollapse,
              close,
              changeCollapse,
              jumpToWord,
          }
      },
  })
  </script>
  <style>
    .el-menu-item{
      -webkit-app-region: no-drag;  
    }
  </style>