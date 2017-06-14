<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="fa fa-dashboard"></i> 内部管理</el-breadcrumb-item>
                <el-breadcrumb-item>资金端管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-row>
            <el-button type="primary" @click="formVisible = true">新增</el-button>
            <el-button type="primary" :disabled="multipleEditButton" @click="multipleEdit" >修改</el-button>
            <el-button type="primary" @click="dialogVisible = true">删除</el-button>
            <el-button type="primary" @click="dialogVisible2 = true">停用</el-button>
        </el-row>
        <el-row>
            <el-form :inline="true" :model="searchForm">
                <el-form-item label="资金端名称：">
                    <el-input v-model="searchForm.name" placeholder="支持模糊查询"></el-input>
                </el-form-item>
                <el-form-item label="还款方式：">
                    <el-select v-model="searchForm.enabled">
                        <el-option label="等额本息" value="true"></el-option>
                        <el-option label="等额本金" value="false"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="Search">查询</el-button>
                </el-form-item>
            </el-form>
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
                        prop="agencyId"
                        label="资金端名称">
                </el-table-column>
                <el-table-column
                        prop="code"
                        label="还款方式">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="银行帐号（收款)">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="开户行（收款）">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="银行账号（付款至LIB)">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="开户行（收款）">
                </el-table-column>
                <el-table-column label="操作">
                    <template scope="scope">
                        <el-tooltip class="item" effect="dark" content="修改" placement="top-end">
                            <el-button size="small" type="primary"
                                       @click="handleEdit(scope.row)"><i
                                    class="fa fa-pencil-square-o"></i>
                            </el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="删除" placement="top-end">
                            <el-button size="small" type="warning"
                                       @click="rowDelete(scope.row.id)"><i class="fa fa-trash"></i>
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

        <el-dialog title="新增门店" :visible.sync="formVisible">
            <el-form :model="form" ref="form" :rules="rules">
                <el-form-item label="所属中介" :label-width="formLabelWidth" prop="agencyId">
                    <el-select v-model="form.agencyId">
                        <el-option v-for="agency in agencyList" :key="agency.id" :label="agency.name" :value="agency.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="门店编号" :label-width="formLabelWidth" prop="code">
                    <el-input v-model="form.code"></el-input>
                </el-form-item>
                <el-form-item label="门店名称" :label-width="formLabelWidth" prop="name">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="状态" :label-width="formLabelWidth" prop="enabled">
                    <el-select v-model="form.enabled">
                        <el-option label="启用" value="true"></el-option>
                        <el-option label="禁用" value="false"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="resetForm('form')">取 消</el-button>
                <el-button type="primary" @click="submitBranch('form')">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="修改门店" :visible.sync="formVisible2">
            <el-form :model="form2" ref="form2" :rules="rules">
                <el-form-item label="门店编号" :label-width="formLabelWidth" prop="code">
                    <el-input v-model="form2.code"></el-input>
                </el-form-item>
                <el-form-item label="门店名称" :label-width="formLabelWidth" prop="name">
                    <el-input v-model="form2.name"></el-input>
                </el-form-item>
                <el-form-item label="状态" :label-width="formLabelWidth" prop="enabled">
                    <el-select v-model="form2.enabled">
                        <el-option label="启用" value="true"></el-option>
                        <el-option label="禁用" value="false"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="resetForm2('form2')">取 消</el-button>
                <el-button type="primary" @click="submitBranch2('form2')">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog
                title="删除"
                :visible.sync="dialogVisible"
                size="tiny">
            <span>此操作将删除选中门店，是否继续？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="multipleDelete">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog
                title="停用"
                :visible.sync="dialogVisible2"
                size="tiny">
            <span>此操作将停用选中门店，是否继续？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible2 = false">取 消</el-button>
                <el-button type="primary" @click="multipleDisable">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog
                title="删除"
                :visible.sync="dialogVisible3"
                size="tiny">
            <span>此操作将删除选中门店，是否继续？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible3 = false">取 消</el-button>
                <el-button type="primary" @click="handleDelete">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
    export default {
        data() {
            return {
                tableData: [],
                multipleSelection: [],
                multipleEditButton: false,
                cur_page: 1,
                size: 10,
                totalElements: 0,
                agencyList: {},
                searchForm: {
                    code: '',
                    name: '',
                    enabled: 'true'
                },
                form: {
                    agencyId: '',
                    code: '',
                    name: '',
                    enabled: 'true'
                },
                form2: {
                    id: '',
                    code: '',
                    name: '',
                    enabled: 'true'
                },
                formVisible: false,
                formVisible2: false,
                dialogVisible: false,
                dialogVisible2: false,
                dialogVisible3: false,
                deleteId: '',
                formLabelWidth: '80px',
                rules: {
                    agencyId: [{required: true, message: '请选择中介', trigger: 'change'}],
                    code: [{required: true, message: '请输入门店编号', trigger: 'blur'}],
                    name: [{required: true, message: '请输入门店名称', trigger: 'blur'}],
                    enabled: [{required: true, message: '请选择状态', trigger: 'change'}]
                }
            }
        },
        created(){
            this.getData();
            this.getAgencyList();
        },
        methods: {
            handleCurrentChange(val){
                this.cur_page = val;
                this.getData();
            },
            getData(){
                let self = this;
                this.axios.post('/api/v1/branch/getBranchPage', {
                    page: self.cur_page - 1,
                    size: self.size
                }).then((res) => {
                    self.tableData = res.data.content;
                    self.totalElements = res.data.totalElements;
                }).catch((error) => {
                    console.log(error);
                })
            },
            getAgencyList() {
                this.axios.get('/api/v1/agency/getAgencyList').then((res) => {
                    this.agencyList = res.data;
                }).catch((error) => {
                    console.log(error);
                })
            },
            submitBranch(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.axios.post('/api/v1/branch', this.form).then((res) => {
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
            submitBranch2(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.axios.put('/api/v1/branch', this.form2).then((res) => {
                            this.getData();
                            this.$refs[formName].resetFields();
                            this.formVisible2 = false;
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
            resetForm2(formName) {
                this.$refs[formName].resetFields();
                this.formVisible2 = false;
            },
            handleEdit(row) {
                this.form2.id = row.id;
                this.form2.code = row.code;
                this.form2.name = row.name;
                this.form2.enabled = String(row.enabled);
                this.formVisible2 = true;
            },
            rowDelete(id) {
                this.dialogVisible3 = true;
                this.deleteId = id;
            },
            handleDelete() {
                this.axios.put('/api/v1/branch/delete', [this.deleteId]).then((res) => {
                    this.getData();
                    this.dialogVisible3 = false;
                }).catch((error) => {
                    console.log(error);
                })
            },
            multipleEdit() {
                let row = this.multipleSelection[0];
                if(row !== undefined) {
                    this.handleEdit(row);
                }
            },
            multipleDelete() {
                let ids = this.multipleSelection.map(row => {
                    return row.id
                });
                if (ids.length === 0) {
                    console.log('ids is null');
                } else {
                    this.axios.put('/api/v1/branch/delete', ids).then((res) => {
                        this.getData();
                    }).catch((error) => {
                        console.log(error);
                    })
                }
                this.dialogVisible = false;
            },
            multipleDisable() {
                let ids = this.multipleSelection.map(row => {
                    return row.id
                });
                if (ids.length === 0) {
                    console.log('ids is null');
                } else {
                    this.axios.put('/api/v1/branch/disable', ids).then((res) => {
                        this.getData();
                    }).catch((error) => {
                        console.log(error);
                    })
                }
                this.dialogVisible2 = false;
            },
            Search() {
                let self = this;
                this.axios.post('/api/v1/branch/getBranchPage', {
                    code: self.searchForm.code,
                    name: self.searchForm.name,
                    enabled: self.searchForm.enabled,
                    page: self.cur_page - 1,
                    size: self.size
                }).then((res) => {
                    self.tableData = res.data.content;
                    self.totalElements = res.data.totalElements;
                }).catch((error) => {
                    console.log(error);
                })
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
                this.multipleEditButton = val.length > 1;
            }
        }
    }
</script>

<style>

</style>