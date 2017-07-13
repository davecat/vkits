<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="fa fa-dashboard"></i> 分期管理</el-breadcrumb-item>
                <el-breadcrumb-item>分期申请</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-row>
            <el-button type="primary" @click="dialogVisible = true">提交</el-button>
            <el-button type="primary" @click="dialogVisible2 = true">驳回修改</el-button>
            <el-button type="primary" @click="dialogVisible3 = true">拒绝</el-button>
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
                    <el-input v-model="searchForm.applictionNo" placeholder="支持模糊查询"></el-input>
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
                <el-form-item label="租客联系方式：">
                    <el-input v-model="searchForm.mobile" placeholder="支持模糊查询"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="Search">查询</el-button>
                </el-form-item>
            </el-form>
        </el-row>
        <el-row>
            <el-tabs v-model="searchForm.status" type="card" @tab-click="handleChange(searchForm.status)">
                <el-tab-pane label="待审核" name="Unconfirmed">
                    <span slot="label">待审核<el-badge :value="unconfirmedNumber" class="item"></el-badge></span>
                </el-tab-pane>
                <el-tab-pane label="已提交" name="Commited"></el-tab-pane>
                <el-tab-pane label="审批通过" name="Accepted"></el-tab-pane>
                <el-tab-pane label="审批不通过（待确认）" name="LoanerRejected">
                    <span slot="label">审批不通过（待确认）<el-badge :value="loanerRejectedNumber" class="item"></el-badge></span>
                </el-tab-pane>
                <el-tab-pane label="审批不通过（已确认）" name="LibRejected"></el-tab-pane>
                <el-tab-pane label="待修改（待确认）" name="LoanerReturned">
                    <span slot="label">待修改（待确认）<el-badge :value="loanerReturnedNumber" class="item"></el-badge></span>
                </el-tab-pane>
                <el-tab-pane label="待修改（已确认）" name="LibReturned"></el-tab-pane>
            </el-tabs>
            <el-table
                    ref="multipleTable"
                    :data="tableData"
                    highlight-current-row
                    @current-change="handleCurrentRow"
                    :default-sort="{prop: 'id', order: 'descending'}"
                    border
                    tooltip-effect="dark"
                    style="width: 100%"
                    @selection-change="handleSelectionChange">
                <el-table-column
                        min-width="50"
                        fixed
                        type="selection">
                </el-table-column>
                <el-table-column
                        min-width="140"
                        prop="id"
                        sortable
                        label="申请编号">
                </el-table-column>
                <el-table-column
                        min-width="120"
                        prop="customerName"
                        label="租客姓名">
                </el-table-column>
                <el-table-column
                        min-width="140"
                        prop="mobile"
                        label="联系方式">
                </el-table-column>
                <el-table-column
                        min-width="140"
                        prop="monthlyRent"
                        label="月租金">
                    <template scope="scope">
                        {{ scope.row.monthlyRent |  currency}}
                    </template>
                </el-table-column>
                <el-table-column
                        min-width="180"
                        prop="startDate"
                        label="起止日期">
                    <template scope="scope">
                        {{ scope.row.startDate |  dateFormat}}-{{ scope.row.endDate |  dateFormat}}
                    </template>
                </el-table-column>
                <el-table-column
                        min-width="140"
                        prop="rentPeriod"
                        label="租期">
                </el-table-column>
                <el-table-column
                        min-width="140"
                        prop=""
                        label="房租总额">
                    <template scope="scope">
                        {{ scope.row.totalAmount | currency }}
                    </template>
                </el-table-column>
                <el-table-column
                        min-width="180"
                        prop="city"
                        label="租房城市">
                    <template scope="scope">
                        {{ scope.row.province | districtFormat }}-{{ scope.row.city | districtFormat }}-{{
                        scope.row.district | districtFormat }}
                    </template>
                </el-table-column>
                <el-table-column
                        min-width="180"
                        prop="responsibleAgent"
                        label="经纪人">
                    <template scope="scope">
                        {{ scope.row.agencyName }}-{{ scope.row.responsibleBranch }}-{{ scope.row.responsibleAgent }}
                    </template>
                </el-table-column>
                <el-table-column v-if="searchForm.status !== 'Unconfirmed'"
                        min-width="120"
                        prop="loanerName"
                        label="提交资金端">
                </el-table-column>
                <el-table-column v-if="searchForm.status !== 'Unconfirmed' && searchForm.status !== 'Commited'"
                        min-width="120"
                        prop="loanerApprovalDate"
                        label="审批日期">
                    <template scope="scope">
                        {{ scope.row.loanerApprovalDate | dateFormat }}
                    </template>
                </el-table-column>
                <el-table-column v-if="searchForm.status === 'LibRejected' || searchForm.status === 'LibReturned'"
                        min-width="120"
                        prop="libApprovalDate"
                        label="确认日期">
                    <template scope="scope">
                        {{ scope.row.libApprovalDate | dateFormat }}
                    </template>
                </el-table-column>
                <el-table-column
                        fixed="right"
                        min-width="80"
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
                        <span>{{ currentRow.monthlyRent | currency }} 元／月</span>
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
                    <el-form-item label="退租日期：">
                        <span>{{ currentRow.endDate  | dateFormat }}</span>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="尾款：">
                        <span>{{ currentRow.retainage | currency }}</span>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="房源编号：">
                        <span>{{ currentRow.apartmentNo }}</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="省市区（县）：">
                        <span>{{ currentRow.provinceName }}{{ currentRow.cityName }}{{ currentRow.districtName }}</span>
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
                title="提交"
                :visible.sync="dialogVisible"
                size="tiny">
            <el-form :model="form" ref="form" :rules="rules">
                <el-form-item label="资金端：" prop="loanerId">
                    <el-select v-model="form.loanerId">
                        <el-option v-for="loaner in loanerList" :key="loaner.id" :label="loaner.name" :value="loaner.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="multipleCommit">确 定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

        <el-dialog
                title="驳回修改分期申请"
                :visible.sync="dialogVisible2"
                size="tiny">
            <span>此操作会将选中分期申请返回房屋中介处进行修改，是否确认？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible2 = false">取 消</el-button>
                <el-button type="primary" @click="multipleReturn">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog
                title="拒绝分期申请"
                :visible.sync="dialogVisible3"
                size="tiny">
            <span>此操作会将选中分期申请拒绝审批，是否确认？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible3 = false">取 消</el-button>
                <el-button type="primary" @click="multipleReject">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog
                title="大图"
                :visible.sync="dialogBigPhoto"
                size="small">
            <span><img :src="bigPhotoUrl" width="100%"></span>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogBigPhoto = false">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
    import json from "../../../static/city.json";
    import format from 'date-fns/format'
