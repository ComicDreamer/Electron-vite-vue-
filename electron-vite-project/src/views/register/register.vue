<template>
    <el-form ref="registerForm" :model="form" label-width="120px">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
  
      <el-form-item label="密码" prop="password">
        <el-input
          type="password"
          v-model="form.password"
          placeholder="请输入密码"
        ></el-input>
      </el-form-item>
  
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input
          type="password"
          v-model="form.confirmPassword"
          placeholder="请确认密码"
        ></el-input>
      </el-form-item>
  
      <el-form-item label="手机号" prop="phoneNumber">
        <el-input v-model="form.phoneNumber" placeholder="请输入手机号"></el-input>
      </el-form-item>
  
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email" placeholder="请输入邮箱"></el-input>
      </el-form-item>
  
      <el-form-item>
        <el-button type="success" @click="submitForm">注册</el-button>
        <el-button type="primary" @click="jumpToLogin">去登录</el-button>
        <el-button type="info" @click="close">关闭</el-button>
      </el-form-item>
    </el-form>
  </template>
<script>
import { ipcRenderer } from 'electron'
import { defineComponent, reactive} from 'vue'
import axios from 'axios'


export default defineComponent({
    setup() {
        const form = reactive({
            username: '',
            password: '',
            confirmPassword: '',
            phoneNumber: '',
            email: '',
        })
        const jumpToLogin = function(){
            ipcRenderer.send('jump-to-login')
        }
        const close = function(){
            ipcRenderer.send('close-win')
        }
        /**
         * 提交注册表单
         */
        const submitForm = function(){
          axios.post(process.env.SERVER_ADDRESS + "/users/register", form)
            .then(response => {
                if (response.data.code == 1){
                  jumpToLogin()
                }
            })
            .catch(error => {
              console.log(error)
            })
        }
        return {
            form,
            submitForm,
            jumpToLogin,
            close
        }
    },
})
</script>

<style>
.el-form-item{
  -webkit-app-region: no-drag
}
.el-form-item__label {
  width: 120px;
}
.el-input {
  width: 100px;
  -webkit-app-region: no-drag;
}

</style>