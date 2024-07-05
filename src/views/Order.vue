<script setup>
import {computed, onMounted, onUnmounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {UserSessionStorage} from "@/stores/common.js";

const userSession = UserSessionStorage();
import axios from "axios";


const route = useRoute();
const router = useRouter();
// 从路由参数接收并解析 cartIdList
const cartIdList = JSON.parse(route.query.cartIdList || '[]');

const businessId = ref(
    route.query.businessId
)
const business = ref({})
const user = ref({})
const cartArr = ref([])
const orDertailetArr = ref([])
//定义订单详情体
const orDertaile = ref({
  orderId : 0,
  foodId : 0,
  quantity : 0
})
const deliveryaddress = ref({})

const listCartForm = ref({
  userId: '',
  businessId: ''
})
const orderCreate = ref({
  userId: '',
  businessId: '',
  daId: '',
  orderTotal: ''
})

onMounted(() => {
  user.value = userSession.getSessionStorage('user');


  deliveryaddress.value = userSession.getLocalStorage(user.value.userId);


  //查询当前商家
  axios.get(`business/getBusinessById?businessId=${businessId.value}`).then(response => {
    business.value = response.data.data.business;
  }).catch(error => {
    console.error(error);
  });
  listCartForm.value.userId = user.value.userId
  listCartForm.value.businessId = businessId.value
  //查询当前用户在购物车中的当前商家食品列表
  axios.post('cart/listCart', listCartForm.value).then(response => {
    cartArr.value = response.data.data.cartResponseDtos;
  }).catch(error => {
    console.error(error);
  });

})

const totalPrice = computed(() => {
  let totalPrice = 0;
  for (let cartItem of cartArr.value) {
    // orDertaile.value.foodId = cartItem.foodId;
    // orDertaile.value.quantity = cartItem.quantity;
    // //将单个orDertaile加入到orDertailetArr
    // console.log(orDertaile.value)
    const newOrDertaile = {
      foodId: cartItem.foodId,
      quantity: cartItem.quantity
    };
    orDertailetArr.value.push(newOrDertaile);
    totalPrice += cartItem.food.foodPrice * cartItem.quantity;
  }
  totalPrice += business.value.deliveryPrice;
  return totalPrice;
})

function sexFilter(value) {
  return value === 1 ? '先生' : '女士';
}

function toUserAddress() {
  router.push({path: '/userAddress', query: {businessId: businessId.value}});
}

function toPayment() {

  console.log("要移除的cartIdList:"+cartIdList);
  // 遍历 cartIdList 并移除购物车项
  for (let index of cartIdList) {
    console.log("要移除的 cartId = " + index);
    axios.post(`cart/removeCart?cartId=${index}`).then(response => {
      if (response.data.code === 200) {
        console.log(`Successfully removed cart item with ID: ${index}`);
      } else {
        alert('从购物车中删除食品失败！');
      }
    }).catch(error => {
      console.error(error);
    });
  }
  // }
  if (deliveryaddress.value == null) {
    alert('请选择送货地址！');
    return;
  }
  orderCreate.value.userId = user.value.userId,
      orderCreate.value.businessId = businessId.value,
      orderCreate.value.daId = deliveryaddress.value.daId,
      orderCreate.value.orderTotal = totalPrice.value

  //创建订单
  axios.put('/orders/createOrders', orderCreate.value).then(response => {

    let orderId = response.data.data.res;
    if (orderId > 0) {
      //TODO 根据这里的orderId,进行订单详情的插入
      for ( let detail of  orDertailetArr.value){
        console.log("订单详情："+detail)
        detail.orderId = orderId;
      }
      //加入订单后
      for ( let detail of  orDertailetArr.value){
        console.log(detail)
      }
      //插入订单详情
      axios.post('/orderDetailet/saveOrderDetailetBatch',orDertailetArr.value).then(response =>{
        const res = response.data.code;
        if(res === 500){
          alert('创建订单详情失败')
        }
      }).catch(error => {
        console.error(error);
      });

      router.push({path: '/payment', query: {orderId: orderId}});
    } else {
      alert('创建订单失败！');
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
      <p>确认订单</p>
    </header>
    <!-- 订单信息部分 -->
    <div class="order-info">
      <h5>订单配送至：</h5>
      <div class="order-info-address" @click="toUserAddress">
        <p>{{ deliveryaddress != null ? deliveryaddress.address : '请选择送货地址' }}</p>
        <i class="fa fa-angle-right"></i>
      </div>
      <p>{{ user.userName }}{{ sexFilter(user.userSex) }} {{ user.phoneNum }}</p>
    </div>
    <h3>{{ business.businessName }}</h3>
    <!-- 订单明细部分 -->
    <ul class="order-detailed">
      <li v-for="item in cartArr">
        <div class="order-detailed-left">
          <img :src="item.food.foodImg">
          <p>{{ item.food.foodName }} x {{ item.quantity }}</p>
        </div>
        <p>&#165;{{ item.food.foodPrice * item.quantity }}</p>
      </li>
    </ul>
    <div class="order-deliveryfee">
      <p>配送费</p>
      <p>&#165;{{ business.deliveryPrice }}</p>
    </div>
    <!-- 合计部分 -->
    <div class="total">
      <div class="total-left">
        &#165;{{ totalPrice }}
      </div>
      <div class="total-right" @click="toPayment">
        去支付
      </div>
    </div>
  </div>
</template>

<style scoped>
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
.wrapper .order-info {
  /*注意这里，不设置高，靠内容撑开。因为地址有可能折行*/
  width: 100%;
  margin-top: 12vw;
  background-color: #0097EF;
  box-sizing: border-box;
  padding: 2vw;
  color: #fff;
}

.wrapper .order-info h5 {
  font-size: 3vw;
  font-weight: 300;
}

.wrapper .order-info .order-info-address {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 700;
  user-select: none;
  cursor: pointer;
  margin: 1vw 0;
}

.wrapper .order-info .order-info-address p {
  width: 90%;
  font-size: 5vw;
}

.wrapper .order-info .order-info-address i {
  font-size: 6vw;
}

.wrapper .order-info p {
  font-size: 3vw;
}

.wrapper h3 {
  box-sizing: border-box;
  padding: 3vw;
  font-size: 4vw;
  color: #666;
  border-bottom: solid 1px #DDD;
}

/****************** 订单明细部分 ******************/
.wrapper .order-detailed {
  width: 100%;
}

.wrapper .order-detailed li {
  width: 100%;
  height: 16vw;
  box-sizing: border-box;
  padding: 3vw;
  color: #666;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.wrapper .order-detailed li .order-detailed-left {
  display: flex;
  align-items: center;
}

.wrapper .order-detailed li .order-detailed-left img {
  width: 10vw;
  height: 10vw;
}

.wrapper .order-detailed li .order-detailed-left p {
  font-size: 3.5vw;
  margin-left: 3vw;
}

.wrapper .order-detailed li p {
  font-size: 3.5vw;
}

.wrapper .order-deliveryfee {
  width: 100%;
  height: 16vw;
  box-sizing: border-box;
  padding: 3vw;
  color: #666;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 3.5vw;
}

/****************** 订单合计部分 ******************/
.wrapper .total {
  width: 100%;
  height: 14vw;
  position: fixed;
  left: 0;
  bottom: 0;
  display: flex;
}

.wrapper .total .total-left {
  flex: 2;
  background-color: #505051;
  color: #fff;
  font-size: 4.5vw;
  font-weight: 700;
  user-select: none;
  display: flex;
  justify-content: center;
  align-items: center;
}

.wrapper .total .total-right {
  flex: 1;
  background-color: #38CA73;
  color: #fff;
  font-size: 4.5vw;
  font-weight: 700;
  user-select: none;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
