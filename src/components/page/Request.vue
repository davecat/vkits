<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="fa fa-dashboard"></i> 分期管理</el-breadcrumb-item>
                <el-breadcrumb-item>分期申请</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-row>
            <el-form :inline="true" :model="searchForm">
                <el-form-item label="申请编号：">
                    <el-input v-model="searchForm.applictionNo" placeholder="支持模糊查询"></el-input>
                </el-form-item>
                <el-form-item label="起租日期：">
                    <el-date-picker
                            v-model="searchForm.applyDate"
                            align="right"
                            type="daterange"
                            placeholder="选择日期范围"
                            :picker-options="pickerOptions">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="租客姓名：">
                    <el-input v-model="searchForm.customerName" placeholder="支持模糊查询"></el-input>
                </el-form-item>
                <el-form-item label="门店：">
                    <el-select v-model="searchForm.branchId">
                        <el-option label="全部" value=""></el-option>
                        <el-option v-for="branch in branchList" :key="branch.id" :label="branch.name"
                                   :value="branch.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="Search">查询</el-button>
                </el-form-item>
            </el-form>
        </el-row>
        <el-row>
            <el-radio-group v-model="searchForm.status" @change="handleChange">
                <el-radio label="Unchecked">待补充</el-radio>
                <el-radio label="Returned">待修改</el-radio>
                <el-radio label="Unconfirmed">待审核</el-radio>
                <el-radio label="Accepted">审批通过</el-radio>
                <el-radio label="Rejected">审批不通过</el-radio>
            </el-radio-group>
        </el-row>
        <el-row>
            <el-table
                    ref="multipleTable"
                    :data="tableData"
                    highlight-current-row
                    @current-change="handleCurrentRow"
                    border
                    tooltip-effect="dark"
                    style="width: 100%">
                </el-table-column>
                <el-table-column
                        prop="id"
                        label="申请编号">
                </el-table-column>
                <el-table-column
                        prop="applyDate"
                        label="起租日期">
                </el-table-column>
                <el-table-column
                        prop="customerName"
                        label="租客姓名">
                </el-table-column>
                <el-table-column
                        prop="mobile"
                        label="联系方式">
                </el-table-column>
                <el-table-column
                        prop="monthlyRent"
                        label="月租金">
                </el-table-column>
                <el-table-column
                        prop="rentPeriod"
                        label="租期">
                </el-table-column>
                <el-table-column
                        prop="branchAmount"
                        label="手续费（元／期）" width="200">
                </el-table-column>
                <el-table-column
                        prop="branchAmount"
                        label="总金额">
                </el-table-column>
                <el-table-column
                        prop="responsibleAgent"
                        label="经纪人">
                </el-table-column>
                <el-table-column
                        prop="branchAmount"
                        label="门店名称">
                </el-table-column>
                <el-table-column
                        prop="enabled"
                        label="操作">
                    <template scope="scope">
                        <el-tooltip v-if="searchForm.status === 'Unchecked' || searchForm.status === 'Returned'" class="item" effect="dark" content="补充／修改分期申请" placement="top-end">
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

        <el-form v-if="searchForm.status != 'Unchecked' && searchForm.status != 'Returned'" label-position="left" inline class="demo-table-expand">
            <el-row>
                <el-col :span="8">
                    <el-form-item label="经纪人：">
                        <span>{{ currentRow.responsibleAgent }}</span>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="申请日期：">
                        <span>{{ currentRow.applyDate }}</span>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="申请状态：">
                        <span>{{ currentRow.status | appStatusFormat }}</span>
                    </el-form-item>
                </el-col>
                <hr style="border-bottom-color: #d9d9d9; border-top: none;">
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="月租金：">
                        <span>{{ currentRow.monthlyRent }} 元／月</span>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="租期：">
                        <span>{{ currentRow.rentPeriod }} 个月</span>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="起租日期：">
                        <span>{{ currentRow.startDate }}</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-form-item label="房屋信息：">
                    <span>{{ currentRow.address }}</span>
                </el-form-item>
                <hr style="border-bottom-color: #d9d9d9; border-top: none;">
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="租客姓名：">
                        <span>{{ currentRow.customerName }}</span>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="身份证号：">
                        <span>{{ currentRow.idCardNo }}</span>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="手机号：">
                        <span>{{ currentRow.mobile }}</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="最高学历：">
                        <span>{{ currentRow.education | educationFormat }}</span>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="工作单位：">
                        <span>{{ currentRow.companyName }}</span>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="单位地址：">
                        <span>{{ currentRow.companyAddress }}</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="开户银行：">
                        <span>{{ currentRow.bankAccount }}</span>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="银行卡号：">
                        <span>{{ currentRow.bankCard }}</span>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="应急联系人：">
                        <span>{{ currentRow.emergencyContact }}</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="手机号：">
                        <span>{{ currentRow.emergencyContactMobile }}</span>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="关系：">
                        <span>{{ currentRow.relation | relationFormat }}</span>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>

        <el-dialog title="补充／修改分期申请" :visible.sync="formVisible">
            <el-form :model="form" ref="form" :rules="rules">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="经纪人：">
                            <span>{{ form.responsibleAgent }}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="申请日期：">
                            <span>{{ form.applyDate }}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="申请状态：">
                            <span>{{ form.status | appStatusFormat }}</span>
                        </el-form-item>
                    </el-col>
                    <hr style="border-bottom-color: #d9d9d9; border-top: none;">
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="月租金：">
                            <span>{{ form.monthlyRent }} 元／月</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="租期：">
                            <span>{{ form.rentPeriod }} 个月</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="起租日期：">
                            <span>{{ form.startDate }}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-form-item label="房屋信息：">
                        <span>{{ form.address }}</span>
                    </el-form-item>
                    <hr style="border-bottom-color: #d9d9d9; border-top: none;">
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="租客姓名：">
                            <span>{{ form.customerName }}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="身份证号：">
                            <span>{{ form.idCardNo }}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="手机号：">
                            <span>{{ form.mobile }}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="最高学历：">
                            <span>{{ form.education | educationFormat }}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="工作单位：">
                            <span>{{ form.companyName }}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="单位地址：">
                            <span>{{ form.companyAddress }}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="开户银行：">
                            <span>{{ form.bankAccount }}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="银行卡号：">
                            <span>{{ form.bankCard }}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="应急联系人：">
                            <span>{{ form.emergencyContact }}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="手机号：">
                            <span>{{ form.emergencyContactMobile }}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="关系：">
                            <span>{{ form.relation | relationFormat }}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="resetForm('form')">取 消</el-button>
                <el-button type="primary" @click="submitApp('form')">确 定</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    import ElRow from "element-ui/packages/row/src/row";
    export default {
        components: {ElRow},
        data() {
            return {
                tableData: [],
                cur_page: 1,
                size: 10,
                totalElements: 0,
                searchForm: {
                    applictionNo: '',
                    applyDate: '',
                    customerName: '',
                    branchId: '',
                    status: 'Unchecked'
                },
                form: {},
                branchList: {},
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
                formVisible: false,
                currentRow: {
                    responsibleAgent: '',
                    applyDate: '',
                    status: '',
                    monthlyRent: '',
                    rentPeriod: '',
                    startDate: '',
                    address: '',
                    customerName: '',
                    idCardNo: '',
                    mobile: '',
                    education: '',
                    companyName: '',
                    companyAddress: '',
                    bankAccount: '',
                    bankCard: '',
                    emergencyContact: '',
                    emergencyContactMobile: '',
                    relation: '',
                },
                rules: {
                    name: [{required: true, message: '请输入经纪人姓名', trigger: 'blur'}],
                    tel: [{required: true, message: '请输入经纪人电话', trigger: 'blur'}],
                    staffNo: [{required: true, message: '请输入经纪人工号', trigger: 'blur'}],
                    status: [{required: true, message: '请选择状态', trigger: 'change'}]
                }
            }
        },
        created(){
            this.getData();
        },
        filters: {
            appStatusFormat: function (value) {
                if (value === "Unchecked") {
                    return "待补充";
                } else if (value === "Unconfirmed") {
                    return "待审核";
                } else if (value === "Accepted") {
                    return "审核通过";
                } else if (value === "Returned") {
                    return "待修改";
                } else if (value === "Canceled") {
                    return "已取消";
                } else if (value === "Rejected") {
                    return "审核不通过";
                }
            },
            educationFormat: function (value) {
                if (value === "PrimarySchool") {
                    return "小学";
                } else if (value === "MiddleSchool") {
                    return "初中";
                } else if (value === "HighSchool") {
                    return "高中";
                } else if (value === "Secondary") {
                    return "中专";
                } else if (value === "VocationalSchool") {
                    return "高职";
                } else if (value === "College") {
                    return "专科";
                } else if (value === "Undergraduate") {
                    return "本科";
                } else if (value === "Postgraduate") {
                    return "硕士";
                } else if (value === "DoctorPostgraduate") {
                    return "博士";
                }
            },
            relationFormat: function (value) {
                if (value === "Parent") {
                    return "父母";
                } else if (value === "Fellow") {
                    return "同事";
                } else if (value === "Friend") {
                    return "朋友";
                } else if (value === "Relatives") {
                    return "其他亲属";
                }
            },
        },
        methods: {
            handleCurrentChange(val){
                this.cur_page = val;
                this.getData();
            },
            getData(){
                let self = this;
                this.axios.post('/api/v1/application/getApplicationPage', {
                    applictionNo: self.searchForm.applictionNo,
                    applyDate: self.searchForm.applyDate,
                    customerName: self.searchForm.customerName,
                    branchId: self.searchForm.branchId,
                    status: self.searchForm.status,
                    page: self.cur_page - 1,
                    size: self.size
                }).then((res) => {
                    self.tableData = res.data.content;
                    self.totalElements = res.data.totalElements;
                })
            },
            handleEdit(row) {
                this.form = row;
                this.formVisible = true;
            },
            submitApp(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.axios.put('/api/v1/agent', this.form).then((res) => {
                            this.getData();
                            this.$refs[formName].resetFields();
                            this.formVisible = false;
                        }).catch((error) => {
                            console.log(error);
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
                this.formVisible = false;
            },
            Search() {
                console.log("Search")
            },
            handleChange() {
                this.getData();
            },
            handleCurrentRow(val) {
                if(val === null) {
                    this.currentRow = {
                        responsibleAgent: '',
                        applyDate: '',
                        status: '',
                        monthlyRent: '',
                        rentPeriod: '',
                        startDate: '',
                        address: '',
                        customerName: '',
                        idCardNo: '',
                        mobile: '',
                        education: '',
                        companyName: '',
                        companyAddress: '',
                        bankAccount: '',
                        bankCard: '',
                        emergencyContact: '',
                        emergencyContactMobile: '',
                        relation: '',
                    }
                } else {
                    this.currentRow = val;
                }
            }
        }
    }
</script>

<style>

</style>