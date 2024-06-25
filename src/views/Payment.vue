<script setup>
import {onBeforeUnmount, onMounted, onUnmounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import Footer from "@/components/common/Footer.vue";
import {UserSessionStorage} from "@/stores/common.js";
import axios from "axios";
import qs from "qs";

const route = useRoute();
const router = useRouter();
const userSession = UserSessionStorage();
const orderId = ref(
    route.query.orderId
)

const orders = ref({
  business: {}
})
const isShowDetailet = ref(false)
const selectCode = ref(0)


onMounted(() => {

  axios.get(`orders/getOrdersById?orderId=${orderId.value}`).then(response => {

    orders.value = response.data.data.ordersResponseDto;
  }).catch(error => {
    console.error(error);
  });
})
onBeforeUnmount(() => {
  //这里的代码是实现：一旦路由到在线支付组件，就不能回到订单确认组件。
  //先将当前url添加到history对象中
  history.pushState(null, null, document.URL);
  //popstate事件能够监听history对象的变化
  window.onpopstate = () => {
    router.push({path: '/'});
  }
})
onUnmounted(() => {
  window.onpopstate = null;
})

function detailetShow() {
  isShowDetailet.value = !isShowDetailet.value;
}

function selectPayWay(code) {
  selectCode.value = code
}

</script>

<template>
  <div class="wrapper">
    <!-- header部分 -->
    <header>
      <p>在线支付</p>
    </header>
    <!-- 订单信息部分 -->
    <h3>订单信息：</h3>
    <div class="order-info">
      <p>
        {{ orders.business.businessName }}
        <i class="fa fa-caret-down" @click="detailetShow"></i>
      </p>
      <p>&#165;{{ orders.orderTotal }}</p>
    </div>
    <!-- 订单明细部分 -->
    <ul class="order-detailet" v-show="isShowDetailet">
      <li v-for="item in orders.list">
        <p>{{ item.food.foodName }} x {{ item.quantity }}</p>
        <p>&#165;{{ item.food.foodPrice * item.quantity }}</p>
      </li>
      <li>
        <p>配送费</p>
        <p>&#165;{{ orders.business.deliveryPrice }}</p>
      </li>
    </ul>
    <!-- 支付方式部分 -->
    <ul class="payment-type">

      <li @click="selectPayWay(1)">
        <img src="../assets/alipay.png">
        <i class="fa fa-check-circle" v-show="selectCode===1"></i>
      </li>
      <li @click="selectPayWay(2)">
        <img src="../assets/wechat.png">
        <i class="fa fa-check-circle" v-show="selectCode===2"></i>
      </li>
    </ul>
    <div class="payment-button">
      <button >确认支付</button>
    </div>
    <!-- 底部菜单部分 -->
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

/****************** 订单信息部分 ******************/
.wrapper h3 {
  margin-top: 12vw;
  box-sizing: border-box;
  padding: 4vw 4vw 0;
  font-size: 4vw;
  font-weight: 300;
  color: #999;
}

.wrapper .order-info {
  box-sizing: border-box;
  padding: 4vw;
  font-size: 4vw;
  color: #666;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.wrapper .order-info p:last-child {
  color: orangered;
}

/****************** 订单明细部分 ******************/
.wrapper .order-detailet {
  width: 100%;
}

.wrapper .order-detailet li {
  width: 100%;
  box-sizing: border-box;
  padding: 1vw 4vw;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.wrapper .order-detailet li p {
  font-size: 3vw;
  color: #666;
}

/****************** 支付方式部分 ******************/
.wrapper .payment-type {
  width: 100%;
}

.wrapper .payment-type li {
  width: 100%;
  box-sizing: border-box;
  padding: 4vw;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.wrapper .payment-type li img {
  width: 33vw;
  height: 8.9vw;
}

.wrapper .payment-type li .fa-check-circle {
  font-size: 5vw;
  color: #38CA73;
}

.wrapper .payment-button {
  width: 100%;
  box-sizing: border-box;
  padding: 4vw;
}

.wrapper .payment-button button {
  width: 100%;
  height: 10vw;
  border: none;
  /*去掉外轮廓线*/
  outline: none;
  border-radius: 4px;
  background-color: #38CA73;
  color: #fff;
}
</style>
