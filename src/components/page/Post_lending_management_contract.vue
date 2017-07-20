<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="fa fa-dashboard"></i> 内部管理</el-breadcrumb-item>
                <el-breadcrumb-item>分期合同</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-row>
            <el-form :inline="true" :model="searchForm">
                <el-form-item label="所属中介：">
                    <el-select v-model="searchForm.agencyId">
                        <el-option label="全部" value=""></el-option>
                        <el-option v-for="agency in agencyList" :key="agency.id" :label="agency.name" :value="agency.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="资金端：">
                    <el-select v-model="searchForm.loanerId">
                        <el-option label="全部" value=""></el-option>
                        <el-option v-for="loaner in loanerList" :key="loaner.id" :label="loaner.name" :value="loaner.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="申请编号：">
                    <el-input v-model="searchForm.applicationNo" placeholder="支持模糊查询"></el-input>
                </el-form-item>
                <el-form-item label="合同编号：">
                    <el-input v-model="searchForm.contractNo" placeholder="支持模糊查询"></el-input>
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
                    <el-input v-model="searchForm.customerName" placeholder="支持模糊查询"></el-input>
                </el-form-item>
                <el-form-item label="联系方式：">
                    <el-input v-model="searchForm.mobile" placeholder="支持模糊查询"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="Search">查询</el-button>
                </el-form-item>
            </el-form>
        </el-row>
        <el-row>
            <el-tabs v-model="searchForm.status" type="card" @tab-click="handleChange">
                <el-tab-pane label="还款中" name="Repayment">
                    <span slot="label">还款中<el-badge  :value="suppleNumber" class="item"></el-badge></span>
                </el-tab-pane>
                <el-tab-pane label="已逾期" name="Overdue">
                    <span slot="label">已逾期<el-badge  :value="overdueNumber" class="item"></el-badge></span>
                </el-tab-pane>
                <el-tab-pane label="已结束" name="Finished"></el-tab-pane>
                <el-tab-pane label="提前退租未还款" name="ExitNotRepaid"></el-tab-pane>
                <el-tab-pane label="提前退租已还款" name="ExitRepaid"></el-tab-pane>
                <el-tab-pane label="已签署" name="Signed"></el-tab-pane>
            </el-tabs>
            <el-table
                    :data="tableData"
                    border
                    tooltip-effect="dark"
                    highlight-current-row
                    @current-change="handleCurrentRow"
                    style="width: 100%">
                <el-table-column
                        min-width="140"
                        prop="agencyName"
                        label="中介名称">
                </el-table-column>
                <el-table-column
                        min-width="180"
                        prop="applicationNo"
                        label="申请编号">
                </el-table-column>
                <el-table-column
                        min-width="180"
                        prop="contractNo"
                        label="合同编号">
                </el-table-column>
                <el-table-column
                        min-width="140"
                        prop="overdueDays"
                        label="账单状态">
                    <template scope="scope">
                        {{ scope.row.overdueDays |  overdueDaysFormat}}
                    </template>
                </el-table-column>
                <el-table-column
                        min-width="140"
                        prop="customerName"
                        label="租客姓名">
                </el-table-column>
                <el-table-column
                        min-width="160"
                        prop="mobile"
                        label="租客联系方式">
                </el-table-column>
                <el-table-column
                        min-width="180"
                        prop="startDate"
                        label="起止日期">
                    <template scope="scope">
                        {{ scope.row.startDate |  dateFormat}} - {{ scope.row.endDate |  dateFormat}}
                    </template>
                </el-table-column>
                <el-table-column
                        min-width="160"
                        prop="monthlyRent"
                        label="月租金">
                    <template scope="scope">
                        {{ scope.row.monthlyRent | currency }}
                    </template>
                </el-table-column>
                <el-table-column
                        min-width="140"
                        prop="rentPeriod"
                        label="分期期数">
                </el-table-column>
                <el-table-column
                        min-width="120"
                        prop="serviceFee"
                        label="手续费">
                    <template scope="scope">
                        {{ scope.row.serviceFee | currency }}
                    </template>
                </el-table-column>
                <el-table-column
                        min-width="160"
                        prop="totalAmount"
                        label="分期总金额">
                    <template scope="scope">
                        {{ scope.row.totalAmount | currency }}
                    </template>
                </el-table-column>
                <el-table-column
                        min-width="180"
                        prop="city"
                        label="城市">
                    <template scope="scope">
                        {{ scope.row.province | districtFormat }}-{{ scope.row.city | districtFormat }}-{{
                        scope.row.district | districtFormat }}
                    </template>
                </el-table-column>
                <el-table-column
                        min-width="180"
                        prop="responsibleAgent"
                        label="签单经纪人">
                    <template scope="scope">
                        {{ scope.row.responsibleBranch }} - {{ scope.row.responsibleAgent }}
                    </template>
                </el-table-column>
                <el-table-column
                        min-width="150"
                        prop="loanerName"
                        label="资金端名称">
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                        @current-change="handleCurrentChange"
                        layout="total, prev, pager, next"
                        :total="totalElements">
                </el-pagination>
            </div>
        </el-row>
        <el-row>
            <el-table
                    :data="billsData"
                    border
                    tooltip-effect="dark"
                    style="width: 100%">
                <el-table-column
                        type="index"
                        width="50">
                </el-table-column>
                <el-table-column
                        min-width="160"
                        prop="paymentDueDate"
                        label="应还款日期">
                    <template scope="scope">
                        {{ scope.row.paymentDueDate |  dateFormat}}
                    </template>
                </el-table-column>
                <el-table-column
                        min-width="160"
                        prop="amount"
                        label="账单金额">
                    <template scope="scope">
                        {{ scope.row.amount | currency }}
                    </template>
                </el-table-column>
                <el-table-column
                        min-width="160"
                        prop="serviceFee"
                        label="手续费">
                    <template scope="scope">
                        {{ scope.row.serviceFee | currency }}
                    </template>
                </el-table-column>
                <el-table-column
                        min-width="160"
                        prop="overdueFee"
                        label="逾期费用">
                    <template scope="scope">
                        {{ scope.row.overdueFee | currency }}
                    </template>
                </el-table-column>
                <el-table-column
                        min-width="160"
                        prop="status"
                        label="账单状态">
                    <template scope="scope">
                        {{ scope.row.status |  billStatusFormat}}
                    </template>
                </el-table-column>
                <el-table-column
                        min-width="160"
                        prop="paymentDate"
                        label="实际还款日期">
                    <template scope="scope">
                        {{ scope.row.paymentDate |  dateFormat }}
                    </template>
                </el-table-column>
            </el-table>
        </el-row>
    </div>
