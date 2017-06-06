<template>
    <div class="wrapper">
        <v-head></v-head>
        <v-sidebar></v-sidebar>
        <!-- Content Wrapper. Contains page content -->
        <div class="content">
            <transition name="move" mode="out-in">
                <router-view></router-view>
            </transition>
        </div>
        <!-- /.content-wrapper -->
    </div>
</template>

<script>
    import vHead from './Header.vue';
    import vSidebar from './Sidebar.vue';
    export default {
        components: {
            vHead, vSidebar
        },
        created: function () {
            this.setMenu();
        },
        methods: {
            setMenu() {
                this.axios.get("/api/v1/menu").then((response) => {
                    let menus = response.data;
                    menus.sort((a,b) => a.sortNum - b.sortNum);
                    menus.forEach(m => m.children.sort((a,b) => a.sortNum - b.sortNum));
                    this.$store.dispatch('set_menu', menus);
                }).catch((error) => {
                    console.log(error);
                })
            }
        }
    }
</script>