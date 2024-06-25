<script setup>
import {computed, onMounted, onUnmounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {UserSessionStorage} from "@/stores/common.js";
import axios from "axios";
import qs from "qs";

const route = useRoute();
const router = useRouter();
const userStorage = UserSessionStorage();
const cartId = ref();
const businessId = ref(
    route.query.businessId
)
const business = ref({})
const foodArr = ref([])
const user = ref({})

const listCartForm = ref({
  userId: '',
  businessId: ''
})
const CartSaveForm = ref({
  userId: '',
  businessId: '',
  foodId: ''
})
const CartUpdateForm = ref({
  cartId: 0,
  userId: '',
  businessId: '',
  foodId: '',
  quantity: ''
})

onMounted(() => {
  user.value = userStorage.getSessionStorage('user');
  listCartForm.value.userId = user.value.userId
  CartSaveForm.value.userId = user.value.userId
  CartUpdateForm.value.userId = user.value.userId
  listCartForm.value.businessId = businessId.value
  CartSaveForm.value.businessId = businessId.value
  CartUpdateForm.value.businessId = businessId.value
  //根据businessId查询商家信息
  axios.get(`business/getBusinessById?businessId=${businessId.value}`).then(response => {
    business.value = response.data.data.business;
  }).catch(error => {
    console.error(error);
  });
  //根据businessId查询所属食品信息
  axios.get(`food/listFoodByBusinessId?businessId=${businessId.value}`).then(response => {
    foodArr.value = response.data.data.foodList;
    for (let i = 0; i < foodArr.value.length; i++) {
      foodArr.value[i].quantity = 0;
    }

    //如果已登录，那么需要去查询购物车中是否已经选购了某个食品
    if (user.value != null) {
      listCart();
    }
  }).catch(error => {
    console.error(error);
  });
})

function listCart() {
  axios.post('cart/listCart', listCartForm.value).then(response => {
    let cartArr = response.data.data.cartResponseDtos;
    cartId.value = response.data.data.cartResponseDtos.cartId;
    //遍历所有食品列表
    for (let foodItem of foodArr.value) {
      foodItem.quantity = 0;
      for (let cartItem of cartArr) {
        if (cartItem.foodId === foodItem.foodId) {
          foodItem.quantity = cartItem.quantity;
        }
      }
    }
    foodArr.value.sort();
  }).catch(error => {
    console.error(error);
  });
}

function minus(index) {
  CartSaveForm.value.foodId = foodArr.value[index].foodId
  CartUpdateForm.value.foodId = foodArr.value[index].foodId
  //首先做登录验证
  if (user.value == null) {
    router.push({
      path: '/login'
    });
    return;
  }
  if (foodArr.value[index].quantity > 1) {
    //做update
    updateCart(index, -1);
  } else {
    //做delete
    removeCart(index);
  }
}

function add(index) {
  CartSaveForm.value.foodId = foodArr.value[index].foodId
  CartUpdateForm.value.foodId = foodArr.value[index].foodId
  //首先做登录验证
  if (user.value == null) {
    router.push({
      path: '/login'
    });
    return;
  }
  if (foodArr.value[index].quantity === 0) {
    //做insert
    savaCart(index);
  } else {
    //做update
    updateCart(index, 1);
  }
}

function savaCart(index) {
  axios.put('cart/saveCart', CartSaveForm.value).then(response => {
    if (response.data.code === 200) {
      //此食品数量要更新为1；
      foodArr.value[index].quantity = 1;
      foodArr.value[index].cartId = response.data.data;
      foodArr.value.sort();
    } else {
      alert('向购物车中添加食品失败！');
    }
  }).catch(error => {
    console.error(error);
  });
}

function updateCart(index, num) {
  CartUpdateForm.value.quantity = foodArr.value[index].quantity + num
  CartUpdateForm.value.cartId = foodArr.value[index].cartId
  axios.post('cart/updateCart', CartUpdateForm.value).then(response => {
    if (response.data.code === 200) {
      //此食品数量要更新为1或-1；
      foodArr.value[index].quantity += num;
      foodArr.value.sort();
    } else {
      alert('向购物车中更新食品失败！');
    }
  }).catch(error => {
    console.error(error);
  });
}

function removeCart(index) {
  console.log(foodArr.value[index].cartId)
  cartId.value = foodArr.value[index].cartId;
  console.log("要移除的cartid = " + cartId.value)
  axios.post(`cart/removeCart?cartId=${cartId.value}`).then(response => {
    if (response.data.code === 200) {
      //此食品数量要更新为0；视图的减号和数量要消失
      foodArr.value[index].quantity = 0;
      foodArr.value.sort();
    } else {
      alert('从购物车中删除食品失败！');
    }
  }).catch(error => {
    console.error(error);
  });
}

function toOrder() {
// 先清空购物车的id列表
  const cartIdList = []
  for (let i = 0; i < foodArr.value.length; i++) {
    cartIdList.push(foodArr.value[i].cartId)
  }
  // 打印 cartIdList 检查其内容
  console.log("cartIdList:"+cartIdList);
  router.push({
    path: '/orders',
    query: {
      businessId: business.value.businessId,
      cartIdList: JSON.stringify(cartIdList) // 转换为字符串传递
    }
  });
}

// 总价格的计算属性
const totalPrice = computed(() => {
  let total = 0;
  for (let item of foodArr.value) {
    total += item.foodPrice * item.quantity;
  }
  return total;
});

// 总数量的计算属性
const totalQuantity = computed(() => {
  let quantity = 0;
  for (let item of foodArr.value) {
    quantity += item.quantity;
  }
  return quantity;
});

// 总结算价格的计算属性
const totalSettle = computed(() => {
  return totalPrice.value + business.value.deliveryPrice;
});
</script>

<template>
  <div class="wrapper">
    <!-- header部分 -->
    <header>
      <p>商家信息</p>
    </header>
    <!-- 商家logo部分 -->
    <div class="business-logo">
      <img :src="business.businessImg">
    </div>
    <!-- 商家信息部分 -->
    <div class="business-info">
      <h1>{{ business.businessName }}</h1>
      <p>&#165;{{ business.starPrice }}起送 &#165;{{ business.deliveryPrice }}配送</p>
      <p>{{ business.businessExplain }}</p>
    </div>
    <!-- 食品列表部分 -->
    <ul class="food">
      <li v-for="(item,index) in foodArr">
        <div class="food-left">
          <img :src="item.foodImg">
          <div class="food-left-info">
            <h3>{{ item.foodName }}</h3>
            <p>{{ item.foodExplain }}</p>
            <p>&#165;{{ item.foodPrice }}</p>
          </div>
        </div>
        <div class="food-right">
          <div>
            <i class="fa fa-minus-circle" @click="minus(index)" v-show="item.quantity!==0"></i>
          </div>
          <p><span v-show="item.quantity!==0">{{ item.quantity }}</span></p>
          <div>
            <i class="fa fa-plus-circle" @click="add(index)"></i>
          </div>
        </div>
      </li>
    </ul>
    <!-- 购物车部分 -->
    <div class="cart">
      <div class="cart-left">
        <div class="cart-left-icon" :style="totalQuantity===0?'background-color:#505051;':'background-color:#3190E8;'">
          <i class="fa fa-shopping-cart"></i>
          <div class="cart-left-icon-quantity" v-show="totalQuantity!==0">
            {{ totalQuantity }}
          </div>
        </div>
        <div class="cart-left-info">
          <p>&#165;{{ totalPrice }}</p>
          <p>另需配送费{{ business.deliveryPrice }}元</p>
        </div>
      </div>
      <div class="cart-right">
        <!-- 不够起送费 -->
        <div class="cart-right-item" v-show="totalSettle<business.starPrice"
             style="background-color: #535356;cursor: default;">
          &#165;{{ business.starPrice }}起送
        </div>
        <!-- 达到起送费 -->
        <div class="cart-right-item" @click="toOrder" v-show="totalSettle>=business.starPrice">
          去结算
        </div>
      </div>
    </div>
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

/****************** 商家logo部分 ******************/
.wrapper .business-logo {
  width: 100%;
  height: 35vw;
  /*使用上外边距避开header部分*/
  margin-top: 12vw;
  display: flex;
  justify-content: center;
  align-items: center;
}

.wrapper .business-logo img {
  width: 40vw;
  height: 30vw;
  border-radius: 5px;
}

/****************** 商家信息部分 ******************/
.wrapper .business-info {
  width: 100%;
  height: 20vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.wrapper .business-info h1 {
  font-size: 5vw;
}

.wrapper .business-info p {
  font-size: 3vw;
  color: #666;
  margin-top: 1vw;
}

/****************** 食品列表部分 ******************/
.wrapper .food {
  width: 100%;
  /*使用下外边距避开footer部分*/
  margin-bottom: 14vw;
}

.wrapper .food li {
  width: 100%;
  box-sizing: border-box;
  padding: 2.5vw;
  user-select: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.wrapper .food li .food-left {
  display: flex;
  align-items: center;
}

.wrapper .food li .food-left img {
  width: 20vw;
  height: 20vw;
}

.wrapper .food li .food-left .food-left-info {
  margin-left: 3vw;
}

.wrapper .food li .food-left .food-left-info h3 {
  font-size: 3.8vw;
  color: #555;
}

.wrapper .food li .food-left .food-left-info p {
  font-size: 3vw;
  color: #888;
  margin-top: 2vw;
}

.wrapper .food li .food-right {
  width: 16vw;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.wrapper .food li .food-right .fa-minus-circle {
  font-size: 5.5vw;
  color: #999;
  cursor: pointer;
}

.wrapper .food li .food-right p {
  font-size: 3.6vw;
  color: #333;
}

.wrapper .food li .food-right .fa-plus-circle {
  font-size: 5.5vw;
  color: #0097EF;
  cursor: pointer;
}

/****************** 购物车部分 ******************/
.wrapper .cart {
  width: 100%;
  height: 14vw;
  position: fixed;
  left: 0;
  bottom: 0;
  display: flex;
}

.wrapper .cart .cart-left {
  flex: 2;
  background-color: #505051;
  display: flex;
}

.wrapper .cart .cart-left .cart-left-icon {
  width: 16vw;
  height: 16vw;
  box-sizing: border-box;
  border: solid 1.6vw #444;
  border-radius: 8vw;
  background-color: #3190E8;
  font-size: 7vw;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: -4vw;
  margin-left: 3vw;
  position: relative;
}

.wrapper .cart .cart-left .cart-left-icon-quantity {
  width: 5vw;
  height: 5vw;
  border-radius: 2.5vw;
  background-color: red;
  color: #fff;
  font-size: 3.6vw;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  right: -1.5vw;
  top: -1.5vw;
}

.wrapper .cart .cart-left .cart-left-info p:first-child {
  font-size: 4.5vw;
  color: #fff;
  margin-top: 1vw;
}

.wrapper .cart .cart-left .cart-left-info p:last-child {
  font-size: 2.8vw;
  color: #AAA;
}

.wrapper .cart .cart-right {
  flex: 1;
}

/*达到起送费时的样式*/
.wrapper .cart .cart-right .cart-right-item {
  width: 100%;
  height: 100%;
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

/*不够起送费时的样式（只有背景色和鼠标样式的区别）*/
/*
.wrapper .cart .cart-right .cart-right-item{
width: 100%;
height: 100%;
background-color: #535356;
color: #fff;
font-size: 4.5vw;
font-weight: 700;
user-select: none;

display: flex;
justify-content: center;
align-items: center;
}
*/
</style>
