<template>
    <div>
      <el-menu
      default-active="2"
      class="el-menu-vertical-demo"
      :collapse="isCollapse"
      @open="handleOpen"
      @close="handleClose"
      >
          <el-menu-item index="1" style="padding: 0 5px;">         
            <img @click="close" class="icon" src="../../assets/close.svg" style="width: 2em; height: 2em; margin-bottom: 15px;" >  
          </el-menu-item>
          <el-menu-item index="2" style="padding: 0 5px;"  @click="jumpToUserprofile">
              <img style="width: 2em; height: 2em; margin-bottom: 15px;"
                src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
              >
          </el-menu-item>
          <el-menu-item index="3" @click="jumpToNote" style="padding: 0 5px;"> 
            <img class="icon" src="../../assets/note.svg" style="width: 2em; height: 2em; margin-bottom: 15px;" >        
          </el-menu-item>
          <el-menu-item index="4" @click="jumpToMessage" style="padding: 0 5px;"> 
            <img class="icon" src="../../assets/message.svg" style="width: 2em; height: 2em; margin-bottom: 15px;" >        
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
          //跳转到userprofile界面
          const jumpToUserprofile = function(){
            ipcRenderer.send('jump-to-userprofile')
          }
          //跳转到message窗口
          const jumpToMessage = function(){
            ipcRenderer.send('jump-to-message')
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
          const jumpToNote = function(){
            ipcRenderer.send('jump-to-note')
          }
          return {
              isCollapse,
              close,
              changeCollapse,
              jumpToNote,
              jumpToMessage,
              jumpToUserprofile,
          }
      },
  })
  </script>
  <style>
    
  </style>