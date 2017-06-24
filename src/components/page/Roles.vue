<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="fa fa-dashboard"></i> 控制台</el-breadcrumb-item>
                <el-breadcrumb-item>角色管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-row>
            <el-button type="primary" @click="formVisible = true">新增</el-button>
        </el-row>

        <el-row>
                <el-table :data="tableData"
                          border
                          style="width: 100%"
                          highlight-current-row
                          @current-change="handleCurrentRow">
                    <el-table-column prop="id" label="ID">
                    </el-table-column>
                    <el-table-column prop="name" label="角色名称">
                    </el-table-column>
                    <el-table-column prop="description" label="描述">
                    </el-table-column>
                    <el-table-column label="操作">
                        <template scope="scope">
                            <el-tooltip class="item" effect="dark" content="删除" placement="top-end">
                                <el-button size="small" type="warning"
                                           @click="rowDelete(scope.row.id)"><i class="fa fa-trash"></i>
                                </el-button>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                </el-table>
        </el-row>

        <el-dialog title="新增角色" :visible.sync="formVisible">
            <el-form :model="form" ref="form" :rules="rules">
                <el-form-item label="角色名称" :label-width="formLabelWidth" prop="name">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="描述" :label-width="formLabelWidth" prop="description">
                    <el-input v-model="form.description"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="resetForm('form')">取 消</el-button>
                <el-button type="primary" @click="submitRole('form')">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog
                title="删除"
                :visible.sync="dialogVisible"
                size="tiny">
            <span>此操作将删除选中角色，是否继续？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleDelete">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
    import ElRow from "element-ui/packages/row/src/row";
    export default {
        components: {
            ElRow
        },
        data() {
            return {
                tableData: [],
                formVisible: false,
                dialogVisible: false,
                formLabelWidth: '80px',
                deleteId: '',
                currentRow: {},
                form: {
                    name: '',
                    description: ''
                },
                rules: {
                    name: [{required: true, message: '请输入角色名称', trigger: 'blur'}],
                    description: [{required: true, message: '请输入描述', trigger: 'blur'}]
                },
                props: {
                    label: 'name',
                    children: 'children'
                },
            }
        },
        created(){
            this.getData();
        },
        computed: {
            menus() {
                return this.$store.state.menus.menus;
            }
        },
        methods: {
            getData(){
                let self = this;
                this.axios.get('/api/v1/role/getRoleAll').then((res) => {
                    self.tableData = res.data;
                }).catch((error) => {
                    console.log(error);
                })
            },
            rowDelete(id) {
                this.dialogVisible = true;
                this.deleteId = id;
            },
            handleDelete() {
                this.axios.delete('/api/v1/role/' + this.deleteId).then((res) => {
                    this.getData();
                    this.dialogVisible = false;
                }).catch((error) => {
                    console.log(error);
                })
            },
            submitRole(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.axios.post('/api/v1/role', this.form).then((res) => {
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
            handleCheckChange(data, checked, indeterminate) {
                console.log(data, checked, indeterminate);
            },
            handleCurrentRow(val) {
                this.currentRow = val;
            }

        }
    }
</script>

<style>
</style>