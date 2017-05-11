import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

import menus from './sidebar/';

export default new Vuex.Store({
    modules: {
        menus: menus
    }
});