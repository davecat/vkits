<template>
    <div class="sidebar">
        <!-- Sidebar Menu -->
        <el-menu :default-active="onRoutes" class="el-menu-vertical-demo" theme="dark" unique-opened router>
            <template v-for="(menu,index) in menus">
                <el-menu-item v-if="menu.type==1" :index="menu.url"><i :class="menu.icon"></i>{{menu.name}}
                </el-menu-item>
                <el-submenu v-else :index="menu.id">
                    <template slot="title"><i :class="menu.icon"></i>{{menu.name}}</template>
                    <el-menu-item v-for="(menu,cindex) in menu.children" :key="menu.id" :index='menu.url'>
                        <i :class="menu.icon"></i>{{menu.name}}
                    </el-menu-item>
                </el-submenu>
            </template>
        </el-menu>
        <!-- /.sidebar-menu -->
    </div>
</template>

<script>
    export default {
        data: function () {
            return {}
        },
        computed: {
            onRoutes(){
                return this.$route.path.replace('/', '');
            },
            menus() {
                return this.$store.state.menus.menus;
            }
        },
        methods: {}
    }
</script>

<style scoped>
    .sidebar {
        display: block;
        position: absolute;
        width: 200px;
        left: 0;
        top: 70px;
        bottom: 0;
        background: #2E363F;
    }

    .sidebar > ul {
        height: 100%;
    }

    .fa {
        margin-right: 10px;
    }
</style>