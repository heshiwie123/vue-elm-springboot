import {ref,computed} from "vue";
//导入pinia 的
import {defineStore} from "pinia";


//导出仓库名字
export const UserSessionStorage=defineStore('user',()=>{
    function getCurDate(){
            let now = new Date();
            let year = now.getFullYear();
            let month = now.getMonth() + 1;
            let day = now.getDate();
            month = month < 10 ? "0" + month : month;
            day = day < 10 ? "0" + day : day;
            return year + "-" + month + "-" + day;
        }
    //向sessionStorage中存储一个JSON对象
    function setSessionStorage(keyStr, value) {
        sessionStorage.setItem(keyStr, JSON.stringify(value));
    }
    //从sessionStorage中获取一个JSON对象（取不到时返回null）
    function getSessionStorage(keyStr) {
        const str = sessionStorage.getItem(keyStr);
        if (str === '' || str == null || str === 'null' || str === undefined) {
            return null;
        } else {
            return JSON.parse(str);
        }
    }
    //从sessionStorage中移除一个JSON对象
    function removeSessionStorage(keyStr) {
        sessionStorage.removeItem(keyStr);
    }
    //向localStorage中存储一个JSON对象
    function setLocalStorage(keyStr, value) {
        localStorage.setItem(keyStr, JSON.stringify(value));
    }
    //从localStorage中获取一个JSON对象（取不到时返回null）
    function getLocalStorage(keyStr) {
        var str = localStorage.getItem(keyStr);

        if (str === '' || str == null || str === 'null' || str === undefined) {
            return null;
        } else {
            return JSON.parse(str);
        }
    }
    //从localStorage中移除一个JSON对象
    function removeLocalStorage(keyStr) {
        localStorage.removeItem(keyStr);
    }
    //将方法暴露
    return{getCurDate,setSessionStorage,getSessionStorage,removeSessionStorage,setLocalStorage,getLocalStorage,removeLocalStorage}
})
