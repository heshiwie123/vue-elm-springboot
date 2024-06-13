import { createRouter, createWebHistory } from 'vue-router'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path:'/register',
      name:'register',
      component:()=>import('../views/Register.vue')
    },
    {
      path:'/login',
      name:'login',
      component:()=>import('../views/Login.vue')
    },
    {
      path:'/orderList',
      name:'orderList',
      component:()=>import('../views/OrderList.vue')
    },
    {
      path:'/editUserAddress',
      name:'editUserAddress',
      component:()=>import('../views/EditUserAddress.vue')
    },
    {
      path:'/addUserAddress',
      name:'addUserAddress',
      component:()=>import('../views/AddUserAddress.vue')
    },
    {
      path:'/userAddress',
      name:'userAddress',
      component:()=>import('../views/UserAddress.vue')
    },
    {
      path:'/payment',
      name:'payment',
      component:()=>import('../views/Payment.vue')
    },
    {
      path:'/orders',
      name:'orders',
      component:()=>import('../views/Order.vue')
    },
    {
      path:'/businessInfo',
      name:'businessInfo',
      component:()=>import('../views/BusinessInfo.vue')
    },
    {
      path:'/businessList',
      name:'businessList',
      component:()=>import('../views/BusinessList.vue')
    },
    {
      path:'/',
      name:'index',
      component:()=>import('../views/Index.vue')
    },
    {
      path:'/footer',
      name:'footer',
      component:()=>import('../components/common/Footer.vue')
    },
    {
      path:'/userInfo',
      name:'userInfo',
      component:()=>import('../views/UserInfo.vue')
    },
    {
      path:'/test',
      name:'test',
      component:()=>import('../views/test.vue')
    }
  ]
})

export default router
