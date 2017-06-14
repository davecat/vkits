<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="fa fa-dashboard"></i> 分期管理</el-breadcrumb-item>
                <el-breadcrumb-item>分期申请</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-row>
            <el-button type="primary">提交分期申请</el-button>
        </el-row>
        <el-row>
            <el-form :inline="true" :model="form">
                <el-form-item label="中介名称：">
                    <el-select v-model="form.enabled">
                        <el-option label="秘制中介" value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="门店名称：">
                    <el-select v-model="form.enabled">
                        <el-option label="秘制门店" value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="申请编号：">
                    <el-input v-model="form.name" placeholder="支持模糊查询"></el-input>
                </el-form-item>
                <el-form-item label="起租日期：">
                    <el-select v-model="form.enabled">
                        <el-option label="全部" value="1"></el-option>
                        <el-option label="今日" value="2"></el-option>
                        <el-option label="最近三天" value="3"></el-option>
                        <el-option label="本周" value="4"></el-option>
                        <el-option label="本月" value="5"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="租客姓名：">
                    <el-input v-model="form.name" placeholder="支持模糊查询"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="Search">查询</el-button>
                </el-form-item>
            </el-form>
        </el-row>
        <el-row>
            <el-radio-group v-model="radio">
                <el-radio-button label="待审核"></el-radio-button>
                <el-radio-button label="已提交"></el-radio-button>
                <el-radio-button label="审批通过"></el-radio-button>
                <el-radio-button label="审批不通过"></el-radio-button>
            </el-radio-group>
        </el-row>
        <el-row>
            <el-table
                    ref="multipleTable"
                    :data="tableData"
                    border
                    tooltip-effect="dark"
                    style="width: 100%"
                    @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="80">
                </el-table-column>
                <el-table-column
                        prop="code"
                        label="申请编号">
                </el-table-column>
                <el-table-column
                        prop="code"
                        label="起租日期">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="租客姓名">
                </el-table-column>
                <el-table-column
                        prop="branchAmount"
                        label="联系方式">
                </el-table-column>
                <el-table-column
                        prop="branchAmount"
                        label="月租金">
                </el-table-column>
                <el-table-column
                        prop="branchAmount"
                        label="租期">
                </el-table-column>
                <el-table-column
                        prop="branchAmount"
                        label="手续费(元/期)"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="branchAmount"
                        label="总金额">
                </el-table-column>
                <el-table-column
                        prop="branchAmount"
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
                        <el-tooltip class="item" effect="dark" content="提交" placement="top-end">
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
        <el-form label-position="left" inline class="demo-table-expand" ref="form" :model="form">
            <el-row>
                <el-col :span="8">
                    <el-form-item label="经纪人：">
                        <span>小李</span>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="申请日期：">
                        <span>2017-06-04</span>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="申请状态：">
                        <span>待审核</span>
                    </el-form-item>
                </el-col>
                <hr style="border-bottom-color: #d9d9d9; border-top: none;">
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="月租金：">
                        <span>6000 元／月</span>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="租期：">
                        <span>6 个月</span>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="起租日期：">
                        <span>2016-12-15</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-form-item label="房屋信息：">
                    <span>北京市朝阳区望京Soho T1 C座702室</span>
                </el-form-item>
                <hr style="border-bottom-color: #d9d9d9; border-top: none;">
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="租客姓名：">
                        <span>小王</span>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="身份证号：">
                        <span>110108xxxxxxxxxxxx</span>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="手机号：">
                        <span>1580xxxxxxx</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="最高学历：">
                        <span>本科</span>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="工作单位：">
                        <span>GM</span>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="单位地址：">
                        <span>xxxxxxx</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="开户银行：">
                        <span>中国银行</span>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="银行卡号：">
                        <span>6222 2222 2222 2222</span>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="应急联系人：">
                        <span>小赵</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="手机号：">
                        <span>1580xxxxxxx</span>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="关系：">
                        <span>同事</span>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>

    </div>
</template>

<script>
    import ElRow from "element-ui/packages/row/src/row";
    import ElCol from "element-ui/packages/col/src/col";
    export default {
        components: {
            ElCol,
            ElRow
        },
        data() {
            return {
                tableData: [],
                multipleSelection: [],
                cur_page: 1,
                size: 10,
                totalElements: 0,
                form: {},
                radio: ''
            }
        },
        created(){
            this.getData();
        },
        methods: {
            handleCurrentChange(val){
                this.cur_page = val;
                this.getData();
            },
            getData(){
                let self = this;
                this.axios.post('/api/v1/agency/getAgencyPage', {
                    params: {
                        page: self.cur_page - 1,
                        size: self.size
                    }
                }).then((res) => {
                    self.tableData = res.data.content;
                    self.totalElements = res.data.totalElements;
                })
            },
            handleEdit(index, row) {
                this.$message('编辑第' + (index + 1) + '行');
            },
            handleDelete(index, row) {
                this.$message.error('删除第' + (index + 1) + '行');
            },
            Search() {
                console.log("Search")
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            }
        }
    }
</script>

<style>
    .demo-table-expand {
        font-size: 0;
    }

    .demo-table-expand label {
        width: 100px;
        color: #99a9bf;
    }

    .demo-table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 50%;
    }
</style>