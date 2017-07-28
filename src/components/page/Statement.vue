<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="fa fa-dashboard"></i> 分期管理</el-breadcrumb-item>
                <el-breadcrumb-item>对账明细</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-row>
            <el-form :inline="true" :model="searchForm">
                <el-form-item label="应收款日期：">
                    <el-date-picker
                            v-model="searchForm.applyDate"
                            align="right"
                            type="date"
                            placeholder="选择日期"
                            @change="selectedData"
                            :picker-options="pickerOptions0">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="Search">查询</el-button>
                </el-form-item>
            </el-form>
        </el-row>
        <el-row style="color: red;">
            <el-col :span="4" style="float: right">
                应收合计:{{ totalAmount | currency}}
            </el-col>
        </el-row>
        <el-row>
            <el-table
                    :data="tableData"
                    :default-sort="{prop: 'payeeDate', order: 'descending'}"
                    style="width: 100%">
                <el-table-column
                        prop="payeeDate"
                        sortable
                        min-width="130"
                        label="应收款日期">
                    <template scope="scope">
                        {{ scope.row.payeeDate | dateFormat }}
                    </template>
                </el-table-column>
                <el-table-column
                        min-width="136"
                        prop="applicationNo"
                        label="申请编号">
                </el-table-column>
                <el-table-column
                        min-width="120"
                        prop="payeeAmount"
                        label="应收金额">
                    <template scope="scope">
                        <div slot="reference" class="name-wrapper">
                            <el-tag>{{ scope.row.payeeAmount | currency }}</el-tag>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                        min-width="120"
                        prop="totalAmount"
                        label="分期总金额">
                    <template scope="scope">
                        {{ scope.row.totalAmount | currency }}
                    </template>
                </el-table-column>
                <el-table-column
                        min-width="100"
                        prop="customerName"
                        label="租客姓名">
                </el-table-column>
                <el-table-column
                        min-width="150"
                        prop="mobile"
                        label="联系方式">
                </el-table-column>
                <el-table-column
                        min-width="115"
                        prop="rentPeriod"
                        label="租期">
                </el-table-column>
                <el-table-column
                        min-width="180"
                        prop="startDate"
                        label="起止时间">
                    <template scope="scope">
                        {{ scope.row.startDate | dateFormat}}-{{ scope.row.endDate | dateFormat}}
                    </template>
                </el-table-column>
                <el-table-column
                        min-width="120"
                        prop="monthlyRent"
                        label="月租金">
                    <template scope="scope">
                        {{ scope.row.monthlyRent | currency }}
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
                        min-width="127"
                        prop="responsibleAgent"
                        label="经纪人">
                    <template scope="scope">
                        {{ scope.row.responsibleBranch }}-{{ scope.row.responsibleAgent }}
                    </template>
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

    </div>
</template>

<script>
    import format from 'date-fns/format'
    import json from "../../../static/city.json";
    export default {
        data() {
            return {
                pickerOptions0: {
                    disabledDate(time) {
                        return time.getTime() < Date.now() - 8.64e7;
                    }
                },
                tableData: [],
                cur_page: 1,
                size: 10,
                totalElements: 0,
                url: '/counter/api/v1/payee/lib/getPayeeLibPage',
                searchForm: {
                    applyDate: format(Date.now(), 'YYYY-MM-DD')
                },
                formLabelWidth: '120px',
            }
        },
        filters: {
            dateFormat: function (value) {
                if (typeof value === "string") {
                    let date = Date.parse(value.substring(0, value.length - 9));
                    return format(date, 'YYYYMMDD');
                }
            },
            districtFormat: function (value) {
                if(!value){
                    return ''
                }
                let district = {};
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
        computed: {
            totalAmount() {
                let totalAmount = 0;
                this.tableData.forEach(item => {
                    totalAmount+=item.payeeAmount;
                });
                return totalAmount;
            }
        },
        created() {
            this.getData();
        },
        methods: {
            handleCurrentChange(val){
                this.cur_page = val;
                this.getData();
            },
            getData(){
                this.axios.post(this.url, {
                    ...this.searchForm,
                    page: this.cur_page - 1,
                    size: this.size
                }).then((res) => {
                    this.tableData = res.data.content;
                    this.totalElements = res.data.totalElements;
                }).catch((error) => {
                    this.$message.error(error.response.data.message);
                })
            },
            Search() {
                this.searchForm.applyDate = format(this.searchForm.applyDate, 'YYYY-MM-DD');
                this.getData();
            },
            selectedData() {
                if(this.searchForm.applyDate !== undefined && this.searchForm.applyDate !== 'Invalid Date' && this.searchForm.applyDate !== '') {
                    this.searchForm.applyDate = format(this.searchForm.applyDate, 'YYYY-MM-DD');
                } else {
                    this.searchForm.applyDate = format(Date.now(), 'YYYY-MM-DD');
                }
            },
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
    .el-tag {
        font-size: 14px;
        background-color: transparent;
        color: #1D8CE0
    }
</style>