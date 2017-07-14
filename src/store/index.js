import menus from './sidebar/';
import staff from './staff';

export default new Vuex.Store({
    modules: {
        menus: menus,
        staff: staff
    }
});