<script setup>
import axios from "axios";
import {ref} from "vue";
const loginForm=ref({
  phoneNum:'18756214897',
  password:'123'
})
function send(){
  axios.post('http://10.100.187.89:51801/manage/apply/get/applyList').then(response => {
    console.log(response)
})
}
function send333(){
  axios.post('/api/user/login',loginForm.value).then(response => {
    const user = response.data.data.userInfo;
    const token = response.data.data.token;
    alert(token)
    console.log(response)
    if (user == null || user === '') {
      alert('用户名或密码不正确！');
    }else {
    alert("成功！@！！！！！！！！！！！！！！！！")
  }
})
}
</script>

<template>
<button @click="send">发送</button>
</template>

<style scoped>

</style>
