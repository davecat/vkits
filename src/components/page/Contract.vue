<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="fa fa-dashboard"></i> 分期管理</el-breadcrumb-item>
                <el-breadcrumb-item>分期合同</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-row>
            <el-form :inline="true" :model="searchForm">
                <el-form-item label="合同编号：">
                    <el-input v-model="searchForm.code" placeholder="支持模糊查询"></el-input>
                </el-form-item>
                <el-form-item label="租客姓名：">
                    <el-input v-model="searchForm.name" placeholder="支持模糊查询"></el-input>
                </el-form-item>
                <el-form-item label="联系方式：">
                    <el-input v-model="searchForm.contact" placeholder="支持模糊查询"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="Search">查询</el-button>
                </el-form-item>
            </el-form>
        </el-row>
        <el-row>
            <el-radio-group v-model="radio">
                <el-radio-button label="还款中"></el-radio-button>
                <el-radio-button label="已结束"></el-radio-button>
                <el-radio-button label="提前退租"></el-radio-button>
                <el-radio-button label="违约"></el-radio-button>
            </el-radio-group>
        </el-row>
        <el-row>
            <el-table
                    ref="multipleTable"
                    :data="tableData"
                    border
                    tooltip-effect="dark"
                    style="width: 100%">
                <el-table-column
                        prop="agencyId"
                        label="申请编号">
                </el-table-column>
                <el-table-column
                        prop="code"
                        label="合同编号">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="最近应还款日期"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="enabled"
                        label="账单状态"
                        show-overflow-tooltip>
                    <template scope="scope">
                        {{ scope.row.enabled ? '正常':'逾期' }}
                    </template>
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="租客姓名">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="联系方式">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="租期">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="总金额">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="经纪人">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="门店名称">
                </el-table-column>
                <el-table-column label="操作">
                    <template scope="scope">
                        <el-tooltip class="item" effect="dark" content="查看" placement="top-end">
                            <el-button size="small" type="primary"
                                       @click="handleEdit(scope.row)"><i
                                    class="fa fa-pencil-square-o"></i>
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
                totalElements: 0,
                searchForm: {
                    code: '',
                    name: '',
                    enabled: 'true',
                },
                radio: ''
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
                this.axios.post('/api/v1/branch/getBranchPage', {
                    page: self.cur_page - 1,
                    size: self.size
                }).then((res) => {
                    self.tableData = res.data.content;
                    self.totalElements = res.data.totalElements;
                }).catch((error) => {
                    console.log(error);
                })
            },
            Search() {
                let self = this;
                this.axios.post('/api/v1/branch/getBranchPage', {
                    code: self.searchForm.code,
                    name: self.searchForm.name,
                    enabled: self.searchForm.enabled,
                    page: self.cur_page - 1,
                    size: self.size
                }).then((res) => {
                    self.tableData = res.data.content;
                    self.totalElements = res.data.totalElements;
                }).catch((error) => {
                    console.log(error);
                })
            }
        }
    }
</script>

<style>

</style>