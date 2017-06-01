<template>
    <div class="login-wrap">
        <div class="ms-title">后台管理系统</div>
        <div class="ms-login">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm">
                <el-form-item prop="username">
                    <el-input v-model="ruleForm.username" placeholder="用户名"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="密码" v-model="ruleForm.password" @keyup.enter.native="submitForm('ruleForm')"></el-input>
                </el-form-item>
                <el-form-item prop="captcha">
                    <el-input type="captcha" placeholder="验证码" v-model="ruleForm.captcha" @keyup.enter.native="submitForm('ruleForm')"></el-input>
                    <img :src="captchaUrl"/>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
                </div>
                <p style="font-size:12px;line-height:30px;color:#999;">Tips : 用户名admin、密码123456、验证码zzz。</p>
            </el-form>
        </div>
    </div>
</template>

<script>
    export default {
        data: function(){
            return {
                captchaUrl: '',
                ruleForm: {
                    username: '',
                    password: '',
                    captcha: '',
                    captchaId: 'xxx'
                },
                rules: {
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ],
                    captcha: [
                        { required: true, message: '请输入验证码', trigger: 'blur' }
                    ]
                }
            }
        },
        created: function () {
            this.getCaptcha();
        },
        methods: {
            submitForm(formName) {
                const self = this;
                self.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.doLogin(self.ruleForm).then((response) => {
                            console.log(response.data);
                            self.$router.push('/home');
                        }).catch((error) => {
                            console.log(error);
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            doLogin(ruleForm) {
                return this.axios.post("/anon/login", ruleForm);
            },
            getCaptcha() {
                this.axios.get("/anon/captchaId").then((response) => {
                    console.log(response.data);
                    this.captchaUrl = response.data.captchaURL;
                }).catch((error) => {
                    console.log(error);
                })
            }
        }
    }
</script>

<style scoped>
    .login-wrap{
        position: relative;
        width:100%;
        height:100%;
    }
    .ms-title{
        position: absolute;
        top:50%;
        width:100%;
        margin-top: -230px;
        text-align: center;
        font-size:30px;
        color: #fff;
    }
    .ms-login{
        position: absolute;
        left:50%;
        top:50%;
        width:300px;
        height:300px;
        margin:-150px 0 0 -190px;
        padding:40px;
        border-radius: 5px;
        background: #fff;
    }
    .login-btn{
        text-align: center;
    }
    .login-btn button{
        width:100%;
        height:36px;
    }
</style>