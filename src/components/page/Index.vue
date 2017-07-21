<!--<script src="../../../../../../Downloads/china.js"></script>-->
<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="fa fa-dashboard"></i> 控制台</el-breadcrumb-item>
                <el-breadcrumb-item>首页</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-row :gutter="30">
            <el-col :span="6">
                <el-card class="box-card">
                    <div slot="header" class="clearfix" style="position: relative">
                        <span style="line-height: 36px;text-align: center;width: 100%;display: inline-block;">申请总数</span>
                    </div>
                    <el-row style="text-align: center">
                        <span class="bigText">{{total.total}}</span>
                    </el-row>
                    <el-row class="text item">
                        <el-col :span="12">
                            <span style="line-height: 30px;float: left">待审核：{{total.unconfirmed}}</span>
                        </el-col>
                        <el-col :span="12">
                            <span style="line-height: 30px;float: right">审批不通过：{{total.rejected}}</span>
                        </el-col>
                    </el-row>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card class="box-card">
                    <div slot="header" class="clearfix" style="position: relative">
                        <span style="line-height: 36px;text-align: center;width: 100%;display: inline-block;">今日申请</span>
                    </div>
                    <el-row style="text-align: center">
                        <span class="bigText">{{today.total}}</span>
                    </el-row>
                    <el-row style="text-align: center;height: 30px">
                        <span class="text">总金额：{{today.amount}}元</span>
                    </el-row>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card class="box-card">
                    <div slot="header" class="clearfix" style="position: relative">
                        <span style="line-height: 36px;text-align: center;width: 100%;display: inline-block;">本周申请</span>
                    </div>
                    <el-row style="text-align: center">
                        <span class="bigText">{{week.total}}</span>
                    </el-row>
                    <el-row style="text-align: center;height: 30px">
                        <span class="text">总金额：{{week.amount}}元</span>
                    </el-row>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card class="box-card">
                    <div slot="header" class="clearfix" style="position: relative">
                        <span style="line-height: 36px;text-align: center;width: 100%;display: inline-block;">本月申请</span>
                    </div>
                    <el-row style="text-align: center">
                        <span class="bigText">{{month.total}}</span>
                    </el-row>
                    <el-row style="text-align: center;height: 30px">
                        <span class="text">总金额：{{month.amount}}元</span>
                    </el-row>
                </el-card>
            </el-col>
        </el-row>

    </div>
</template>

<script>
    import echarts from 'echarts';
    import chinaJson from 'echarts/map/json/china';
    export default {
        name: '',
        data () {
            return {
                total:{},//单据数量对象
                today: {},
                week: {},
                month: {},
                lineCharts: '',
                lineStackCharts: '',
            }
        },
        mounted(){
            this.drawLine('line');
            this.drawLineStack('lineStack');
        },
        created() {
//            this.init()
        },
        methods: {
            init() {
                this.axios.get('/api/v1/application/getAgentApplicationStatistics').then((res) => {
                    this.total = res.data.total;
                    this.today = res.data.today;
                    this.week = res.data.week;
                    this.month = res.data.month;
                }).catch((error) => {
                    console.log(error);
                })
            },
            drawLine(id) {
                this.lineCharts = echarts.init(document.getElementById(id));
                this.lineCharts.setOption({
                    title: {
                        text: '近7日到期账单'
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            label: {
                                backgroundColor: '#6a7985'
                            }
                        }
                    },
                    legend: {
                        data: ['金额（千元）', '到期笔数']
                    },
                    toolbox: {
                        feature: {
                            saveAsImage: {}
                        }
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: [
                        {
                            type: 'category',
                            boundaryGap: false,
                            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value'
                        }
                    ],
                    series: [
                        {
                            name: '金额（千元）',
                            type: 'line',
                            stack: '总量',
                            areaStyle: {normal: {}},
                            data: [120, 132, 101, 134, 90, 230, 210]
                        },
                        {
                            name: '到期笔数',
                            type: 'line',
                            stack: '总量',
                            areaStyle: {normal: {}},
                            data: [220, 182, 191, 234, 290, 330, 310]
                        }
                    ]
                })
            },
            drawLineStack(id) {
                this.lineStackCharts = echarts.init(document.getElementById(id));
                this.lineStackCharts.setOption({
                    title: {
                        text: '近7日逾期账单'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: ['金额（千元）', '到期笔数']
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    toolbox: {
                        feature: {
                            saveAsImage: {}
                        }
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [
                        {
                            name: '金额（千元）',
                            type: 'line',
                            stack: '总量',
                            data: [212, 132, 99, 134, 90, 121, 210]
                        },
                        {
                            name: '到期笔数',
                            type: 'line',
                            stack: '总量',
                            data: [210, 182, 191, 234, 300, 260, 310]
                        }
                    ]
                })
            },
        }
    }
</script>
<style scoped>
    .text {
        font-size: 15px;
    }

    .bigText {
        font-size: 24px;
    }

    .item {

    }
    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }
    .clearfix:after {
        clear: both
    }
</style>