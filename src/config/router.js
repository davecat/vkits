import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            meta: { requiresAuth: false },
            redirect: '/login'
        },
        {
            path: '/login',
            meta: { requiresAuth: false },
            component: resolve => require(['../components/page/Login.vue'], resolve)
        },
        {
            path: '/home',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            children:[
                {
                    path: '/',
                    meta: { requiresAuth: true },
                    component: resolve => require(['../components/page/Index.vue'], resolve)
                },
                {
                    path: '/changePassword',
                    meta: { requiresAuth: true },
                    component: resolve => require(['../components/page/ChangePassword.vue'], resolve)
                },
                {
                    path: '/roles',
                    meta: { requiresAuth: true },
                    component: resolve => require(['../components/page/Roles.vue'], resolve)
                },
                {
                    path: '/menus',
                    meta: { requiresAuth: true },
                    component: resolve => require(['../components/page/Menu.vue'], resolve)
                },
                {
                    path: '/buttons',
                    meta: { requiresAuth: true },
                    component: resolve => require(['../components/page/Button.vue'], resolve)
                },
                {
                    path: '/users',
                    meta: { requiresAuth: true },
                    component: resolve => require(['../components/page/User.vue'], resolve)
                },
                {
                    path: '/agency',
                    meta: { requiresAuth: true },
                    component: resolve => require(['../components/page/Agency.vue'], resolve)
                },
                {
                    path: '/branch',
                    meta: { requiresAuth: true },
                    component: resolve => require(['../components/page/Branch.vue'], resolve)
                },
                {
                    path: '/agent',
                    meta: { requiresAuth: true },
                    component: resolve => require(['../components/page/Agent.vue'], resolve)
                },
                {
                    path: '/request',
                    meta: { requiresAuth: true },
                    component: resolve => require(['../components/page/Request.vue'], resolve)
                },
                {
                    path: '/contract',
                    meta: { requiresAuth: true },
                    component: resolve => require(['../components/page/Contract.vue'], resolve)
                },
                {
                    path: '/loaner',
                    meta: { requiresAuth: true },
                    component: resolve => require(['../components/page/Loaner.vue'], resolve)
                },
                {
                    path: '/risk_control_request',
                    meta: { requiresAuth: true },
                    component: resolve => require(['../components/page/Risk_control_request.vue'], resolve)
                },
                {
                    path: '/post_lending_management_contract',
                    meta: { requiresAuth: true },
                    component: resolve => require(['../components/page/Post_lending_management_contract.vue'], resolve)
                },
                {
                    path: '/request_handling',
                    meta: { requiresAuth: true },
                    component: resolve => require(['../components/page/Request_handling.vue'], resolve)
                },
                {
                    path: '/eod_report',
                    meta: { requiresAuth: true },
                    component: resolve => require(['../components/page/Eod_report.vue'], resolve)
                }
            ]
        },
        {
            path: '*',
            component: resolve => require(['../components/common/404.vue'], resolve),
            children:[
                {
                    path: '/',
                    meta: { requiresAuth: false },
                    component: resolve => require(['../components/page/NotFound.vue'], resolve)
                }
            ]
        }
    ]
})