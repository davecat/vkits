<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="fa fa-dashboard"></i> 资金端</el-breadcrumb-item>
                <el-breadcrumb-item>日结查询</el-breadcrumb-item>
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
                <el-form-item label="申请编号：">
                    <el-input v-model="searchForm.name" placeholder="支持模糊查询"></el-input>
                </el-form-item>
                <el-form-item label="审批日期：">
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
            <el-tabs v-model="searchForm.status" type="card" @tab-click="handleChange">
                <el-tab-pane label="审批通过" name="Accepted"></el-tab-pane>
                <el-tab-pane label="审批不通过" name="Rejected"></el-tab-pane>
                <el-tab-pane label="驳回修改" name="Returned"></el-tab-pane>
            </el-tabs>
            <el-table
                    ref="multipleTable"
                    :data="tableData"
                    highlight-current-row
                    @current-change="handleCurrentRow"
                    border
                    tooltip-effect="dark"
                    style="width: 100%">
                <el-table-column
                        min-width="180"
                        prop="agencyName"
                        label="中介名称">
                </el-table-column>
                <el-table-column
                        min-width="180"
                        prop="applictionNo"
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
                        min-width="160"
                        prop="monthlyRent"
                        label="月租金">
                    <template scope="scope">
                        {{ scope.row.monthlyRent | currency }}
                    </template>
                </el-table-column>
                <el-table-column
                        min-width="120"
                        prop="rentPeriod"
                        label="租期">
                </el-table-column>
                <el-table-column
                        min-width="160"
                        prop=""
                        label="总金额">
                    <template scope="scope">
                        {{ scope.row.totalAmount | currency }}
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
                        min-width="150"
                        prop="approvalDate"
                        label="审批日期">
                    <template scope="scope">
                        {{ scope.row.approvalDate | dateFormat }}
                    </template>
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
        <el-form label-position="left" inline
                 class="demo-table-expand">
            <el-row>
                <el-col :span="8">
                    <el-form-item label="经纪人：">
                        <span>{{ currentRow.responsibleAgent }}</span>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="申请日期：">
                        <span>{{ currentRow.applyDate | dateFormat }}</span>
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
                        <span>{{ currentRow.startDate | dateFormat }}</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="房源编号：">
                        <span>{{ currentRow.apartmentNo }}</span>
                    </el-form-item>
                </el-col>
                <el-col :span="16">
                    <el-form-item label="房屋信息：">
                        <span>{{ currentRow.address }}</span>
                    </el-form-item>
                </el-col>
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
            <el-row :gutter="20">
                <el-col :span="3">
                    <el-form-item label="身份证照片：">
                    </el-form-item>
                </el-col>
                <el-col :span="7">
                    <el-card :body-style="{ padding: '0px' }">
                        <img :src="photo(currentRow.idCardFrontPhoto)" class="image">
                        <div style="padding: 14px;">
                            <span>身份证正面</span>
                            <div class="bottom clearfix">
                                <el-button type="text" class="button"
                                           @click="showBigPhoto(currentRow.idCardFrontPhoto)">看大图
                                </el-button>
                            </div>
                        </div>
                    </el-card>
                </el-col>
                <el-col :span="7">
                    <el-card :body-style="{ padding: '0px' }">
                        <img :src="photo(currentRow.idCardVersoPhoto)" class="image">
                        <div style="padding: 14px;">
                            <span>身份证反面</span>
                            <div class="bottom clearfix">
                                <el-button type="text" class="button"
                                           @click="showBigPhoto(currentRow.idCardVersoPhoto)">看大图
                                </el-button>
                            </div>
                        </div>
                    </el-card>
                </el-col>
                <el-col :span="7">
                    <el-card :body-style="{ padding: '0px' }">
                        <img :src="photo(currentRow.idCardAndPersonPhoto)" class="image">
                        <div style="padding: 14px;">
                            <span>手持身份证照片</span>
                            <div class="bottom clearfix">
                                <el-button type="text" class="button"
                                           @click="showBigPhoto(currentRow.idCardAndPersonPhoto)">看大图
                                </el-button>
                            </div>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="3">
                    <el-form-item label="租房合同照片：">
                    </el-form-item>
                </el-col>
                <el-col :span="4" v-for="(o, index) in currentRow.contractPhotos" :key="o">
                    <el-card :body-style="{ padding: '0px' }">
                        <img :src="photo(currentRow.contractPhotos[index])" class="image">
                        <div style="padding: 14px;">
                            <span>租房合同照片</span>
                            <div class="bottom clearfix">
                                <el-button type="text" class="button"
                                           @click="showBigPhoto(currentRow.contractPhotos[index])">看大图
                                </el-button>
                            </div>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
        </el-form>

        <el-dialog
                title="大图"
                :visible.sync="dialogBigPhoto"
                size="small">
            <span><img :src="bigPhotoUrl" width="100%"></span>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogBigPhoto = false">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog
                title="审批通过"
                :visible.sync="dialogVisible"
                size="tiny">
            <span>此操作会将选中分期申请通过审批，是否继续？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="multipleAccept">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog
                title="日结确认"
                :visible.sync="dialogVisible2"
                size="tiny">
            <el-row>今日共审批 {{ eodInfo.acceptedCount + eodInfo.rejectedCount + eodInfo.returnedCount }} 条申请：</el-row>
            <el-row>审批通过：{{ eodInfo.acceptedCount }} 条</el-row>
            <el-row>驳回修改：{{ eodInfo.rejectedCount }} 条</el-row>
            <el-row>拒绝申请：{{ eodInfo.returnedCount }} 条</el-row>
            <el-row>确认后不可修改审批结果，是否确认？</el-row>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible2 = false">取 消</el-button>
                <el-button type="primary" @click="eod">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
    import format from 'date-fns/format'
    import { pagination } from '../mixins/pagination.js'
    import { qiniu } from '../mixins/qiniu.js'
    export default {
        mixins: [pagination, qiniu],
        data() {
            return {
                url: '/riskcontrol/loaner/api/v1/application/eod/getApplicationPage',
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
                    status: 'Accepted'
                },
                form: {},
                eodInfo: {},
                dialogVisible: false,
                dialogVisible2: false,
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
                    idCardFrontPhoto: '',
                    idCardVersoPhoto: '',
                    idCardAndPersonPhoto: '',
                    contractPhotos: []
                },
                bigPhotoUrl: '',
                dialogBigPhoto: false,
                idCardFrontPhoto: '',
                idCardVersoPhoto: '',
                idCardAndPersonPhoto: '',
                contractPhotos: []
            }
        },
        created(){
            this.getAgencyList();
        },
        filters: {
            appStatusFormat: function (value) {
                if (value === "Accepted") {
                    return "审批通过";
                } else if (value === "Rejected") {
                    return "审批不通过";
                } else if (value === "Returned") {
                    return "驳回修改";
                }
            },
            educationFormat: function (value) {
                if (value === "CollegeDown") {
                    return "专科及以下";
                } else if (value === "Undergraduate") {
                    return "本科";
                } else if (value === "PostgraduateUp") {
                    return "硕士及以上";
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
                    return "其他";
                }
            },
            dateFormat: function (value) {
                if (typeof value === "string") {
                    return value.substring(0, value.length - 9)
                }
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
            handleCurrentRow(val) {
                if (val === null) {
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
            },
            handleChange() {
              this.getData();
            },
            showBigPhoto(token) {
                this.bigPhotoUrl = this.qiniu + token + '?imageMogr2/auto-orient';
                this.dialogBigPhoto = true;
            },
            getAgencyList() {
                this.axios.get('/api/v1/agency/getAgencyList').then((res) => {
                    this.agencyList = res.data;
                }).catch((error) => {
                    this.$message.error(error.response.data.message);
                })
            },
            multipleAccept() {
                let ids = this.multipleSelection.map(row => {
                    return row.id
                });
                if (ids.length === 0) {
                    console.log('ids is null');
                } else {
                    this.axios.post('/riskcontrol/loaner/api/v1/application/loanerAccept', ids).then((res) => {
                        this.getData();
                    }).catch((error) => {
                        this.$message.error(error.response.data.message);
                    })
                }
                this.dialogVisible = false;
            },
            showEodInfo() {
                this.axios.get('/riskcontrol/loaner/api/v1/application/eod/info').then((res) => {
                    this.eodInfo = res.data;
                }).catch((error) => {
                    this.$message.error(error.response.data.message);
                });
                this.dialogVisible2 = true;
            },
            eod() {
                this.axios.post('/riskcontrol/loaner/api/v1/application/eod').then((res) => {
                    this.getData();
                }).catch((error) => {
                    this.$message.error(error.response.data.message);
                });
                this.dialogVisible2 = false;
            },
        }
    }
</script>

<style>

</style>