<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="fa fa-dashboard"></i> 控制台</el-breadcrumb-item>
                <el-breadcrumb-item>中介管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

    </div>
</template>

<script>
    export default {
        data() {
            return {
                tableData: [],
                cur_page: 1
            }
        },
        created(){
            this.getData();
        },
        methods: {
            handleCurrentChange(val){
                this.cur_page = val;
                this.getData();
            },
            getData(){
                let self = this;
                this.axios.get('/api/roles', {
                    params: {
                        page: self.cur_page
                    }
                }).then((res) => {
                    self.tableData = res.data.roles;
                })
            },
            handleEdit(index, row) {
                this.$message('编辑第' + (index + 1) + '行');
            },
            handleDelete(index, row) {
                this.$message.error('删除第' + (index + 1) + '行');
            },
        }
    }
</script>

<style>

</style>