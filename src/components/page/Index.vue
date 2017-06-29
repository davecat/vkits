<script src="../../../../../../Downloads/china.js"></script>
<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="fa fa-dashboard"></i> 控制台</el-breadcrumb-item>
                <el-breadcrumb-item>首页</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-row :gutter="30">
            <el-col :span="8">
                <el-card class="box-card">
                    <el-row class="text item">
                        <el-col :span="12">
                            <span class="bigText">今日实时</span>
                        </el-col>
                        <el-col :span="12">
                            <span style="line-height: 30px;">笔数: 100</span>
                        </el-col>
                    </el-row>
                    <el-row class="text item">
                        <el-col :span="12">
                            <span>交易额（元）：</span>
                            <span class="bigText">160,920</span>
                        </el-col>
                        <el-col :span="12">
                            <span style="line-height: 30px;">平均金额（元）：11,047</span>
                        </el-col>
                    </el-row>
                </el-card>
            </el-col>
            <el-col :span="8">
                <el-card class="box-card">
                    <el-row class="text item">
                        <el-col :span="12">
                            <span class="bigText">昨日</span>
                        </el-col>
                        <el-col :span="12">
                            <span style="line-height: 20px;">笔数: 100</span>
                        </el-col>
                    </el-row>
                    <el-row class="text item">
                        <el-col :span="12">
                            <span>交易额（元）：220,833</span>
                        </el-col>
                        <el-col :span="12">
                            <span style="line-height: 20px;">平均金额（元）：11,047</span>
                        </el-col>
                    </el-row>
                </el-card>
            </el-col>
            <el-col :span="8">
                <el-card class="box-card">
                    <el-row class="text item">
                        <el-col :span="12">
                            <span class="bigText">前日</span>
                        </el-col>
                        <el-col :span="12">
                            <span style="line-height: 20px;">笔数: 100</span>
                        </el-col>
                    </el-row>
                    <el-row class="text item">
                        <el-col :span="12">
                            <span>交易额（元）：199,106</span>
                        </el-col>
                        <el-col :span="12">
                            <span style="line-height: 20px;">平均金额（元）：12,113</span>
                        </el-col>
                    </el-row>
                </el-card>
            </el-col>
        </el-row>
        <el-row>
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span style="line-height: 36px;">还款／逾期分析</span>
                    <el-button style="float: right;" type="primary">7日</el-button>
                </div>
                <el-row>
                    <el-col :span="12">
                        <div id="line" style="width: 600px;height:400px;"></div>
                    </el-col>
                    <el-col :span="12">
                        <div id="lineStack" style="width: 600px;height:400px;"></div>
                    </el-col>
                </el-row>
                <el-row :gutter="50">
                    <el-col :span="6">
                        <el-card class="box-card">
                            <div class="text item">
                                <span class="bigText">¥837,694.00</span>
                            </div>
                            <div class="text item">
                                <span>7日到期金额</span>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="6">
                        <el-card class="box-card">
                            <div class="text item">
                                <span class="bigText">760</span>
                            </div>
                            <div class="text item">
                                <span>7日到期笔数</span>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="6">
                        <el-card class="box-card">
                            <div class="text item">
                                <span class="bigText">¥17,694.50</span>
                            </div>
                            <div class="text item">
                                <span>7日逾期金额</span>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="6">
                        <el-card class="box-card">
                            <div class="text item">
                                <span class="bigText">56</span>
                            </div>
                            <div class="text item">
                                <span>7日逾期笔数</span>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
            </el-card>
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
                lineCharts: '',
                lineStackCharts: '',
            }
        },
        mounted(){
            this.drawLine('line');
            this.drawLineStack('lineStack');
        },
        methods: {
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
        font-size: 12px;
    }

    .bigText {
        font-size: 24px;
    }

    .item {
        padding: 18px 0;
        vertical-align: bottom;
    }
</style>