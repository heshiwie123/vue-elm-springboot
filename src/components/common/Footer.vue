<script setup>

import {useRoute, useRouter} from "vue-router";

const route = useRoute();
const router = useRouter();



  function toIndex(){
  //跳转到主页
  router.push({
    path: '/'
  })
}
  function toOrderList(){
  //跳转到订单列表
  router.push({
    path: '/orderList'
  })
}
  function toUserInfo(){
    //跳转到个人信息界面
    router.push({
      path:'/userInfo'
    })
  }
</script>

<template>
  <div class="wrapper">
    <ul class="footer">

      <li @click="toIndex">
        <i class="fa fa-home"></i>
        <p>首页</p>
      </li>
      <li>
        <i class="fa  fa-compass"></i>
        <p>发现</p>
      </li>
      <li @click="toOrderList">
        <i class="fa fa-file-text-o"></i>
        <p>订单</p>
      </li>
      <li @click="toUserInfo">
        <i class="fa  fa-user-o"></i>
        <p>我的</p>
      </li>
    </ul>
  </div>

</template>

<style scoped>
.wrapper {
  width: 100%;
}
.wrapper .footer {
  width: 100%;
  height: 17vw;
  border-top: solid 1px #DDD;
  background-color: #fff;
  position: fixed;
  padding: 0;
  left: 0;
  bottom: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.wrapper .footer li {
  /*li本身的尺寸完全由内容撑起*/
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #999;
  user-select: none;
  cursor: pointer;
}

.wrapper .footer li p {
  font-size: 2.8vw;
}

.wrapper .footer li i {
  font-size: 5vw;
}
</style>
