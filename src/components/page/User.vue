<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="fa fa-dashboard"></i> 系统管理</el-breadcrumb-item>
                <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-row>
            <el-button type="primary" @click="formVisible = true">新增</el-button>
        </el-row>

        <el-row>
            <el-col :span="14">
                <el-table :data="tableData" border>
                    <el-table-column prop="staffName" label="用户昵称">
                    </el-table-column>
                    <el-table-column prop="staffType" label="类型">
                        <template scope="scope">
                            {{scope.row.staffType | staffTypeFormat}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="status" label="状态">
                        <template scope="scope">
                            {{scope.row.status=='Normal' ? '正常':'禁用'}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="username" label="登录名">
                    </el-table-column>
                    <el-table-column label="操作" width="320">
                        <template scope="scope">
                            <el-tooltip class="item" effect="dark" content="修改" placement="top-end">
                                <el-button size="small" type="primary"
                                           @click="handleEdit(scope.row)"><i class="fa fa-pencil-square-o"></i>
                                </el-button>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="重置密码" placement="top-end">
                                <el-button size="small" type="danger"
                                           @click="resetPwd(scope.row.staffId)"><i class="fa fa-repeat"></i>
                                </el-button>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="锁定" placement="top-end">
                                <el-button size="small" type="warning"
                                           @click="unlock(scope.row.staffId)"><i class="fa fa-lock"></i>
                                </el-button>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="解锁" placement="top-end">
                                <el-button size="small" type="danger"
                                           @click="lock(scope.row.staffId)"><i class="fa fa-unlock-alt"></i>
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
            </el-col>
        </el-row>

        <el-dialog title="新增用户" :visible.sync="formVisible">
            <el-form :model="form" ref="form" :rules="rules">
                <el-form-item label="昵称" :label-width="formLabelWidth" prop="staffName">
                    <el-input v-model="form.staffName"></el-input>
                </el-form-item>
                <el-form-item label="登录名" :label-width="formLabelWidth" prop="username">
                    <el-input v-model="form.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" :label-width="formLabelWidth" prop="password">
                    <el-input v-model="form.password"></el-input>
                </el-form-item>
                <el-form-item label="员工类型" :label-width="formLabelWidth" prop="staffType">
                    <el-select v-model="form.staffType" @change="staffChange(form.staffType)">
                        <el-option label="内部员工" value="Interior"></el-option>
                        <el-option label="中介公司负责人" value="Boss"></el-option>
                        <el-option label="门店管理员" value="Branch"></el-option>
                        <el-option label="资金端" value="Loaner"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="角色" :label-width="formLabelWidth" prop="role">
                    <el-select v-model="form.role">
                        <el-option v-for="role in roleList" :key="role.id"  :value="role" :label="role.name"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="所属资金端" :label-width="formLabelWidth" prop="loanerId">
                    <el-select v-model="form.loanerId" :disabled="loanerDisable">
                        <el-option v-for="loaner in loanerList" :value="loaner.id" :key="loaner.id" :label="loaner.name"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="管辖中介：" :label-width="formLabelWidth" prop="agencies">
                    <el-select v-model="form.agencies" multiple @change="getBranchList(form.agencies)" :disabled="agenciesDisable">
                        <el-option v-for="agency in agencyList" :value="agency" :label="agency.name"  :key="agency.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="管辖门店：" :label-width="formLabelWidth" prop="branches">
                    <el-select v-model="form.branches" multiple :disabled="agenciesDisable">
                        <el-option v-for="branch in branchList" :key="branch.id" :value="branch" :label="branch.name"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="resetForm('form')">取 消</el-button>
                <el-button type="primary" @click="submitUser('form')">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="修改用户" :visible.sync="formVisible2">
            <el-form :model="form2" ref="form2" :rules="rules">
                <el-form-item label="昵称" :label-width="formLabelWidth" prop="name">
                    <el-input v-model="form2.name"></el-input>
                </el-form-item>
                <el-form-item label="登录名" :label-width="formLabelWidth" prop="username">
                    <el-input v-model="form2.username"></el-input>
                </el-form-item>
                <el-form-item label="员工类型" :label-width="formLabelWidth" prop="type">
                    <el-select v-model="form2.type">
                        <el-option label="内部员工" value="Interior"></el-option>
                        <el-option label="中介公司负责人" value="Boss"></el-option>
                        <el-option label="门店管理员" value="Branch"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="角色" :label-width="formLabelWidth" prop="roleId">
                    <el-select v-model="form2.roleId">
                        <el-option v-for="role in roleList" :key="role.id" :label="role.name" :value="role.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="所属资金端" :label-width="formLabelWidth" prop="loanerId">
                    <el-select v-model="form2.loanerId">
                        <el-option v-for="loaner in loanerList" :key="loaner.id" :label="loaner.name" :value="loaner.id"></el-option>
                    </el-select>
                </el-form-item>
                <!--<el-form-item label="管辖中介：">-->
                    <!--<el-select v-model="form2.agencies" multiple @change="getBranchList(form.agencies)">-->
                        <!--<el-option v-for="agency in agencyList" :key="agency.id" :label="agency.name" :value="agency.id"></el-option>-->
                    <!--</el-select>-->
                <!--</el-form-item>-->
                <!--<el-form-item label="管辖门店：">-->
                    <!--<el-select v-model="form2.branches" multiple>-->
                        <!--<el-option v-for="branch in branchList" :key="branch.id" :label="branch.name" :value="branch.id"></el-option>-->
                    <!--</el-select>-->
                <!--</el-form-item>-->
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="resetForm2('form2')">取 消</el-button>
                <el-button type="primary" @click="submitUser2('form2')">确 定</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    export default {
        data() {
            return {
                loanerDisable: true,//用来控制资金端是否能选择
                agenciesDisable: false,//用来控制中介和门店是否能选择
                agenciesIds: [],//存放选择的中介id
                tableData: [],
                cur_page: 1,
                size: 10,
                totalElements: 0,
                formVisible: false,
                formVisible2: false,
                formLabelWidth: '120px',
                roleList: [],
                agencyList: {},
                branchList: {},
                loanerList: {},
                form: {
                    staffName: '',//昵称
                    username: '',
                    password: '',
                    staffType: '',
                    role: {},//角色
                    loanerId: '',//所属资金端
                    branches: [],//管理门店
                    agencies: [],//中介
                },
                form2: {
                    id: '',
                    staffId: '',
                    name: '',
                    username: '',
                    type: '',
                    roleId: '',
                    loanerId: '',
                    branches: [],
                    agencies: []
                },
                rules: {
                    name: [{required: true, message: '请输入昵称', trigger: 'blur'}],
                    username: [{required: true, message: '请输入登录名', trigger: 'blur'}],
                    password: [{required: true, message: '请输入密码', trigger: 'blur'}],
                    type: [{required: true, message: '请输入员工类型', trigger: 'change'}],
                    roleId: [{required: true, message: '请选择角色', trigger: 'change'}]
                },
            }
        },
        created(){
            this.getData();
            this.getRoleList();
            this.getAgencyList();
            this.getLoanerList();
        },
        filters: {
            staffTypeFormat: function (value) {
                if (value === "Interior") {
                    return "内部员工";
                } else if (value === "Boss") {
                    return "中介公司负责人";
                } else if(value === "Loaner"){
                   return "资金端"
                } else if(value === "Branch"){
                    return "门店管理员";
                }
            }
        },
        methods: {
            handleCurrentChange(val){
                this.cur_page = val;
                this.getData();
            },
            getData(){
                let self = this;
                this.axios.post('/api/v1/user/getList', {
                    params: {
                        page: self.cur_page - 1,
                        size: self.size
                    }
                }).then((res) => {
                    self.tableData = res.data.content;
                    console.log(self.tableData);
                    self.totalElements = res.data.totalElements;
                })
            },
            getRoleList() {
                this.axios.get('/api/v1/role/getRoleAll').then((res) => {
                    this.roleList = res.data;
                }).catch((error) => {
                    this.$message.error(error.response.data.message);
                })
            },
            getAgencyList() {
                this.axios.get('/api/v1/agency/getAgencyList').then((res) => {
                    this.agencyList = res.data;
                }).catch((error) => {
                    this.$message.error(error.response.data.message);
                })
            },
            //当员工选项变化时
            staffChange(value) {
                if(value === "Loaner"){
                    this.loanerDisable = false;
                    this.agenciesDisable = true;
                } else {
                    this.loanerDisable = true;
                    this.agenciesDisable = false;
                }
            },
            //只有当选择了中介，才能选择门店
            getBranchList(item) {
                this.agenciesIds = item.map(item => {
                    return item.id
                });
                this.axios.post('/api/v1/branch/getBranchListByAgencyIdList', this.agenciesIds).then((res) => {
                    this.branchList = res.data;
                }).catch((error) => {
                    this.$message.error(error.response.data.message);
                })
            },
            getLoanerList() {
                let self = this;
                this.axios.post('/riskcontrol/api/v1/loaner/getLoanerPage', {
                    page: self.cur_page - 1,
                    size: self.size
                }).then((res) => {
                    self.loanerList = res.data.content;
                }).catch((error) => {
                    this.$message.error(error.response.data.message);
                })
            },
            handleEdit(row) {
                this.form2 = row;
                this.form2.loanerId = '';
                this.form2.type = 'Loaner';
                this.form2.name = row.staffName;
                this.form2.roleId = '';
                this.formVisible2 = true;
            },
            resetPwd(staffId) {
                let self = this;
                this.axios.put('/api/v1/user/admin/resetPassword', {
                    userId: staffId
                }).then((res) => {
                    self.tableData = res.data.content;
                    self.totalElements = res.data.totalElements;
                })
            },
            lock(staffId) {
                let self = this;
                this.axios.put('/api/v1/user/admin/blockUser', [staffId]).then((res) => {
                    self.tableData = res.data.content;
                    self.totalElements = res.data.totalElements;
                })
            },
            unlock(staffId) {
                let self = this;
                this.axios.put('/api/v1/user/admin/unblockUser', [staffId]).then((res) => {
                    self.tableData = res.data.content;
                    self.totalElements = res.data.totalElements;
                })
            },
            submitUser(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.axios.post('/api/v1/user/admin/addUser', this.form).then((res) => {
                            this.getData();
                            this.$refs[formName].resetFields();
                            this.formVisible = false;
                            this.$message({
                                message: '新增成功！',
                                type: 'success'
                            });
                        }).catch((error) => {
                            this.$message.error(error.response.data.message);
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
            submitUser2(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.axios.put('/api/v1/user/admin/updateUser', this.form2).then((res) => {
                            this.getData();
                            this.$refs[formName].resetFields();
                            this.formVisible2 = false;
                        }).catch((error) => {
                            this.$message.error(error.response.data.message);
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            resetForm2(formName) {
                this.$refs[formName].resetFields();
                this.formVisible2 = false;
            },
        }
    }
</script>

<style>
</style>