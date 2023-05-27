<template>
    <div>
        <el-input v-model="input" class="w-50 m-2" placeholder="Pick a word" @keyup.enter="enterHandler">
            <template #suffix>
                <el-icon class="el-input__icon"><img src="../../assets/search.svg" style="width: 1.5em; height: 1.5em; margin-right: 8px"></el-icon>
            </template>
        </el-input>
        <!-- <div id="wordInfo"> -->
            <el-row :gutter="20">
                <el-col :span="24"><div class="grid-content ep-bg-purple">{{ wordInfo.word }}</div></el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="24"><div class="grid-content ep-bg-purple">{{ wordInfo.phonetic }}</div></el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="24"><div class="grid-content ep-bg-purple" >{{ wordInfo.definition }}</div></el-col>
            </el-row>
            <div v-if="isSearched&&wordInfo.is_in_my_word">
                <el-button type="info" round @click="deleteWord">删除单词</el-button>
            </div>
            <div v-if="isSearched&&!wordInfo.is_in_my_word">
                <el-button type="success" round @click="addWord">添加单词</el-button>
            </div>
        <!-- </div> -->
    </div>

</template>
<script>
import { defineComponent, reactive, ref} from 'vue'
import axios from 'axios';
import { ipcRenderer } from 'electron';
import {ElNotification} from 'element-plus';

const req = axios.create({
    baseURL: process.env.SERVER_ADDRESS
}) 

export default defineComponent({
    setup() {
        ipcRenderer.send('get-token')
        const input = ref('')
        const token = ref('')
        const isSearched = ref(false)
        const wordInfo = reactive({
            id:"",
            word:"",
            phonetic:"",
            definition:"",
            is_in_my_word:false
        })
        //监听get-token-response消息
        ipcRenderer.on('get-token-response', (event, data) => {
            console.log('i get token response', data)
            token.value = data
            setToken()
        })
        //设置Token
        const setToken = function(){
            req.defaults.headers.common['Authorization'] = 'Bearer ' + token.value;
        }
        //监听回车事件
        const enterHandler = function(){
            //发送单词查询请求
            const data = {"word" : input.value}
            req.get('/words', {
                params:data,
                data:true,
            })
            .then(response => {
                if (response.data.code == 1){
                    isSearched.value = true
                    console.log(response.data.data)
                    wordInfo.word = response.data.data.word
                    wordInfo.phonetic = response.data.data.phonetic
                    wordInfo.definition = response.data.data.definition
                    wordInfo.id = response.data.data.id
                    queryWord()
                }
            })
            .catch(error => {
                console.log(error)
            })
            console.log('i get enter...')
        }
        /**
         * 查询单词是否在用户单词库
         */
        const queryWord = function(){
            req.get(process.env.SERVER_ADDRESS + "/words/query", {
                params:{
                    "id":wordInfo.id
                }}
                )
                .then(response => {
                    wordInfo.is_in_my_word = (response.data.data == 0 ? true : false)
                    console.log(response)
                })
        }

        /**
         * 将单词添加到单词库
         */
        const addWord = function(){
            req.get(process.env.SERVER_ADDRESS + "/words/add", {
                params:{
                    id:wordInfo.id
                }
            })
            .then(response => {
                if (response.data.code == 1){
                    //添加成功
                    ElNotification({
                        title: 'Success',
                        message: '添加成功',
                        type: 'success',
                    })
                    wordInfo.is_in_my_word = true
                }
            })
            .catch(error => {
                console.log(error)
            })
        }

        /**
         * 将单词从单词库中删除
         */
        const deleteWord = function(){
            req.delete(process.env.SERVER_ADDRESS + "/words/remove", {
                params:{
                    id:wordInfo.id
                }
            })
            .then(response => {
                if (response.data.code == 1){
                    //删除成功
                    ElNotification({
                        title: 'Success',
                        message: '删除成功',
                        type: 'success',
                    })
                    wordInfo.is_in_my_word = false
                }
            })
            .catch(error => {
                console.log(error)
            })
        }
        
        return {
            input,
            enterHandler,
            wordInfo,
            queryWord,
            isSearched,
            addWord,
            deleteWord,
            setToken
        }
    },
})
</script>
<style>
.el-row {
  margin-bottom: 20px;
}
.el-row:last-child {
  margin-bottom: 0;
}
.el-col {
  border-radius: 4px;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}

.el-input{
    -webkit-app-region: no-drag;  
}

.el-button{
    -webkit-app-region: no-drag;  
}
</style>
