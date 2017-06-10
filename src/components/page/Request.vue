<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="fa fa-dashboard"></i> 分期管理</el-breadcrumb-item>
                <el-breadcrumb-item>分期申请</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-row>
            <el-button type="primary">补充／修改申请信息</el-button>
        </el-row>
        <el-row>
            <el-form :inline="true" :model="form">
                <el-form-item label="申请编号：">
                    <el-input v-model="form.id" placeholder="支持模糊查询"></el-input>
                </el-form-item>
                <el-form-item label="申请日期：">
                    <el-input v-model="form.name" placeholder="支持模糊查询"></el-input>
                </el-form-item>
                <el-form-item label="租客姓名：">
                    <el-input v-model="form.name" placeholder="支持模糊查询"></el-input>
                </el-form-item>
                <el-form-item label="门店：">
                    <el-input v-model="form.name" placeholder="支持模糊查询"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="Search">查询</el-button>
                </el-form-item>
            </el-form>
        </el-row>
        <el-row>
            <el-table
                    ref="multipleTable"
                    :data="tableData"
                    border
                    tooltip-effect="dark"
                    style="width: 100%"
                    @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="80">
                </el-table-column>
                <el-table-column
                        prop="code"
                        label="申请编号">
                </el-table-column>
                <el-table-column
                        prop="code"
                        label="申请日期">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="租客姓名">
                </el-table-column>
                <el-table-column
                        prop="branchAmount"
                        label="联系方式">
                </el-table-column>
                <el-table-column
                        prop="branchAmount"
                        label="月租金">
                </el-table-column>
                <el-table-column
                        prop="branchAmount"
                        label="租期">
                </el-table-column>
                <el-table-column
                        prop="branchAmount"
                        label="手续费（元／期）">
                </el-table-column>
                <el-table-column
                        prop="branchAmount"
                        label="总金额">
                </el-table-column>
                <el-table-column
                        prop="branchAmount"
                        label="经纪人">
                </el-table-column>
                <el-table-column
                        prop="branchAmount"
                        label="门店名称">
                </el-table-column>
                <el-table-column
                        prop="enabled"
                        label="操作"
                        show-overflow-tooltip>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                        @current-change="handleCurrentChange"
                        layout="prev, pager, next"
                        :total="totalElements">
                </el-pagination>
            </div>
        </el-row>

    </div>
</template>

<script>
    export default {
        data() {
            return {
                tableData: [],
                multipleSelection: [],
                cur_page: 1,
                size: 10,
                totalElements: 0,
                form: {}
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
                this.axios.post('/api/v1/agency/getAgencyPage', {
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
            handleDelete(index, row) {
                this.$message.error('删除第' + (index + 1) + '行');
            },
            Search() {
                console.log("Search")
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            }
        }
    }
</script>

<style>

</style>