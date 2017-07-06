<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="fa fa-dashboard"></i> 内部管理</el-breadcrumb-item>
                <el-breadcrumb-item>中介合同款</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-row>
            <el-form :inline="true" :model="searchForm">
                <el-form-item label="应付款日期：">
                    <el-date-picker
                            v-model="searchForm.applyDate"
                            align="right"
                            type="daterange"
                            placeholder="选择日期范围"
                            @change="selectedData"
                            :picker-options="pickerOptions">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="中介名称：">
                    <el-select v-model="searchForm.agencyId">
                        <el-option label="全部" value=""></el-option>
                        <el-option v-for="agency in agencyList" :key="agency.id" :label="agency.name" :value="agency.id"></el-option>
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
                    ref="multipleTable"
                    :data="tableData"
                    border
                    tooltip-effect="dark"
                    highlight-current-row
                    @current-change="handleCurrentRow"
                    style="width: 100%">
                <el-table-column
                        prop="payerDate"
                        label="应付款日期">
                    <template scope="scope">
                        {{ scope.row.payerDate | dateFormat }}
                    </template>
                </el-table-column>
                <el-table-column
                        prop="agencyName"
                        label="收款方">
                </el-table-column>
                <el-table-column
                        prop="payee.bank"
                        label="收款开户银行">
                </el-table-column>
                <el-table-column
                        prop="payee.name"
                        label="开户人">
                </el-table-column>
                <el-table-column
                        prop="payee.accountNumber"
                        label="收款银行账号">
                </el-table-column>
                <el-table-column
                        prop="totalAmount"
                        label="房租总金额">
                    <template scope="scope">
                        {{ scope.row.totalAmount | currency }}
                    </template>
                </el-table-column>
                <el-table-column
                        prop="payerAmount"
                        label="代付金额">
                    <template scope="scope">
                        {{ scope.row.payerAmount | currency }}
                    </template>
                </el-table-column>
                <el-table-column
                        prop="status"
                        label="状态">
                    <template scope="scope">
                        {{ scope.row.status === 'Unconfirmed'?'待确认':'已确认' }}
                    </template>
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
            <el-col :span="4">
                应付款明细:
            </el-col>
            <el-col :span="5">
                支付方式: {{ currentRow.payerType }}
            </el-col>
            <el-col :span="5">
                付款银行: {{ currentRow.payer.bank }}
            </el-col>
            <el-col :span="5">
                付款账号: {{ currentRow.payer.accountNumber }}
            </el-col>
            <el-col :span="5">
                实际付款日期: {{ currentRow.factPayerDate }}
            </el-col>
        </el-row>

        <el-row>
            <el-table
                    :data="payablesDetail"
                    border
                    tooltip-effect="dark"
                    style="width: 100%">
                <el-table-column
                        min-width="160"
                        prop="billNo"
                        label="合同编号">
                </el-table-column>
                <el-table-column
                        min-width="160"
                        prop="amount"
                        label="房租总金额">
                    <template scope="scope">
                        {{ scope.row.amount |  currency}}
                    </template>
                </el-table-column>
                <el-table-column
                        min-width="160"
                        prop="paymentDueDate"
                        label="代付金额">
                    <template scope="scope">
                        {{ scope.row.paymentDueDate |  dateFormat}}
                    </template>
                </el-table-column>
                <el-table-column
                        min-width="160"
                        prop="serviceFee"
                        label="服务费率">
                    <template scope="scope">
                        {{ scope.row.serviceFee |  currency}}
                    </template>
                </el-table-column>
                <el-table-column
                        min-width="160"
                        prop="overdueFee"
                        label="服务费金额">
                    <template scope="scope">
                        {{ scope.row.overdueFee |  currency}}
                    </template>
                </el-table-column>
            </el-table>
        </el-row>

        <el-dialog
                title="确认收款"
                :visible.sync="dialogVisible"
                size="tiny">
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
    import ElRow from "element-ui/packages/row/src/row";
    import ElCol from "element-ui/packages/col/src/col";
    export default {
        components: {
            ElCol,
            ElRow},
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
                url: '/postlending/api/v1/payee/loaner/getPayerAgencyPage',
                searchForm: {
                    applyDate: '',
                    payeeDateStart: '',
                    payeeDateEnd: '',
                    agencyId: '',
                    type: 'receivables'
                },
                currentRow: {
                    payer: {
                        bank: '',
                        accountNumber: '',
                    }
                },
                agencyList: {},
                dialogVisible: false,
                payablesDetail: []
            }
        },
        created(){
            this.getAgencyList();
        },
        filters: {
            dateFormat: function (value) {
                if(value !== null) {
                    return format(value, 'YYYY-MM-DD');
                }
            }
        },
        methods: {
            getAgencyList() {
                this.axios.get('/api/v1/agency/getAgencyList').then((res) => {
                    this.agencyList = res.data;
                }).catch((error) => {
                    this.$message.error(error.response.data.message);
                })
            },
            selectedData() {
                if (this.searchForm.applyDate[0] !== null) {
                    this.searchForm.payeeDateStart = format(this.searchForm.applyDate[0], 'YYYY-MM-DD');
                    this.searchForm.payeeDateEnd = format(this.searchForm.applyDate[1], 'YYYY-MM-DD');
                } else {
                    this.searchForm.payeeDateStart = '';
                    this.searchForm.payeeDateEnd = '';
                }
            },
            handleChangeTab() {
                this.getData();
            },
            handleEdit(row) {
                this.selectedRow = row;
                this.dialogVisible = true;
            },
            handleCurrentRow(row) {
                this.currentRow = row;
                this.currentRow.payer = {bank: '', accountNumber: '',}
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