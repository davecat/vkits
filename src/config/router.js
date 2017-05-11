import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
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
                    path: '/menus',
                    component: resolve => require(['../components/page/Menu.vue'], resolve)
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