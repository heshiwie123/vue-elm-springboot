import './assets/main.css'

import { createApp } from 'vue'
//状态管理,可以供跨组件或页面共享状态
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import axios from "axios";
import {TokenSessionStorage} from "@/stores/Mytoken.js";

//设置axios的基础url部分
axios.defaults.baseURL = '/api/';

const app = createApp(App)
// app.use(axios)
app.use(createPinia())
app.use(router)
app.mount('#app')


const tokenSession=TokenSessionStorage();
// 获取存储在 localStorage 中的 token

// 设置请求拦截器
axios.interceptors.request.use(config => {

    if (config.url !=='authenticate/login' && config.url !== 'user/saveUser') {
        const storedToken=sessionStorage.getItem('token')
        // 设置请求头
        config.headers.Authorization = storedToken;
        config.withCredentials= true
    }
    return config;
},err=>{
    alert("没有token,先登陆！！！！")
    return Promise.reject(err)
});

router.beforeEach(function(to,from,next){
    let user = sessionStorage.getItem('user');
    //除了登录、注册、首页、商家列表、商家信息之外，都需要判断是否登录
    if(!(to.path==='/'||to.path==='/index'||to.path==='/login'||to.path==='/register')){
    if(user==null){
        router.push({path: '/login'});

    }
}
    next();
});
