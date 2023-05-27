<template>
    <div>
        <div id="headingText" class="headingText">
            <span>LOGIN </span>
        </div>
        <div id="loginMain" class="form">
            <el-form :model="form" label-width="100px">
                <el-form-item label="USERNAME">
                <el-input v-model="form.username" />
                </el-form-item>
                <el-form-item label="PASSWORD">
                <el-input v-model="form.password" />
                </el-form-item>      
            </el-form>
            <el-button class="info" type="success" @click="register">Register</el-button>
            <el-button class="submit" type="primary" @click="onSubmit">Submit</el-button>
            <el-button class="close" @click="close">Close</el-button>
        </div>
    </div>
</template>

<script>
import { defineComponent, reactive} from 'vue'
import {ipcRenderer} from 'electron'
import {ElNotification} from 'element-plus';
import axios from 'axios'

export default defineComponent({
    setup() {
        const form = reactive({
            username: '',
            password: ''
        })
        const register = function(){
            ipcRenderer.send('jump-to-register')
        }

        const onSubmit = function(){
            console.log('submit....')
            //发送登录的axios请求
            const data = {
                "username" : form.username,
                "password" : form.password
            }
            axios.post(process.env.SERVER_ADDRESS + "/users/login", data)
                .then(response => {
                    if (response.data.code == 1){
                        ipcRenderer.send('save-token', response.data.map.token)
                        console.log(response.data.map.token)
                        // console.log(response.headers['set-cookie']);
                        //登录成功,弹出成功消息
                        ElNotification({
                            title: 'Success',
                            message: 'This is a success message',
                            type: 'success',
                        })
                        //跳转到单词界面
                        jumpToWord()
                    }else{
                        //登录失败，弹出失败消息
                        ElNotification({
                            title: 'Error',
                            message: response.data.msg,
                            type: 'error',
                        })
                    }
                })
                .catch(error => {
                    console.log(error);
                })
            //测试弹出错误信息
            // alert()
            // jumpToWord()
        }
        //弹出错误信息
        const alert = () => {
            ElMessage.error(errorMessage)
        }
        //跳转到word界面
        const jumpToWord = function(){
            ipcRenderer.send('jump-to-word')
        }
        const close = function(){
            console.log('close window...')
            ipcRenderer.send('close-win')
        }
        return {
            form,
            onSubmit,
            close,
            register
        }
    },
})
</script>

<style>
    .headingText{
        position: absolute;
        top: 15%;
        left: 20%;
        font-size: 40px;
    }
    .form{
        position: absolute;
        top: 30%;
        -webkit-app-region: no-drag;
    }
    .submit{
        position: absolute;
        left: 30%;
        top: 120%;
        -webkit-app-region: no-drag;
    }
    .close{
        position: absolute;
        left: 60%;
        top: 120%;
        -webkit-app-region: no-drag;
    }
    .info{
        position: absolute;
        top: 120%;
        -webkit-app-region: no-drag;
    }
</style>
