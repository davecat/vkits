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
                        <el-option v-for="agency in agencyList" :key="agency.id" :label="agency.name"
                                   :value="agency.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="实际收款日期：">
                    <el-date-picker
                            v-model="searchForm.applyDate2"
                            align="right"
                            type="daterange"
                            placeholder="选择日期范围"
                            @change="selectedData2"
                            :picker-options="pickerOptions">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="状态：">
                    <el-select v-model="searchForm.status">
                        <el-option label="待确认" value="Unconfirmed"></el-option>
                        <el-option label="已确认" value="Accepted"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="Search">查询</el-button>
                </el-form-item>
            </el-form>
        </el-row>
        <el-row>
            <el-tabs v-model="searchForm.type" type="card" @tab-click="handleChangeTab">
                <el-tab-pane label="应付款" name="receivables"></el-tab-pane>
                <el-tab-pane label="异常款项" name="exception"></el-tab-pane>
            </el-tabs>
            <el-table
                    :data="tableData"
                    stripe
                    max-height="500"
                    :default-sort="{prop: 'payerDate', order: 'descending'}"
                    highlight-current-row
                    @current-change="handleCurrentRow"
                    style="width: 100%">
                <el-table-column
                        min-width="140"
                        prop="payerDate"
                        sortable
                        label="应付款日期">
                    <template scope="scope">
                        {{ scope.row.payerDate | dateFormat }}
                    </template>
                </el-table-column>
                <el-table-column
                        min-width="120"
                        prop="agencyName"
                        label="收款方">
                </el-table-column>
                <el-table-column
                        min-width="160"
                        prop="payee.bank"
                        label="收款开户银行">
                </el-table-column>
                <el-table-column
                        min-width="100"
                        prop="payee.name"
                        label="开户人">
                </el-table-column>
                <el-table-column
                        min-width="160"
                        prop="payee.accountNumber"
                        label="收款银行账号">
                </el-table-column>
                <el-table-column
                        min-width="120"
                        prop="contractCount"
                        label="合同数量">
                </el-table-column>
                <el-table-column
                        min-width="120"
                        prop="totalAmount"
                        label="房租总金额">
                    <template scope="scope">
                        {{ scope.row.totalAmount | currency }}
                    </template>
                </el-table-column>
                <el-table-column
                        min-width="120"
                        class-name="payerAmountFont"
                        prop="payerAmount"
                        label="代付金额">
                    <template scope="scope">
                        {{ scope.row.payerAmount | currency }}
                    </template>
                </el-table-column>
                <el-table-column
                        min-width="100"
                        class-name="statusGood"
                        prop="status"
                        label="状态">
                    <template scope="scope">
                        <p :class="{ statusAlert: scope.row.status === 'Unconfirmed' }">{{ scope.row.status ===
                            'Unconfirmed'?'待确认':'已确认' }}</p>
                    </template>
                </el-table-column>
                <el-table-column
                        min-width="120"
                        label="操作">
                    <template scope="scope">
                        <el-tooltip class="item" effect="dark" content="确认放款" placement="top-end" v-if="scope.row.status === 'Unconfirmed'">
                            <el-button size="small" type="primary"
                                       @click="handleEdit(scope.row)"><i
                                    class="fa fa-pencil-square-o"></i>
                            </el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="取消确认" placement="top-end" v-else>
                            <el-button size="small" type="warning"
                                       @click="unConfirmShow(scope.row)"><i
                                    class="fa fa-repeat"></i>
                            </el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="导出" placement="top-end">
                            <el-button size="small" type="success"
                                       @click="exportCSV(scope.row)"><i class="fa fa-save"></i>
                            </el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <!--<div class="pagination">-->
            <!--<el-pagination-->
            <!--@current-change="handleCurrentChange"-->
            <!--layout="prev, pager, next"-->
            <!--:total="totalElements">-->
            <!--</el-pagination>-->
            <!--</div>-->
        </el-row>

        <el-row>
            <el-col :span="4">
                应付款明细:
            </el-col>
            <el-col :span="5">
                支付方式: {{ currentRow.payerType==='BankTransfer'?'银行转账':'' }}
            </el-col>
            <el-col :span="5">
                付款银行: {{ currentRow.payer.bank }}
            </el-col>
            <el-col :span="5">
                付款账号: {{ currentRow.payer.accountNumber }}
            </el-col>
            <el-col :span="5">
                实际付款日期: {{ currentRow.factPayerDate | dateFormat }}
            </el-col>
        </el-row>

        <el-row>
            <el-table
                    :data="payablesDetail"
                    stripe
                    style="width: 100%">
                <el-table-column
                        min-width="160"
                        prop="contractNo"
                        label="合同编号">
                </el-table-column>
                <el-table-column
                        min-width="160"
                        prop="customerName"
                        label="租客姓名">
                </el-table-column>
                <el-table-column
                        min-width="160"
                        prop="totalAmount"
                        label="房租总金额">
                    <template scope="scope">
                        {{ scope.row.totalAmount | currency}}
                    </template>
                </el-table-column>
                <el-table-column
                        min-width="160"
                        prop="payerAmount"
                        label="代付金额">
                    <template scope="scope">
                        {{ scope.row.payerAmount | currency}}
                    </template>
                </el-table-column>
                <el-table-column
                        min-width="160"
                        prop="rate"
                        label="服务费率">
                    <template scope="scope">
                        {{ scope.row.rate }}
                    </template>
                </el-table-column>
                <el-table-column
                        min-width="160"
                        prop="serviceFee"
                        label="服务费金额">
                    <template scope="scope">
                        {{ scope.row.serviceFee | currency}}
                    </template>
                </el-table-column>
                <el-table-column
                        min-width="160"
                        prop="factPayerDate"
                        label="实际付款日期">
                    <template scope="scope">
                        {{ scope.row.factPayerDate |  dateFormat}}
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

        <el-dialog title="确认付款" :visible.sync="dialogVisible">
            <el-form :model="form" ref="form" :rules="rules">
                <el-form-item label="实际付款日期：" :label-width="formLabelWidth" prop="factPayerDate">
                    <el-date-picker
                            v-model="form.factPayerDate"
                            type="date"
                            placeholder="选择日期"
                            :default-value="form.factPayerDate"
                            :picker-options="pickerOptions0">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="支付方式：" :label-width="formLabelWidth" prop="payerType">
                    <el-select v-model="form.payerType">
                        <el-option label="银行转账" value="BankTransfer"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="付款银行：" :label-width="formLabelWidth" prop="bank">
                    <el-input v-model="form.bank"></el-input>
                </el-form-item>
                <el-form-item label="付款账号：" :label-width="formLabelWidth" prop="accountNumber">
                    <el-input v-model="form.accountNumber"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="resetForm('form')">取 消</el-button>
                <el-button type="primary" @click="confirm">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog
                title="取消确认付款"
                :visible.sync="dialogVisible2"
                size="tiny">
            <p>此操作将取消确认付款，该付款记录状态变更为 “待确认”，确认操作？</p>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible2=false">取 消</el-button>
                <el-button type="primary" @click="unConfirm">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
    import {pagination} from '../mixins/pagination.js'
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
                url: '/postlending/api/v1/payer/agency/getPayerAgencyPage',
                searchForm: {
                    applyDate: '',
                    applyDate2: '',
                    payeeDateStart: '',
                    payeeDateEnd: '',
                    factPayerDateStart: '',
                    factPayerDateEnd: '',
                    agencyId: '',
                    type: 'receivables'
                },
                currentRow: {
                    payer: {
                        bank: '',
                        accountNumber: '',
                    }
                },
                form: {
                    factPayerDate: Date.now()
                },
                agencyList: {},
                dialogVisible: false,
                dialogVisible2: false,
                unConfirmRow: {},
                payablesDetail: [],
                detailCurPage: 1,
                detailSize: 10,
                detailTotalElements: 0,
                detailPage: 0,
                formLabelWidth: '120px',
                rules: {
                    factPayerDate: [{type: 'date', required: true, message: '请选择日期', trigger: 'blur'}],
                    bank: [{required: true, message: '请输入银行', trigger: 'blur'}],
                    accountNumber: [{required: true, message: '请输入账号', trigger: 'blur'}],
                    payerType: [{required: true, message: '请选择类型', trigger: 'change'}]
                },
                pickerOptions0: {
                    disabledDate(time) {
                        return time.getTime() < Date.now() - 8.64e7;
                    }
                },
            }
        },
        created(){
            this.getAgencyList();
        },
        filters: {
            dateFormat: function (value) {
                if (typeof value === "string") {
                    return value.substring(0, value.length - 9)
                }
            },
        },
        methods: {
            getAgencyList() {
                this.axios.get('/api/v1/admin/agency/getAgencyList').then((res) => {
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
            selectedData2() {
                if (this.searchForm.applyDate2[0] !== null) {
                    this.searchForm.factPayerDateStart = format(this.searchForm.applyDate2[0], 'YYYY-MM-DD');
                    this.searchForm.factPayerDateEnd = format(this.searchForm.applyDate2[1], 'YYYY-MM-DD');
                } else {
                    this.searchForm.factPayerDateStart = '';
                    this.searchForm.factPayerDateEnd = '';
                }
            },
            handleChangeTab() {
                this.getData();
            },
            handleEdit(row) {
                this.form.agencyId = row.agencyId || '';
                this.form.payerDate = row.payerDate || '';
                this.form.factPayerDate = row.factPayerDate || Date.now();
                this.form.payerType = row.payerType || 'BankTransfer';
                this.form.payer = row.payer || {};
                this.form.accountNumber = this.form.payer.accountNumber || '';
                this.form.bank = this.form.payer.accountNumber || '';
                this.dialogVisible = true;
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
                this.form = {factPayerDate: Date.now()};
                this.dialogVisible = false;
            },
            handleCurrentRow(row) {
                if (row) {
                    this.currentRow.factPayerDate = row.factPayerDate || '';
                    this.currentRow.payerType = row.payerType || '';
                    this.currentRow.payer = row.payer || '';
                    this.currentRow.agencyId = row.agencyId || '';
                    this.currentRow.payerDate = row.payerDate || '';
                    this.currentRow.status = row.status || '';
                    this.getDetail();
                }
            },
            handleChange(val){
                this.detailCurPage = val;
                this.getDetail();
            },
            getDetail() {
                let param = {
                    agencyId: this.currentRow.agencyId,
                    payerDate: format(this.currentRow.payerDate, 'YYYY-MM-DD'),
                    status: this.currentRow.status,
                    page: this.detailCurPage - 1,
                    size: this.detailSize
                };
                this.axios.post('/postlending/api/v1/payer/agency/getPayerAgencyDetailPage', param).then((res) => {
                    this.payablesDetail = res.data.content;
                    this.detailTotalElements = res.data.totalElements;
                }).catch((error) => {
                    this.$message.error(error.response.data.message);
                })
            },
            confirm() {
                let form = {
                    bank: this.form.bank,
                    accountNumber: this.form.accountNumber,
                    payerType: this.form.payerType,
                    factPayerDate: format(this.form.factPayerDate, 'YYYY-MM-DD'),
                    agencyId: this.form.agencyId,
                    payerDate: format(this.form.payerDate, 'YYYY-MM-DD'),
                };
                this.axios.post('/postlending/api/v1/payer/agency/confirm', form).then((res) => {
                    this.getData();
                    this.dialogVisible = false;
                }).catch((error) => {
                    this.$message.error(error.response.data.message);
                })
            },
            unConfirmShow(row) {
                this.unConfirmRow = row;
                this.dialogVisible2 = true;
            },
            unConfirm() {
                let form = {
                    agencyId: this.unConfirmRow.agencyId,
                    payerDate: format(this.unConfirmRow.payerDate, 'YYYY-MM-DD'),
                };
                this.axios.post('/postlending/api/v1/payer/agency/backConfirm', form).then((res) => {
                    this.getData();
                    this.dialogVisible2 = false;
                }).catch((error) => {
                    this.$message.error(error.response.data.message);
                })
            },
            exportCSV(row) {
                var head = [["合同编号", "租客姓名", "房租总金额", "代付金额", "服务费率", "服务费金额"]];
                let param = {
                    agencyId: row.agencyId,
                    payerDate: format(row.payerDate, 'YYYY-MM-DD'),
                    status: row.status,
                };
                this.axios.post('/postlending/api/v1/payer/agency/getPayerAgencyDetailList', param).then((res) => {
                        var rowData = res.data;
                        for (let i = 0; i < rowData.length; i++) {
                            head.push([rowData[i].contractNo, rowData[i].customerName, rowData[i].totalAmount, rowData[i].payerAmount, rowData[i].rate, rowData[i].serviceFee]);
                        };
                        var csvRows = [];
                        head.forEach(item => csvRows.push(item.join(',')));
                        var csvString = csvRows.join('\n');
                        //BOM的方式解决EXCEL乱码问题
                        var BOM = '\uFEFF';
                        csvString = BOM + csvString;
                        var a = document.createElement('a');
                        a.href = 'data:attachment/csv,' + encodeURI(csvString);
                        a.target = '_blank';
                        a.download = row.payerDate + row.agencyName +".csv";
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                    }
                ).catch((error) => {
                    this.$message.error(error.response.data.message);
                });
            },
            handleCurrentChange(val){
                this.cur_page = val;
                this.getData();
                this.payablesDetail = [];
            }
        }
    }
</script>

<style>
    .payerAmountFont {
        color: #1D8CE0
    }

    .statusAlert {
        color: #F7BA2A
    }

    .statusGood {
        color: #13CE66
    }
</style>