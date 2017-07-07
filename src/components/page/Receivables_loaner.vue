<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="fa fa-dashboard"></i> 内部管理</el-breadcrumb-item>
                <el-breadcrumb-item>资金端放款</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-row>
            <el-form :inline="true" :model="searchForm">
                <el-form-item label="应收款日期：">
                    <el-date-picker
                            v-model="searchForm.applyDate"
                            align="right"
                            type="daterange"
                            placeholder="选择日期范围"
                            @change="selectedData"
                            :picker-options="pickerOptions">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="付款方（资金端）：">
                    <el-select v-model="searchForm.loanerId">
                        <el-option label="全部" value=""></el-option>
                        <el-option v-for="loaner in loanerList" :key="loaner.id" :label="loaner.name" :value="loaner.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="Search">查询</el-button>
                </el-form-item>
            </el-form>
        </el-row>
        <el-row>
            <el-tabs v-model="searchForm.type" type="card" @tab-click="handleChangeTab">
                <el-tab-pane label="应收款" name="receivables"></el-tab-pane>
                <el-tab-pane label="异常款项" name="exception"></el-tab-pane>
            </el-tabs>
            <el-table
                    :data="tableData"
                    border
                    tooltip-effect="dark"
                    highlight-current-row
                    @current-change="handleCurrentRow"
                    style="width: 100%">
                <el-table-column
                        prop="loanerName"
                        label="付款方">
                </el-table-column>
                <el-table-column
                        class-name="payerAmountFont"
                        prop="payeeTotalAmount"
                        label="付款金额">
                    <template scope="scope">
                        {{ scope.row.payeeTotalAmount | currency }}
                    </template>
                </el-table-column>
                <el-table-column
                        prop="contractCount"
                        label="合同数量">
                </el-table-column>
                <el-table-column
                        prop="payeeDate"
                        label="应收款日期">
                    <template scope="scope">
                        {{ scope.row.payeeDate | dateFormat }}
                    </template>
                </el-table-column>
                <el-table-column
                        class-name="statusGood"
                        prop="status"
                        label="状态">
                    <template scope="scope">
                        <p :class="{ statusAlert: scope.row.status === 'Unconfirmed' }">{{ scope.row.status === 'Unconfirmed'?'待确认':'已确认' }}</p>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="payeeBankAccount"
                        label="收款账号">
                </el-table-column>
                <el-table-column
                        label="操作">
                    <template scope="scope">
                        <el-tooltip class="item" effect="dark" content="确认收款" placement="top-end">
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

        <el-row>
            <el-table
                    :data="receivablesDetail"
                    stripe
                    style="width: 100%">
                <el-table-column
                        min-width="160"
                        prop="contractNo"
                        label="合同编号">
                </el-table-column>
                <el-table-column
                        min-width="160"
                        prop="payeeAmount"
                        label="合同金额">
                    <template scope="scope">
                        {{ scope.row.payeeAmount |  currency}}
                    </template>
                </el-table-column>
                <el-table-column
                        min-width="160"
                        prop="payeeDate"
                        label="应收款日期">
                    <template scope="scope">
                        {{ scope.row.payeeDate |  dateFormat}}
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                        @current-change="handleChange"
                        layout="prev, pager, next"
                        :total="detailTotalElements">
                </el-pagination>
            </div>
        </el-row>

        <el-dialog
                title="确认收款"
                :visible.sync="dialogVisible"
                size="tiny">
            <el-row>付款方： {{ selectedRow.loanerName }}</el-row>
            <el-row>付款金额： {{ selectedRow.payeeTotalAmount }}</el-row>
            <el-row>收款账号： {{ selectedRow.payeeBankAccount }}</el-row>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirm">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
    import { pagination } from '../mixins/pagination.js'
    import format from 'date-fns/format'
    export default {
        mixins: [pagination],
        data() {
            return {
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
                url: '/postlending/api/v1/payee/loaner/getPayeeLoanerPage',
                searchForm: {
                    applyDate: '',
                    payeeDateStart: '',
                    payeeDateEnd: '',
                    loanerId: '',
                    type: 'receivables'
                },
                receivablesDetail: [],
                detailCurPage: 1,
                detailSize: 10,
                detailTotalElements: 0,
                detailPage: 0,
                loanerList: {},
                dialogVisible: false,
                selectedRow: {}
            }
        },
        created(){
            this.getLoanerList();
        },
        filters: {
            dateFormat: function (value) {
                if(value !== null) {
                    return format(value, 'YYYY-MM-DD');
                }
            }
        },
        methods: {
            selectedData() {
                if (this.searchForm.applyDate[0] !== null) {
                    this.searchForm.payeeDateStart = format(this.searchForm.applyDate[0], 'YYYY-MM-DD');
                    this.searchForm.payeeDateEnd = format(this.searchForm.applyDate[1], 'YYYY-MM-DD');
                } else {
                    this.searchForm.payeeDateStart = '';
                    this.searchForm.payeeDateEnd = '';
                }
            },
            getLoanerList() {
                let self = this;
                this.axios.get('/riskcontrol/api/v1/loaner/getLoanerList').then((res) => {
                    self.loanerList = res.data;
                }).catch((error) => {
                    this.$message.error(error.response.data.message);
                })
            },
            handleChangeTab() {
                this.getData();
                this.receivablesDetail = [];
            },
            handleEdit(row) {
                this.selectedRow = Object.assign({},row);
                this.dialogVisible = true;
            },
            handleCurrentRow(row) {
                if(row) {
                    this.getDetail(row.loanerId, row.payeeDate, row.status);
                }
            },
            handleChange(val){
                this.detailCurPage = val;
                this.getDetail();
            },
            getDetail(loanerId, payeeDate, status) {
                let param = {
                    loanerId: loanerId,
                    payeeDate: format(payeeDate, 'YYYY-MM-DD'),
                    status: status,
                    page: this.detailCurPage - 1,
                    size: this.detailSize
                };
                this.axios.post('/postlending/api/v1/payee/loaner/getPayeeLoanerDetailPage', param).then((res) => {
                    this.receivablesDetail = res.data.content;
                    this.detailTotalElements = res.data.totalElements;
                }).catch((error) => {
                    this.$message.error(error.response.data.message);
                })
            },
            confirm() {
                let form = {
                    loanerId: this.selectedRow.loanerId,
                    payeeDate: format(this.selectedRow.payeeDate, 'YYYY-MM-DD'),
                };
                this.axios.post('/postlending/api/v1/payee/loaner/confirm', form).then((res) => {
                    this.getData();
                    this.dialogVisible = false;
                }).catch((error) => {
                    this.$message.error(error.response.data.message);
                })
            }
        }
    }
</script>

<style>
</style>