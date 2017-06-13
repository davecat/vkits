<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="fa fa-dashboard"></i> 控制台</el-breadcrumb-item>
                <el-breadcrumb-item>经纪人管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-row>
            <el-button type="primary">修改</el-button>
            <el-button type="primary">停用</el-button>
            <el-button type="primary">审批通过</el-button>
            <el-button type="primary">审批不通过</el-button>
        </el-row>
        <el-row>
            <el-form :inline="true" :model="form">
                <el-form-item label="姓名：">
                    <el-input v-model="form.name" placeholder="支持模糊查询"></el-input>
                </el-form-item>
                <el-form-item label="所属门店：">
                    <el-input v-model="form.name" placeholder="支持模糊查询"></el-input>
                </el-form-item>
                <el-form-item label="联系电话：">
                    <el-input v-model="form.name" placeholder="支持模糊查询"></el-input>
                </el-form-item>
                <el-form-item label="人员状态：">
                    <el-select v-model="form.status" placeholder="请选择">
                        <el-option label="启用" value="1"></el-option>
                        <el-option label="停用" value="0"></el-option>
                    </el-select>
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
                        label="人员编号">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="姓名">
                </el-table-column>
                <el-table-column
                        prop="branchAmount"
                        label="所属门店">
                </el-table-column>
                <el-table-column
                        prop="branchAmount"
                        label="联系电话">
                </el-table-column>
                <el-table-column
                        prop="branchAmount"
                        label="工号">
                </el-table-column>
                <el-table-column
                        prop="enabled"
                        label="人员状态"
                        show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                        prop="branchAmount"
                        label="操作">
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