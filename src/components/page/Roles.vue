<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="fa fa-dashboard"></i> 控制台</el-breadcrumb-item>
                <el-breadcrumb-item>角色管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <!-- Main content -->
        <section class="content">
            <el-row>
                <el-button type="primary">新建角色</el-button>
            </el-row>
            <el-row>
                <el-table :data="tableData" border style="width: 50%">
                    <el-table-column prop="id" label="ID" width="120">
                    </el-table-column>
                    <el-table-column prop="name" label="角色名称" width="180">
                    </el-table-column>
                    <el-table-column prop="createTime" label="创建时间" sortable width="220">
                    </el-table-column>
                    <el-table-column label="操作">
                        <template scope="scope">
                            <el-button size="small" type="info"
                                       @click="handleEdit(scope.$index, scope.row)">编辑
                            </el-button>
                            <el-button size="small" type="danger"
                                       @click="handleDelete(scope.$index, scope.row)">删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="pagination" style="width: 50%">
                    <el-pagination
                            @current-change="handleCurrentChange"
                            layout="prev, pager, next"
                            :total="50">
                    </el-pagination>
                </div>
            </el-row>

        </section>
        <!-- /.content -->
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
    .el-row {
        margin-bottom: 20px;
    }
    .el-row :last-child {
        margin-bottom: 0;
    }
</style>