//    import { pagination } from '../mixins/pagination.js'
    import { qiniu } from '../mixins/qiniu.js'
    export default {
//        mixins: [pagination, qiniu],
        mixins: [qiniu],
        data() {
            return {
                tableData: [],
                cur_page: 1,
                size: 10,
                totalElements: 0,
                url: '/riskcontrol/lib/api/v1/application/getApplicationPage',
                agencyList: {},
                branchList: {},
                loanerList: {},
                searchForm: {
                    applictionNo: '',
                    applyDate: '',
                    startDate: '',
                    endDate: '',
                    customerName: '',
                    agencyId: '',
                    branchId: '',
                    mobile: '',
                    status: 'Unconfirmed'
                },
                form: {
                    loanerId: '',
                    applicationIds: []
                },
                rules: {
                    loanerId: [{required: true, message: '请选择资金端', trigger: 'change'}],
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
                bigPhotoUrl: '',
                dialogBigPhoto: false,
                dialogVisible: false,
                dialogVisible2: false,
                dialogVisible3: false,
                idCardFrontPhoto: '',
                idCardVersoPhoto: '',
                idCardAndPersonPhoto: '',
                contractPhotos: [],
                unconfirmedNumber: 0,//待审核单据数量
                loanerRejectedNumber: 0,//审批不通过（待确认）单据数量
                loanerReturnedNumber: 0//待修改（待确认）单据数量
            }
        },
        created(){
            this.getData();
            this.getAgencyList();
            this.getLoanerList();
            //获取单据数量
            this.axios.post(this.url, {
                ...this.searchForm,
                page: this.cur_page - 1,
                size: this.size
            }).then((res) => {
                this.unconfirmedNumber = res.data.content.length;
            }).catch((error) => {
                this.$message.error(error.response.data.message);
            });
            //审批不通过(待确认)单据
            let searchForm1 = {
                applictionNo: '',
                applyDate: '',
                startDate: '',
                endDate: '',
                customerName: '',
                agencyId: '',
                branchId: '',
                mobile: '',
                status: 'LoanerRejected'
            };
            this.axios.post(this.url, {
                ...searchForm1,
                page: this.cur_page - 1,
                size: this.size
            }).then((res) => {
                this.loanerRejectedNumber = res.data.content.length;
            }).catch((error) => {
                this.$message.error(error.response.data.message);
            });
            //待修改(待确认)单据
            let searchForm2 = {
                applictionNo: '',
                applyDate: '',
                startDate: '',
                endDate: '',
                customerName: '',
                agencyId: '',
                branchId: '',
                mobile: '',
                status: 'LoanerReturned'
            };
            this.axios.post(this.url, {
                ...searchForm2,
                page: this.cur_page - 1,
                size: this.size
            }).then((res) => {
                this.loanerReturnedNumber = res.data.content.length;
            }).catch((error) => {
                this.$message.error(error.response.data.message);
            })
        },
        filters: {
            appStatusFormat: function (value) {
                if (value === "Unconfirmed") {
                    return "待审核";
                } else if (value === "Accepted") {
                    return "审核通过";
                } else if (value === "LibReturned") {
                    return "待修改（待确认）";
                } else if (value === "LoanerRejected") {
                    return "审批不通过-待确认";
                } else if (value === "LoanerReturned") {
                    return "待修改-待确认";
                } else if (value === "LibRejected") {
                    return "审批不通过-已确认";
                } else if (value === "Commited") {
                    return "已提交";
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
                    let date = Date.parse(value.substring(0, value.length - 9))
                    return format(date, 'YYYYMMDD')
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
            getData(a){
                this.axios.post(this.url, {
                    ...this.searchForm,
                    page: this.cur_page - 1,
                    size: this.size
                }).then((res) => {
                    this.tableData = res.data.content;
                    this.totalElements = res.data.totalElements;
                    //获取单据数量
                    if(a === 'Unconfirmed'){
                        this.unconfirmedNumber = this.tableData.length;
                    }
                    if(a === 'LoanerRejected'){
                        this.loanerRejectedNumber = this.tableData.length;
                    }
                    if(a === 'LoanerReturned'){
                        this.loanerReturnedNumber = this.tableData.length;
                    }
                }).catch((error) => {
                    this.$message.error(error.response.data.message);
                })
            },
            handleCurrentChange(val){
                this.cur_page = val;
                this.getData();
            },
            Search() {
                this.getData();
            },
            selectedData() {
                if (this.searchForm.applyDate[0] !== null) {
                    this.searchForm.startDate = format(this.searchForm.applyDate[0], 'YYYY-MM-DD');
                    this.searchForm.endDate = format(this.searchForm.applyDate[1], 'YYYY-MM-DD');
                } else {
                    this.searchForm.startDate = '';
                    this.searchForm.endDate = '';
                }
            },
            showBigPhoto(token) {
                this.bigPhotoUrl = this.qiniu + token + '?imageMogr2/auto-orient';
                this.dialogBigPhoto = true;
            },
            handleChange(a) {
                this.getData(a);
            },
            getAgencyList() {
                this.axios.get('/api/v1/admin/agency/getAgencyList').then((res) => {
                    this.agencyList = res.data;
                }).catch((error) => {
                    this.$message.error(error.response.data.message);
                })
            },
            getBranchList(agencyId) {
                if(agencyId !== '') {
                    this.axios.get('/api/v1/admin/branch/getBranchListByAgencyId/' + agencyId).then((res) => {
                        this.branchList = res.data;
                    }).catch((error) => {
                        this.$message.error(error.response.data.message);
                    })
                } else {
                    this.searchForm.branchId = '';
                    this.branchList = [];
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
            handleCurrentRow(val) {
                let that = this;
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
                    //这里处理省市县的id
                    json.forEach((item) => {
                        //省
                        if(that.currentRow.province === item.value){
                            that.currentRow.provinceName = item.label+'/';
                            //市
                            item.children.forEach((item) => {
                                if(that.currentRow.city === item.value){
                                    that.currentRow.cityName = item.label+'/';
                                    //县
                                    item.children.forEach((item) => {
                                        if(that.currentRow.district === item.value){
                                            that.currentRow.districtName = item.label;
                                        }
                                    })
                                }
                            })
                        }
                    });
                }
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            multipleCommit() {
                let ids = this.multipleSelection.map(row => {
                    return row.id
                });
                if (ids.length === 0) {
                    console.log('ids is null');
                } else {
                    this.form.applicationIds = ids;
                    this.axios.post('/riskcontrol/lib/api/v1/application/commitToLoaner', this.form).then((res) => {
                        this.getData();
                    }).catch((error) => {
                        this.$message.error(error.response.data.message);
                    })
                }
                this.dialogVisible = false;
            },
            multipleReturn() {
                let ids = this.multipleSelection.map(row => {
                    return row.id
                });
                if (ids.length === 0) {
                    console.log('ids is null');
                } else {
                    this.axios.post('/riskcontrol/lib/api/v1/application/libReturn', ids).then((res) => {
                        this.getData();
                    }).catch((error) => {
                        this.$message.error(error.response.data.message);
                    })
                }
                this.dialogVisible2 = false;
            },
            multipleReject() {
                let ids = this.multipleSelection.map(row => {
                    return row.id
                });
                if (ids.length === 0) {
                    console.log('ids is null');
                } else {
                    this.axios.post('/riskcontrol/lib/api/v1/application/libReject', ids).then((res) => {
                        this.getData();
                    }).catch((error) => {
                        this.$message.error(error.response.data.message);
                    })
                }
                this.dialogVisible3 = false;
            }
        }
    }
</script>

<style>
    .demo-table-expand {
        font-size: 0;
    }

    .demo-table-expand label {
        width: 110px;
        color: #99a9bf;
    }

    .demo-table-expand .el-form-item {
        margin-right: 0;
        width: 50%;
    }
    .item {
        margin-left: 4px;
        vertical-align: sub;
    }
</style>