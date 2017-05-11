<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="fa fa-dashboard"></i> 控制台</el-breadcrumb-item>
                <el-breadcrumb-item>首页</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <!-- Main content -->
        <section class="content">

            <!-- Your Page Content Here -->
            <el-button type="primary" @click="test">测试Get</el-button>
            <el-button type="primary" @click="test2">测试Post</el-button>
            <el-button type="primary" @click="test3">测试合并请求</el-button>
            <el-button type="primary" @click="getMenu">获取Menu</el-button>

        </section>
        <!-- /.content -->
    </div>
</template>

<script>
    export default {
        methods: {
            test() {
                this.axios.get("/api/v2/sign", {
                    params: {
                        orderId: 1
                    }
                }).then((response) => {
                    console.log(response.data);
                }).catch((error) => {
                    console.log(error);
                })
            },
            test2() {
                this.axios.post("/api/user", {
                    firstName: 'Ethan',
                    lastName: 'Liu'
                }).then((response) => {
                    console.log(response.data);
                }).catch((error) => {
                    console.log(error);
                })
            },
            test3() {
                this.axios.all([this.getUserAccount(), this.getUserPermissions()]).then((response) => {
                    console.log(response.data);
                }).catch((error) => {
                    console.log(error);
                })
            },
            getMenu() {
                this.axios.get("/api/menus").then((response) => {
                    console.log(response.data);
                }).catch((error) => {
                    console.log(error);
                })
            },
            getUserAccount() {
                return this.axios.get('/api/user/12345');
            },
            getUserPermissions() {
                return this.axios.post("/api/user", {
                    firstName: 'Ethan',
                    lastName: 'Liu'
                });
            }
        }
    }
</script>

<style>
</style>