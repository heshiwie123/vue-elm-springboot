import {ref,computed} from "vue";
//导入pinia 的
import {defineStore} from "pinia";
export const TokenSessionStorage=defineStore('token',()=> {
    function setSessionStorage(keyStr, value) {
        sessionStorage.setItem(keyStr, value);
    }
    //从sessionStorage中获取一个JSON对象（取不到时返回null）
    function getSessionStorage(keyStr) {
        const str = sessionStorage.getItem(keyStr);
        if (str === '' || str == null || str === 'null' || str === undefined) {
            return null;
        } else {
            return str;
        }
    }
    //从sessionStorage中移除一个JSON对象
    function removeSessionStorage(keyStr) {
        sessionStorage.removeItem(keyStr);
    }
    //将方法暴露
    return{setSessionStorage,getSessionStorage,removeSessionStorage}
})
