import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '/login',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        },
        {
            path: '/home',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            children:[
                {
                    path: '/',
                    component: resolve => require(['../components/page/Index.vue'], resolve)
                },
                {
                    path: '/changePassword',
                    component: resolve => require(['../components/page/ChangePassword.vue'], resolve)
                },
                {
                    path: '/roles',
                    component: resolve => require(['../components/page/Roles.vue'], resolve)
                },
                {
                    path: '/menus',
                    component: resolve => require(['../components/page/Menu.vue'], resolve)
                },
                {
                    path: '/buttons',
                    component: resolve => require(['../components/page/Button.vue'], resolve)
                },
                {
                    path: '/users',
                    component: resolve => require(['../components/page/User.vue'], resolve)
                }
            ]
        },
        {
            path: '*',
            component: resolve => require(['../components/common/404.vue'], resolve),
            children:[
                {
                    path: '/',
                    component: resolve => require(['../components/page/NotFound.vue'], resolve)
                }
            ]
        }
    ]
})