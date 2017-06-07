<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="fa fa-dashboard"></i> 系统管理</el-breadcrumb-item>
                <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-row>
            <el-col :span="14">
                <el-table :data="tableData" border>
                    <el-table-column prop="staffName" label="用户昵称">
                    </el-table-column>
                    <el-table-column prop="staffType" label="类型">
                        <template scope="scope">
                            {{scope.row.staffType | staffTypeFormat}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="status" label="状态">
                        <template scope="scope">
                            {{scope.row.status=='Normal' ? '正常':'禁用'}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="username" label="登录名">
                    </el-table-column>
                    <el-table-column label="操作" width="320">
                        <template scope="scope">
                            <el-tooltip class="item" effect="dark" content="修改" placement="top-end">
                                <el-button size="small" type="primary"
                                           @click="handleEdit(scope.$index, scope.row)"><i class="fa fa-pencil-square-o"></i>
                                </el-button>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="重置密码" placement="top-end">
                                <el-button size="small" type="danger"
                                           @click="resetPwd(scope.row.staffId)"><i class="fa fa-repeat"></i>
                                </el-button>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="锁定" placement="top-end">
                                <el-button size="small" type="warning"
                                           @click="unlock(scope.row.staffId)"><i class="fa fa-lock"></i>
                                </el-button>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="解锁" placement="top-end">
                                <el-button size="small" type="danger"
                                           @click="lock(scope.row.staffId)"><i class="fa fa-unlock-alt"></i>
                                </el-button>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="pagination">
                    <el-pagination
                            @current-change="handleCurrentChange"
                            layout="prev, pager, next"
                            :total="totalElements">
                    </el-pagination>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                tableData: [],
                cur_page: 1,
                size: 10,
                totalElements: 0
            }
        },
        created(){
            this.getData();
        },
        filters: {
            staffTypeFormat: function (value) {
                if (value === "Interior") {
                    return "内部员工";
                } else if (value === "Boss") {
                    return "中介公司负责人";
                } else {
                    return "门店管理员";
                }
            }
        },
        methods: {
            handleCurrentChange(val){
                this.cur_page = val;
                this.getData();
            },
            getData(){
                let self = this;
                this.axios.post('/api/v1/user/getList', {
                    params: {
                        page: self.cur_page - 1,
                        size: self.size
                    }
                }).then((res) => {
                    self.tableData = res.data.content;
                    self.totalElements = res.data.totalElements;
                })
            },
            handleEdit(index, row) {
                this.$message('编辑第' + (index + 1) + '行');
            },
            resetPwd(staffId) {
                let self = this;
                this.axios.put('/api/v1/user/admin/resetPassword', {
                    userId: staffId
                }).then((res) => {
                    self.tableData = res.data.content;
                    self.totalElements = res.data.totalElements;
                })
            },
            lock(staffId) {
                let self = this;
                this.axios.put('/api/v1/user/admin/blockUser', [staffId]).then((res) => {
                    self.tableData = res.data.content;
                    self.totalElements = res.data.totalElements;
                })
            },
            unlock(staffId) {
                let self = this;
                this.axios.put('/api/v1/user/admin/unblockUser', [staffId]).then((res) => {
                    self.tableData = res.data.content;
                    self.totalElements = res.data.totalElements;
                })
            }
        }
    }
</script>

<style>
</style>