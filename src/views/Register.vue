<script setup>
import {ref} from "vue";

import Footer from "@/components/common/Footer.vue";
import qs from "qs";
import axios from "axios";
import {useRoute,useRouter} from "vue-router";
const route=useRoute();
const router=useRouter();
const user = ref({
  phoneNum: '',
  password: '',
  userName: '',
  userSex: 1
});
const confirmPassword = ref('');

function checkUserPhoneNum() {
  axios.post(`user/getUserExistByPhone?phoneNum=${user.value.phoneNum}`).then(response => {
    if (response.data.code === 200) {
      user.value.phoneNum = '';
      alert('此手机号码已存在！')
    }
  }).catch(error => {
    console.error(error);
  });
}

function register(){
  if (user.value.phoneNum === '') {
    alert('手机号码不能为空！');
    return;
  }
  if (user.value.password === '') {
    alert('密码不能为空！');
    return;
  }
  if (user.value.password !== confirmPassword.value) {
    alert('两次输入的密码不一致！');
    return;
  }
  if (user.value.userName === '') {
    alert('用户名不能为空！');
    return;
  }
  //注册请求
  axios.put('user/saveUser', user.value).then(response => {
    if(response.data.code===200){
      alert('注册成功！');
      router.go(-1);
    }else{
      alert('注册失败！');
    }
  }).catch(error => {
    console.error(error);
  });
}

</script>

<template>
  <div class="wrapper">
    <!-- header部分 -->
    <header>
      <p>用户注册</p>
    </header>
    <!-- 表单部分 -->
    <ul class="form-box">
      <li>
        <div class="title">
          手机号码：
        </div>
        <div class="content">
          <input type="text" @blur="checkUserPhoneNum" v-model="user.phoneNum" placeholder="手机号码">
        </div>
      </li>
      <li>
        <div class="title">
          密码：
        </div>
        <div class="content">
          <input type="password" v-model="user.password" placeholder="密码">
        </div>
      </li>
      <li>
        <div class="title">
          确认密码：
        </div>
        <div class="content">
          <input type="password" v-model="confirmPassword" placeholder="确认密码">
        </div>
      </li>
      <li>
        <div class="title">
          用户名称：
        </div>
        <div class="content">
          <input type="text" v-model="user.userName" placeholder="用户名称">
        </div>
      </li>
      <li>
        <div class="title">
          性别：
        </div>
        <div class="content" style="font-size: 3vw;">
          <input type="radio" v-model="user.userSex" value="1"
                 style="width:6vw;height: 3.2vw;">男
          <input type="radio" v-model="user.userSex" value="0"
                 style="width:6vw;height: 3.2vw;">女
        </div>
      </li>
    </ul>
    <div class="button-login">
      <button @click="register">注册</button>
    </div>

    <Footer></Footer>
  </div>
</template>

<style scoped>
/****************** 总容器 ******************/
.wrapper {
  width: 100%;
  height: 100%;
}
/****************** header部分 ******************/
.wrapper header {
  width: 100%;
  height: 12vw;
  background-color: #0097FF;
  color: #fff;
  font-size: 4.8vw;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
}
/****************** 表单部分 ******************/
.wrapper .form-box {
  width: 100%;
  margin-top: 12vw;
}
.wrapper .form-box li {
  box-sizing: border-box;
  padding: 4vw 3vw 0 3vw;
  display: flex;
  align-items: center;
}
.wrapper .form-box li .title {
  flex: 0 0 18vw;
  font-size: 3vw;
  font-weight: 700;
  color: #666;
}
.wrapper .form-box li .content {
  flex: 1;
}
.wrapper .form-box li .content input {
  border: none;
  outline: none;

  width: 100%;
  height: 4vw;
  font-size: 3vw;
}
.wrapper .button-login {
  width: 100%;
  box-sizing: border-box;
  padding: 4vw 3vw 0 3vw;
}
.wrapper .button-login button {
  width: 100%;
  height: 10vw;
  font-size: 3.8vw;
  font-weight: 700;
  color: #fff;
  background-color: #38CA73;
  border-radius: 4px;
  border: none;
  outline: none;
}
.wrapper .button-register {
  width: 100%;
  box-sizing: border-box;
  padding: 4vw 3vw 0 3vw;
}
.wrapper .button-register button {
  width: 100%;
  height: 10vw;
  font-size: 3.8vw;
  font-weight: 700;
  color: #666;
  background-color: #EEE;
  border-radius: 4px;


  outline: none;
  border: solid 1px #DDD;
}
</style>
