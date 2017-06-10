import Vue from 'vue'

// element-ui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-default/index.css';
Vue.use(ElementUI);

// vuex
import Vuex from 'vuex';
Vue.use(Vuex);

// router
import VueRouter from 'vue-router';
Vue.use(VueRouter);

// A small wrapper for integrating axios to Vuejs
import axios from 'axios';
import VueAxios from 'vue-axios';
// 设置axios支持set cookies
axios.defaults.withCredentials = true;
// Add a request interceptor
// axios.interceptors.request.use(function (config) {
//     if (store.state.token) {  // 判断是否存在token，如果存在的话，则每个http header都加上token
//         config.headers.Authorization = `token ${store.state.token}`;
//     }
//     return config;
// }, function (error) {
//     // Do something with request error
//     return Promise.reject(error);
// });
// Add a 401 response interceptor
axios.interceptors.response.use(function (response) {
    return response;
}, function (error) {
    if  (401 === error.response.status) {
        localStorage.removeItem('token');
        window.location = '/';
    }
    return Promise.reject(error);
});
Vue.use(VueAxios, axios);

import router from './config/router.js';

router.beforeEach((to, from, next) => {
    if(to.path === '/login') {
        const token = localStorage.getItem('token');
        if(token) {
            next({path: '/home'})
        }
    }
    if(to.matched.some(record => record.meta.requiresAuth)) {
        const token = localStorage.getItem('token');
        if (!token || token === null) {
            next({path: '/login'})
        } else {
            next()
        }
    } else {
        next()
    }
});

import "babel-polyfill";
import App from './App.vue';

//vuex store
import store from './store/';

new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
});
