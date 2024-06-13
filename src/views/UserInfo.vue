<script setup>


import {onMounted, onUnmounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import Footer from "@/components/common/Footer.vue";
import {UserSessionStorage} from "@/stores/common.js";
const userSession =UserSessionStorage();
const route = useRoute();
const router = useRouter();
const user=ref({})
onMounted(()=>{
  user.value=userSession.getSessionStorage('user')
})
</script>

<template>
  <div class="wrapper">
    <header>
      <p>个人信息管理</p>
    </header>
    <div class="user-account">
      <div class="user-account-detail">
        <div class="left">
          <i class="fa fa-user-o"></i>
         <div class="user-info">
           <p>用户：{{user.userName}}</p>
           <p>账号：{{user.phoneNum }}</p>
         </div>
        </div>
        <div class="user-account-img">
         <img src="../assets/userImg/yhtx08.png">
        </div>
        <div class="user-account-manager">
          <button>账户管理</button>
        </div>
      </div>
      <div class="function-item">
      </div>


    </div>
    <div class="user-function">
      <div class="money">
        钱包
      </div>
      <div class="packet">
          我的红包
      </div>
      <div class="coupon">

        <div>
          我的卡券
        </div>
      </div>
    </div>
    <Footer></Footer>
  </div>
</template>

<style scoped>
/*************** 总容器 ***************/
.wrapper {
  width: 100%;
  height: 100%;

}

/*************** header ***************/
.wrapper header {
  width: 100%;
  height: 12vw;
  background-color: #0097FF;
  display: flex;
  justify-content: space-around;
  align-items: center;
  color: #fff;
  font-size: 4.8vw;
  position: fixed;
  left: 0;
  top: 0;
  /*保证在最上层*/
  z-index: 1000;
}

.wrapper .user-account {
  width: 100%;
  justify-content: center;
  align-items: center;
  display: flex;
}

.wrapper .user-account .user-account-detail {

  width: 95%;
  height: 40vw;
  margin-top: 14vw;
  border-radius: 5vw;
  background-color: #38CA73;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.wrapper .user-account .user-account-detail .left{
  width: 28vw;
  height: 20vw;
  //background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
  justify-items: center;
  border-radius: 5vw;
}
.wrapper .user-account .user-account-detail .left .user-info{
  font-size: 4vw;
  justify-content: center;
  align-items: center;
}
.wrapper .user-account .user-account-detail .left .user-info p{
  font-size: 3vw;
  color: #f8f8f8;
  justify-content: center;
  align-items: center;
}
.wrapper .user-account .user-account-detail i{

  font-size: 10vw;
  color: #f5f5f5;
//background-color: #f5f5f5;
  border-radius: 5vw;
}
.wrapper .user-account .user-account-detail .user-account-img{
  width: 26vw;
  height: 26vw;
  background-size: cover;
  background-color: #f8f8f8;
  border-radius: 5vw;
  display: flex;
  justify-content: center;
  align-items: center;
}
.wrapper .user-account .user-account-detail .user-account-img img{
  width: 22vw;
}
.wrapper .user-account .user-account-detail .user-account-manager{
  background-color: #38CA73;
}
.wrapper .user-account .user-account-detail .user-account-manager button{
  background-color: #38CA73;
  font-size: 5vw;
  color: #f8f8f8;
}
.wrapper .user-function{
  margin-top: 3vw;
  margin-left: 2.5vw;
  width: 95%;
  border-radius: 5vw;
  background-color: #f5f5f5;
  justify-content: center;
  align-items: center;
  display: flex;
}
.wrapper .user-function .money{
  width: 30%;
  height: 20vw;
  display: flex;
  align-items: center;
  cursor: pointer;
}
.wrapper .user-function .packet{
  width: 30%;
  height: 20vw;
  display: flex;
  align-items: center;
  cursor: pointer;
}
.wrapper .user-function .coupon{
  width: 30%;
  height: 20vw;
  display: flex;
  align-items: center;
  cursor: pointer;
}
</style>
