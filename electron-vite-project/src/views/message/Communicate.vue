<template>
    <div>
        <el-tree class="tree" :data="data"  @node-click="handleNodeClick" />
        <div class="chat-container">
          <div class="messages-container">
            <div v-for="message in messages" :key="message.id" :class="['message', message.type]">
                <div class="message-avatar">
                    <img :src="message.avatar" alt="Avatar" />
                </div>
                <div class="message-content">
                <div class="message-sender">{{ message.sender }}</div>
                <div class="message-text">{{ message.content }}</div>
                </div>
          </div>
        </div>
        <div class="input-container">
          <el-input v-model="inputMessage" placeholder="请输入消息"></el-input>
          <el-button @click="sendMessage" type="primary">发送</el-button>
        </div>
    </div>
    </div>
    
</template> 
<!--ts文件-->
<script lang="ts">
import { defineComponent, ref } from 'vue'
interface Tree {
  label: string
  children?: Tree[]
}

export default defineComponent({
    setup() {
        const data: Tree[] = [
            {
            label:'Friends',
            children:[]
        },
        {
            label:'Groups',
            children:[]
        }]
        const messages = [
            { id: 1, sender: 'John', avatar: '../img/login.jpg', content: 'Hello', type: 'received' },
            { id: 2, sender: 'Amy', avatar: '../img/login.jpg', content: 'Hi', type: 'sent' },
            { id: 3, sender: 'John', avatar: '../img/login.jpg', content: 'How are you?', type: 'received' },
            { id: 4, sender: 'Amy', avatar: '../img/login.jpg', content: 'I am good, thanks!', type: 'sent' },
            ]
        const inputMessage = ref()
        const handleNodeClick = function(){

        }
        const sendMessage = function() {
            if (inputMessage.value.trim() !== '') {
                const newMessage = {
                id: messages.length + 1,
                sender: 'You', // 设置为当前用户的姓名
                avatar: 'your-avatar.png', // 设置为当前用户的头像路径
                content: inputMessage.value.trim(),
                type: 'sent',
                };
                messages.push(newMessage);
                inputMessage.value = '';
            }
        }
        return {
            data,
            messages,
            inputMessage,
            sendMessage,
            handleNodeClick,

        }
    },
})
</script>

<style>
.tree{
    float: left;
}

.message-avatar {
  display: inline-block;
  margin-right: 10px;
}

.message-avatar img {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}

.chat-container {
  height: 300px;
  display: flex;
  flex-direction: column;
  
}

.messages-container {
  flex: 1;
  overflow-y: scroll;
  padding: 10px;
}

.message {
  margin-bottom: 10px;
}

.message-content {
  padding: 5px 10px;
  border-radius: 4px;
  display: inline-block;
}

.received {
  background-color: #f0f0f0;
  text-align: left;
}

.sent {
  background-color: #e5f2ff;
  text-align: right;
}

.input-container {
  display: flex;
  align-items: center;
  margin-top: 10px;
}

.el-input {
  flex: 1;
  margin-right: 10px;
  -webkit-app-region: no-drag;  
}

.el-button{
  -webkit-app-region: no-drag;  
}

</style>