</template>

<script>
    import { pagination } from '../mixins/pagination.js'
    import format from 'date-fns/format'
    import json from "../../../static/city.json";
    export default {
        mixins: [pagination],
        data() {
            return {
                suppleNumber: 0,
                overdueNumber: 0,
                multipleSelection: [],
                multipleEditButton: false,
                agencyList: {},
                branchList: {},
                loanerList: {},
                searchForm: {
                    applicationNo: '',
                    contractNo: '',
                    applyDate: '',
                    startDate: '',
                    endDate: '',
                    customerName: '',
                    agencyId: '',
                    loanerId: '',
                    mobile: '',
                    status: 'Repayment'
                },
                pickerOptions: {
                    shortcuts: [
                        {
                            text: '今日',
                            onClick(picker) {
                                const end = new Date();
                                const start = new Date();
                                picker.$emit('pick', [start, end]);
                            }
                        },
                        {
                            text: '最近三天',
                            onClick(picker) {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 3);
                                picker.$emit('pick', [start, end]);
                            }
                        },
                        {
                            text: '最近七天',
                            onClick(picker) {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                                picker.$emit('pick', [start, end]);
                            }
                        },
                        {
                            text: '最近三十天',
                            onClick(picker) {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                                picker.$emit('pick', [start, end]);
                            }
                        }
                    ]
                },
                url: '/postlending/api/v1/contract/getContractPage',
                billsData: []
            }
        },
        created(){
            //还款中单据
            let searchForm1 = {
                applicationNo: '',
                contractNo: '',
                applyDate: '',
                startDate: '',
                endDate: '',
                customerName: '',
                agencyId: '',
                loanerId: '',
                mobile: '',
                status: 'Repayment'
            };
            this.axios.post(this.url, {
                ...searchForm1,
                page: this.cur_page - 1,
                size: this.size
            }).then((res) => {
                this.suppleNumber = res.data.totalElements;
            }).catch((error) => {
                this.$message.error(error.response.data.message);
            });
            //已逾期单据
            let searchForm2 = {
                applicationNo: '',
                contractNo: '',
                applyDate: '',
                startDate: '',
                endDate: '',
                customerName: '',
                agencyId: '',
                loanerId: '',
                mobile: '',
                status: 'Overdue'
            };
            this.axios.post(this.url, {
                ...searchForm2,
                page: this.cur_page - 1,
                size: this.size
            }).then((res) => {
                this.overdueNumber = res.data.totalElements;
            }).catch((error) => {
                this.$message.error(error.response.data.message);
            });
            this.getAgencyList();
            this.getLoanerList();
        },
        filters: {
            overdueDaysFormat: function (value) {
                if (value === -2) {
                    return "未生成";
                } else if (value === -1) {
                    return "已还清";
                } else if (value === 0) {
                    return "正常";
                } else if (value > 0) {
                    return "逾期";
                }
            },
            dateFormat: function (value) {
                if (typeof value === "string") {
                    let date = Date.parse(value.substring(0, value.length - 9))
                    return format(date, 'YYYYMMDD')
                }
            },
            billStatusFormat: function (value) {
                if (value === 'NotRepayment') {
                    return "未还款";
                } else if (value === 'EndRepayment') {
                    return "已还款";
                } else if (value === 'OverdueRepayment') {
                    return "逾期未还款";
                }
            },
            districtFormat: function (value) {
                if(!value){
                    return ''
                }
                let district;
                let findLabel = (item, value) => {
                    if(item) {
                        return item.some(i => {
                            if (value === i.value) {
                                district = i;
                                return true;
                            } else {
                                return findLabel(i.children, value)
                            }
                        });
                    }
                };
                findLabel(json, value);
                return district.label;
            },
        },
        methods: {
            selectedData() {
                if (this.searchForm.applyDate[0] !== null) {
                    this.searchForm.startDate = format(this.searchForm.applyDate[0], 'YYYY-MM-DD');
                    this.searchForm.endDate = format(this.searchForm.applyDate[1], 'YYYY-MM-DD');
                } else {
                    this.searchForm.startDate = '';
                    this.searchForm.endDate = '';
                }
            },
            handleChange() {
                this.getData();
                this.billsData = [];
            },
            handleCurrentRow(currentRow) {
                this.billsData = currentRow.bills;
            },
            getAgencyList() {
                this.axios.get('/api/v1/admin/agency/getAgencyList').then((res) => {
                    this.agencyList = res.data;
                }).catch((error) => {
                    this.$message.error(error.response.data.message);
                })
            },
            getLoanerList() {
                let self = this;
                this.axios.get('/riskcontrol/api/v1/loaner/getLoanerList').then((res) => {
                    self.loanerList = res.data;
                }).catch((error) => {
                    this.$message.error(error.response.data.message);
                })
            },
        }
    }
</script>

<style>
    .item {
        margin-left: 4px;
        vertical-align: sub;
    }
</style>