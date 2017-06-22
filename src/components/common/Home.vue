<template>
    <!--<div class="wrapper">-->
        <!--<v-head></v-head>-->
        <!--<v-sidebar></v-sidebar>-->
        <!--&lt;!&ndash; Content Wrapper. Contains page content &ndash;&gt;-->
        <!--<div class="content">-->
            <!--<transition name="move" mode="out-in">-->
                <!--<router-view></router-view>-->
            <!--</transition>-->
        <!--</div>-->
        <!--&lt;!&ndash; /.content-wrapper &ndash;&gt;-->
    <!--</div>-->


    <div class="app-wrapper hideSidebar" >
        <div class="sidebar-wrapper">
            <v-sidebar class="sidebar-container"></v-sidebar>
        </div>
        <div class="main-container">
            <v-head></v-head>
            <transition name="move" mode="out-in">
                <router-view></router-view>
            </transition>
        </div>
    </div>
</template>

<script>
    import vHead from './Header.vue';
    import vSidebar from './Sidebar.vue';
    export default {
        components: {
            vHead, vSidebar
        },
        computed: {

        }
    }
</script>

<style scoped>
    .app-wrapper {
        position: relative;
        height: 100%;
        width: 100%;
    }
    .hideSidebar .sidebar-wrapper{
        /*transform: translate(-140px, 0);*/
        width: 40px;
    }
    .hideSidebar .sidebar-container{
        transform: translate(132px, 0);
    }
    .hideSidebar .sidebar-wrapper:hover{
        /*transform: translate(0, 0);*/
        width: 200px;
    }
    .hideSidebar .sidebar-container{
        transform: translate(0, 0);
    }
    .hideSidebar .main-container{
        margin-left: 40px;

    }
    .sidebar-wrapper {
        width: 200px;
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        z-index: 1001;
        overflow: hidden;
        transition: all .28s ease-out;
    }
    .sidebar-container {
        transition: all .28s ease-out;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: -17px;
        overflow-y: scroll;
    }
    .main-container {
        min-height: 100%;
        transition: all .28s ease-out;
        margin-left: 200px;
    }
</style>