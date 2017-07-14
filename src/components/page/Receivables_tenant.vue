<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="fa fa-dashboard"></i> 内部管理</el-breadcrumb-item>
                <el-breadcrumb-item>用户还款</el-breadcrumb-item>
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
                <el-form-item label="实际收款日期：">
                    <el-date-picker
                            v-model="searchForm.applyDate1"
                            align="right"
                            type="daterange"
                            placeholder="选择日期范围"
                            @change="selectedData1"
                            :picker-options="pickerOptions">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="租客姓名：">
                    <el-input v-model="searchForm.customName"></el-input>
                </el-form-item>
                <el-form-item label="中介名称：">
                    <el-select v-model="searchForm.agencyId">
                        <el-option label="全部" value=""></el-option>
                        <el-option v-for="agency in agencyList" :key="agency.id" :label="agency.name"
                                   :value="agency.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="Search">查询</el-button>
                </el-form-item>
            </el-form>
        </el-row>
        <el-row>
            <el-tabs v-model="searchForm.type" type="card" @tab-click="handleChangeTab(searchForm.type)">
                <el-tab-pane label="应收款" name="receivables"></el-tab-pane>
                <el-tab-pane label="异常款项" name="exception"></el-tab-pane>
            </el-tabs>
            <el-table
                    :data="tableData"
                    stripe
                    max-height="500"
                    :default-sort="{prop: 'payerDate', order: 'descending'}"
                    highlight-current-row
                    style="width: 100%">
                <el-table-column
                        min-width="160"
                        sortable
                        prop="payeeDate"
                        label="应收款日期">
                    <template scope="scope">
                        {{ scope.row.payeeDate | dateFormat }}
                    </template>
                </el-table-column>
                <el-table-column
                        min-width="140"
                        prop="contractNo"
                        label="合同编号">
                </el-table-column>
                <el-table-column
                        min-width="145"
                        prop="billNo"
                        label="账单编号">
                </el-table-column>
                <el-table-column
                        min-width="140"
                        label="中介门店">
                    <template scope="scope">
                        {{ scope.row.agencyName}}-{{scope.row.branchName}}
                    </template>
                </el-table-column>
                <el-table-column
                        min-width="140"
                        prop="customName"
                        label="租客姓名">
                </el-table-column>
                <el-table-column
                        min-width="160"
                        sortable
                        prop="payeeAmount"
                        label="账单金额">
                    <template scope="scope">
                        {{ scope.row.payeeAmount | currency }}
                    </template>
                </el-table-column>
                <el-table-column
                        min-width="160"
                        sortable
                        prop="payeeDate"
                        label="实际收款日期">
                    <template scope="scope">
                        {{ scope.row.factPayeeDate | dateFormat }}
                    </template>
                </el-table-column>
                <el-table-column
                        v-if="overdue"
                        min-width="100"
                        prop="overdueDays"
                        label="逾期天数">
                </el-table-column>
                <el-table-column
                        v-if="overdue"
                        min-width="100"
                        prop="overdueFee"
                        label="逾期费用">
                </el-table-column>
                <el-table-column
                        min-width="100"
                        prop="payeeType"
                        label="支付方式">
                    <template scope="scope">
                        {{ scope.row.payeeType | payeeTypeFilter}}
                    </template>
                </el-table-column>
                <el-table-column
                        min-width="120"
                        class-name="statusGood"
                        prop="status"
                        label="状态">
                    <template scope="scope">
                        <p :class="{ statusAlert: scope.row.status === 'Unconfirmed' }">{{ scope.row.status === 'Unconfirmed'?'待确认':'已确认' }}</p>
                    </template>
                </el-table-column>
                <el-table-column
                        min-width="120"
                        prop="confirmType"
                        label="确认方式">
                    <template scope="scope">
                        {{ scope.row.confirmType | confirmTypeFliter}}
                    </template>
                </el-table-column>
                <el-table-column
                        min-width="100"
                        prop="remarks"
                        label="备注">
                </el-table-column>
                <el-table-column
                        min-width="120"
                        label="操作">
                    <template scope="scope">
                        <el-tooltip class="item" effect="dark" content="确认收款" placement="top-end" v-if="scope.row.status === 'Unconfirmed'">
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
            <!--<div class="el-table el-table&#45;&#45;fit el-table&#45;&#45;striped el-table&#45;&#45;fluid-height el-table&#45;&#45;enable-row-hover el-table&#45;&#45;enable-row-transition" style="width: 100%;max-height: 500px">-->
                <!--<div class="el-table__body-wrapper" style="max-height: 460px">-->
                    <!--<table cellpadding="0" cellspacing="0" border="0" class="el-table__body" style="width: 100%">-->
                        <!--<tbody>-->
                        <!--<tr class="el-table__row">-->
                            <!--<td class="el-table_1_column">-->
                                <!--<div class="cell">合计总金额</div>-->
                            <!--</td>-->
                            <!--<td class="el-table_1_column">-->
                                <!--<div class="cell">232324.44</div>-->
                            <!--</td>-->
                        <!--</tr>-->
                        <!--</tbody>-->
                    <!--</table>-->
                <!--</div>-->
            <!--</div>-->

            <div class="pagination">
            <el-pagination
            @current-change="handleCurrentChange"
            layout="prev, pager, next"
            :total="totalElements">
            </el-pagination>
            </div>
        </el-row>


        <el-dialog title="确认收款" :visible.sync="dialogVisible">
            <el-form :model="form" ref="form" :rules="rules">
                <el-form-item label="实际收款日期：" :label-width="formLabelWidth" prop="factPayerDate">
                    <el-date-picker
                            v-model="form.factPayeeDate"
                            type="date"
                            placeholder="选择日期"
                            :default-value="form.factPayeeDate"
                            :picker-options="pickerOptions0">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="支付方式：" :label-width="formLabelWidth" prop="customPayerType">
                    <el-select v-model="form.customPayerType">
                        <el-option label="微信" value="WeChat"></el-option>
                        <el-option label="支付宝" value="Alipay"></el-option>
                        <el-option label="储蓄卡" value="DepositCard"></el-option>
                        <el-option label="信用卡" value="CreditCard"></el-option>
                        <el-option label="现金" value="Cash"></el-option>
                        <el-option label="其他" value="Other"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="备注：" :label-width="formLabelWidth" prop="remarks">
                    <el-input type="textarea" v-model="form.remarks"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="resetForm('form')">取 消</el-button>
                <el-button type="primary" @click="confirm('form')">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog
                title="取消确认收款"
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
                url: '/postlending/api/v1/payee/custom/getPayeeCustomPage',
                searchForm: {
                    applyDate: '',
                    applyDate1: '',
                    payeeDateStart: '',
                    payeeDateEnd: '',
                    factPayeeDateStart: '',
                    factPayeeDateEnd: '',
                    customName: '',
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
                    billNo: '',
                    customPayerType: 'WeChat',
                    factPayeeDate: '',
                    remarks: ''
                },
                agencyList: [],
                customerList: [],
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
//                    factPayerDate: [{type: 'date', required: true, message: '请选择日期', trigger: 'blur'}],
//                    remarks: [{required: true, message: '请输入备注', trigger: 'blur'}],
                    customPayerType: [{required: true, message: '请选择类型', trigger: 'change'}]
                },
                pickerOptions0: {
                    disabledDate(time) {
                        return time.getTime() < Date.now() - 8.64e7;
                    }
                },
                overdue1:true,
                overdue: false//控制逾期日期和逾期天数是否显示
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
            confirmTypeFliter: function (value) {
                if(value === 'Auto'){
                    return '自动'
                } else if(value === 'Hand') {
                    return '手动'
                }else {
                    return ''
                }
            },
            payeeTypeFilter: function (value) {
                switch (value){
                    case 'WeChat': return '微信';
                    case 'Alipay': return '支付宝';
                    case 'DepositCard': return '储蓄卡';
                    case 'CreditCard': return '信用卡';
                    case 'Cash': return '现金';
                    case 'Other': return '其他';
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
            selectedData1() {
                if (this.searchForm.applyDate1[0] !== null) {
                    this.searchForm.factPayeeDateStart = format(this.searchForm.applyDate1[0], 'YYYY-MM-DD');
                    this.searchForm.factPayeeDateEnd = format(this.searchForm.applyDate1[1], 'YYYY-MM-DD');
                } else {
                    this.searchForm.factPayeeDateStart = '';
                    this.searchForm.factPayeeDateEnd = '';
                }
            },
            getAgencyList() {
                this.axios.get('/api/v1/admin/agency/getAgencyList').then((res) => {
                    this.agencyList = res.data;
                }).catch((error) => {
                    this.$message.error(error.response.data.message);
                })
            },
            handleChangeTab(a) {
                if(a === 'exception') {
                    this.overdue = true;
                    this.overdue1 = false;
                } else {
                    this.overdue = false;
                    this.overdue1 = true;
                }
                this.getData();
            },
            handleEdit(row) {
                this.form.billNo = row.billNo;
                this.form.factPayeeDate = row.factPayeeDate || Date.now();
                this.form.customPayerType = row.customPayerType || 'WeChat';
                this.dialogVisible = true;
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
                this.form = {factPayerDate: Date.now()};
                this.dialogVisible = false;
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
            //确认收款
            confirm(formName) {
                this.$refs[formName].validate((valid) => {
                    if(valid){
                        this.form.factPayeeDate = format(this.form.factPayeeDate, 'YYYY-MM-DD HH:mm:ss');
                        this.axios.post('/postlending/api/v1/payee/custom/confirm', this.form).then(() => {
                            this.getData();
                            this.dialogVisible = false;
                        }).catch((error) => {
                            this.$message.error(error.response.data.message);
                        })
                    }
                });
            },
            unConfirmShow(row) {
                this.unConfirmRow = row;
                this.dialogVisible2 = true;
            },
            //取消确认收款
            unConfirm() {
                let form = {
                    billNo: this.unConfirmRow.billNo,
                };
                this.axios.post('/postlending/api/v1/payee/custom/unConfirm', form).then((res) => {
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
                    page: this.detailCurPage - 1,
                    size: this.detailSize
                };
                this.axios.post('/postlending/api/v1/payer/agency/getPayerAgencyDetailPage', param).then((res) => {
                        var rowData = res.data.content;
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
            handleCurrentChange(val)
            {
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