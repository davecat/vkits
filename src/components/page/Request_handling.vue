<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="fa fa-dashboard"></i> 分期管理</el-breadcrumb-item>
                <el-breadcrumb-item>分期申请</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-row>
            <el-button type="primary">批量通过申请</el-button>
            <el-button type="primary">生成日结确认</el-button>
        </el-row>
        <el-row>
            <el-form :inline="true" :model="searchForm">
                <el-form-item label="所属中介：">
                    <el-select v-model="searchForm.agencyId" @change="getBranchList(searchForm.agencyId)">
                        <el-option label="全部" value=""></el-option>
                        <el-option v-for="agency in agencyList" :key="agency.id" :label="agency.name" :value="agency.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="所属门店：">
                    <el-select v-model="searchForm.branchId">
                        <el-option label="全部" value=""></el-option>
                        <el-option v-for="branch in branchList" :key="branch.id" :label="branch.name" :value="branch.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="申请编号：">
                    <el-input v-model="searchForm.name" placeholder="支持模糊查询"></el-input>
                </el-form-item>
                <el-form-item label="起租日期：">
                    <el-date-picker
                            v-model="searchForm.applyDate"
                            align="right"
                            type="daterange"
                            placeholder="选择日期范围"
                            @change="selectedData"
                            :picker-options="pickerOptions">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="租客姓名：">
                    <el-input v-model="searchForm.name" placeholder="支持模糊查询"></el-input>
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
                    highlight-current-row
                    @current-change="handleCurrentRow"
                    border
                    tooltip-effect="dark"
                    style="width: 100%"
                    @selection-change="handleSelectionChange">
                <el-table-column
                        fixed
                        type="selection"
                        width="80">
                </el-table-column>
                <el-table-column
                        min-width="180"
                        prop="id"
                        label="中介名称">
                </el-table-column>
                <el-table-column
                        min-width="180"
                        prop="id"
                        label="申请编号">
                </el-table-column>
                <el-table-column
                        min-width="150"
                        prop="startDate"
                        label="起租日期">
                    <template scope="scope">
                        {{ scope.row.startDate | dateFormat }}
                    </template>
                </el-table-column>
                <el-table-column
                        min-width="150"
                        prop="customerName"
                        label="租客姓名">
                </el-table-column>
                <el-table-column
                        min-width="180"
                        prop="mobile"
                        label="联系方式">
                </el-table-column>
                <el-table-column
                        min-width="120"
                        prop="monthlyRent"
                        label="月租金">
                </el-table-column>
                <el-table-column
                        min-width="120"
                        prop="rentPeriod"
                        label="租期">
                </el-table-column>
                <el-table-column
                        min-width="120"
                        prop=""
                        label="总金额">
                    <template scope="scope">
                        {{ scope.row.monthlyRent * scope.row.rentPeriod }}
                    </template>
                </el-table-column>
                <el-table-column
                        min-width="120"
                        prop="responsibleAgent"
                        label="经纪人">
                </el-table-column>
                <el-table-column
                        min-width="150"
                        prop="responsibleBranch"
                        label="门店名称">
                </el-table-column>
                <el-table-column
                        fixed="right"
                        min-width="110"
                        prop="enabled"
                        label="操作">
                    <template scope="scope">
                        <el-tooltip v-if="searchForm.status === 'Unchecked' || searchForm.status === 'Returned'"
                                    class="item" effect="dark" content="补充／修改分期申请" placement="top-end">
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
    import ElRow from "element-ui/packages/row/src/row";
    export default {
        components: {ElRow},
        data() {
            return {
                tableData: [],
                multipleSelection: [],
                cur_page: 1,
                size: 10,
                totalElements: 0,
                agencyList: {},
                branchList: {},
                searchForm: {
                    applictionNo: '',
                    applyDate: '',
                    startDate: '',
                    endDate: '',
                    customerName: '',
                    agencyId: '',
                    branchId: '',
                    status: 'Unconfirmed'
                },
                form: {}
            }
        },
        created(){
            this.getData();
            this.getAgencyList();
        },
        methods: {
            handleCurrentChange(val){
                this.cur_page = val;
                this.getData();
            },
            getData(){
                let self = this;
                this.axios.post('/riskcontrol/loaner/api/v1/application/getApplicationPage', {
                    applictionNo: self.searchForm.applictionNo,
                    startDate: self.searchForm.startDate,
                    endDate: self.searchForm.endDate,
                    customerName: self.searchForm.customerName,
                    agencyId: self.searchForm.agencyId,
                    branchId: self.searchForm.branchId,
                    status: self.searchForm.status,
                    page: self.cur_page - 1,
                    size: self.size
                }).then((res) => {
                    self.tableData = res.data.content;
                    self.totalElements = res.data.totalElements;
                })
            },
            getAgencyList() {
                this.axios.get('/api/v1/agency/getAgencyList').then((res) => {
                    this.agencyList = res.data;
                }).catch((error) => {
                    this.$message.error(error.response.data.message);
                })
            },
            getBranchList(agencyId) {
                if(agencyId !== '') {
                    this.axios.get('/api/v1/branch/getBranchListByAgencyId/' + agencyId).then((res) => {
                        this.branchList = res.data;
                    }).catch((error) => {
                        this.$message.error(error.response.data.message);
                    })
                } else {
                    this.searchForm.branchId = '';
                    this.branchList = [];
                }
            },
            handleEdit(index, row) {
                this.$message('编辑第' + (index + 1) + '行');
            },
            handleDelete(index, row) {
                this.$message.error('删除第' + (index + 1) + '行');
            },
            Search() {
                this.getData();
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            }
        }
    }
</script>

<style>

</style>