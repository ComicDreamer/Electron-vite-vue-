<template>
    <el-form>
        <el-form-item label="">
            <div class="center">
                <el-avatar :src="user.avatar" :size="80"></el-avatar>
            </div>
        </el-form-item>
        <el-form-item label="姓名">
            <el-input v-model="user.username"  :disabled="!isEditMode"></el-input>
        </el-form-item>
        <el-form-item label="新密码"  v-if="isEditPassword">
            <el-input v-model="user.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
            <el-input v-model="user.email"  :disabled="!isEditMode"></el-input>
        </el-form-item>
        <el-form-item label="手机号码">
            <el-input v-model="user.phoneNumber"  :disabled="!isEditMode"></el-input>
        </el-form-item>
        <el-form-item>
            <div class="center">
                <div v-if="isEditMode">
                    <el-button @click="save" type="primary">保存</el-button>
                </div>
                <div v-if="!isEditMode">
                    <el-button @click="toggleEditMode" type="primary">修改</el-button>
                </div>
                <div style="margin-left: 10px;" v-if="!isEditMode">
                    <el-button @click="setPassword" type="primary">修改密码</el-button>
                </div>
            </div>
        </el-form-item> 
    </el-form>
</template>
<script>
import { defineComponent, reactive, ref } from 'vue'
import axios from 'axios';
import { ipcRenderer } from 'electron';
import {ElNotification} from 'element-plus';

const req = axios.create({
    baseURL: process.env.SERVER_ADDRESS
}) 
export default defineComponent({
    setup() {
        ipcRenderer.send('get-token')
        //监听get-token-response消息
        ipcRenderer.on('get-token-response', (event, data) => {
            console.log('i get token response', data)
            token.value = data
            setToken()
            getUserInfo()
        })
        //设置Token
        const setToken = function(){
            req.defaults.headers.common['Authorization'] = 'Bearer ' + token.value;
        }
        const isEditPassword = ref(false)
        const token = ref('')
        const isEditMode = ref(false)
        const user = reactive({
            avatar: '',
            username: '',
            password: '',
            confirm_password:'',
            email: '',
            phoneNumber: '',
        })
        const setPassword = function(){
            isEditPassword.value = true
            isEditMode.value = true
        }
        /**
         * 获取用户信息
         */
        const getUserInfo = function(){
            req.get("/users/info")
            .then(response => {
                const userInfo = response.data.data
                // user.avatar = userInfo.avatar;
                user.username = userInfo.username
                user.email = userInfo.email
                user.phoneNumber = userInfo.phoneNumber
            })
            .catch(error => {
                console.log(error)
            })
        }
        /**
         * 保存用户信息
         */
        const save = function(){
            req.put("/users", user)
            .then(response => {
                if (response.data.code == 1){
                    //保存成功
                    ElNotification({
                        title: 'Success',
                        message: '保存成功',
                        type: 'success',
                    })
                    isEditMode.value = false
                    isEditPassword.value = false
                }
            })
            .catch(error => {
                console.log(error)
            })
        }
        const toggleEditMode = function(){
            isEditMode.value = true;
        }
        return {
            user,
            isEditMode,
            getUserInfo,
            toggleEditMode,
            token,
            save,
            isEditPassword,
            setPassword
        }
    },
})
</script>
<style>
    .el-input{
        -webkit-app-region: no-drag; 
    }
    .el-button{
        -webkit-app-region: no-drag; 
    }
    .el-avator{
        -webkit-app-region: no-drag; 
    }
    .center {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
    }

</style>
  