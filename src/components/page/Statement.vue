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
                            type="daterange"
                            placeholder="选择日期范围"
                            @change="selectedData"
                            :picker-options="pickerOptions">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="Search">查询</el-button>
                </el-form-item>
            </el-form>
        </el-row>
        <el-row>
            <el-table
                    :data="tableData"
                    stripe
                    :default-sort="{prop: 'payeeDate', order: 'descending'}"
                    style="width: 100%">
                <el-table-column
                        prop="payeeDate"
                        sortable
                        label="应收款日期">
                    <template scope="scope">
                        {{ scope.row.payeeDate | dateFormat }}
                    </template>
                </el-table-column>
                <el-table-column
                        min-width="120"
                        prop="applicationNo"
                        label="申请编号">
                </el-table-column>
                <el-table-column
                        prop="payeeAmount"
                        label="应收金额">
                    <template scope="scope">
                        {{ scope.row.payeeAmount | currency }}
                    </template>
                </el-table-column>
                <el-table-column
                        prop="totalAmount"
                        label="分期总金额">
                    <template scope="scope">
                        {{ scope.row.totalAmount | currency }}
                    </template>
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
    import {pagination} from '../mixins/pagination.js'
    import format from 'date-fns/format'
    import json from "../../../static/city.json";
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
                url: '/counter/api/v1/payee/lib/getPayeeLibPage',
                searchForm: {
                    applyDate: '',
                    payeeDateStart: '',
                    payeeDateEnd: '',
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
                    this.searchForm.payeeDateStart = format(this.searchForm.applyDate[0], 'YYYY-MM-DD');
                    this.searchForm.payeeDateEnd = format(this.searchForm.applyDate[1], 'YYYY-MM-DD');
                } else {
                    this.searchForm.payeeDateStart = '';
                    this.searchForm.payeeDateEnd = '';
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
</style>