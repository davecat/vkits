<script src="../../../../../../Downloads/china.js"></script>
<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="fa fa-dashboard"></i> 控制台</el-breadcrumb-item>
                <el-breadcrumb-item>首页</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-row>
            <el-button type="primary" @click="test">测试Get</el-button>
            <el-button type="primary" @click="test2">测试用户信息</el-button>
            <el-button type="primary" @click="test3">测试合并请求</el-button>
            <el-button type="primary" @click="getMenu">获取Menu</el-button>
        </el-row>

        <el-row>
            <el-col :span="12">
                <!-- 为 ECharts 准备一个具备大小（宽高）的 DOM -->
                <div id="bar" style="width: 600px;height:400px;"></div>
            </el-col>
            <el-col :span="12">
                <div id="chinaMap" style="width: 600px;height:400px;"></div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <div id="line" style="width: 600px;height:400px;"></div>
            </el-col>
            <el-col :span="12">
                <div id="circular" style="width: 600px;height:400px;"></div>
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
                charts: '',
                mapCharts: '',
                lineCharts: '',
                barCharts: '',
                opinion: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎'],
                opinionData: [
                    {value: 335, name: '直接访问'},
                    {value: 310, name: '邮件营销'},
                    {value: 234, name: '联盟广告'},
                    {value: 135, name: '视频广告'},
                    {value: 1548, name: '搜索引擎'}
                ]
            }
        },
        mounted(){
            this.drawPie('circular');
            this.drawMap('chinaMap');
            this.drawLine('line');
            this.drawBar('bar');
        },
        methods: {
            test() {
                this.axios.get("/api/v1/menu").then((response) => {
                    console.log(response.data);
                }).catch((error) => {
                    console.log(error);
                })
            },
            test2() {
                this.axios.get("/api/v1/user/current").then((response) => {
                    console.log(response.data);
                }).catch((error) => {
                    console.log(error);
                })
            },
            test3() {
                this.axios.all([this.getUserAccount(), this.getUserPermissions()]).then((response) => {
                    console.log(response.data);
                }).catch((error) => {
                    console.log(error);
                })
            },
            getMenu() {
                this.axios.get("/api/menus").then((response) => {
                    console.log(response.data);
                }).catch((error) => {
                    console.log(error);
                })
            },
            getUserAccount() {
                return this.axios.get('/api/user/12345');
            },
            getUserPermissions() {
                return this.axios.post("/api/user", {
                    firstName: 'Ethan',
                    lastName: 'Liu'
                });
            },
            drawPie(id){
                this.charts = echarts.init(document.getElementById(id));
                this.charts.setOption({
                    tooltip: {
                        trigger: 'item',
                        formatter: '{a}<br/>{b}:{c} ({d}%)'
                    },
                    legend: {
                        orient: 'vertical',
                        x: 'left',
                        data: this.opinion
                    },
                    series: [
                        {
                            name: '访问来源',
                            type: 'pie',
                            radius: ['50%', '70%'],
                            avoidLabelOverlap: false,
                            label: {
                                normal: {
                                    show: false,
                                    position: 'center'
                                },
                                emphasis: {
                                    show: true,
                                    textStyle: {
                                        fontSize: '30',
                                        fontWeight: 'blod'
                                    }
                                }
                            },
                            labelLine: {
                                normal: {
                                    show: false
                                }
                            },
                            data: this.opinionData
                        }
                    ]
                })
            },
            randomData() {
                return Math.round(Math.random() * 1000);
            },
            drawMap(id) {
                echarts.registerMap('china', chinaJson);
                this.mapCharts = echarts.init(document.getElementById(id));
                this.mapCharts.setOption({
                    title: {
                        text: 'iphone销量',
                        subtext: '纯属虚构',
                        left: 'center'
                    },
                    tooltip: {
                        trigger: 'item'
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left',
                        data: ['iphone3', 'iphone4', 'iphone5']
                    },
                    visualMap: {
                        min: 0,
                        max: 2500,
                        left: 'left',
                        top: 'bottom',
                        text: ['高', '低'],           // 文本，默认为数值文本
                        calculable: true
                    },
                    toolbox: {
                        show: true,
                        orient: 'vertical',
                        left: 'right',
                        top: 'center',
                        feature: {
                            dataView: {readOnly: false},
                            restore: {},
                            saveAsImage: {}
                        }
                    },
                    series: [
                        {
                            name: 'iphone3',
                            type: 'map',
                            mapType: 'china',
                            roam: false,
                            label: {
                                normal: {
                                    show: true
                                },
                                emphasis: {
                                    show: true
                                }
                            },
                            data: [
                                {name: '北京', value: this.randomData()},
                                {name: '天津', value: this.randomData()},
                                {name: '上海', value: this.randomData()},
                                {name: '重庆', value: this.randomData()},
                                {name: '河北', value: this.randomData()},
                                {name: '河南', value: this.randomData()},
                                {name: '云南', value: this.randomData()},
                                {name: '辽宁', value: this.randomData()},
                                {name: '黑龙江', value: this.randomData()},
                                {name: '湖南', value: this.randomData()},
                                {name: '安徽', value: this.randomData()},
                                {name: '山东', value: this.randomData()},
                                {name: '新疆', value: this.randomData()},
                                {name: '江苏', value: this.randomData()},
                                {name: '浙江', value: this.randomData()},
                                {name: '江西', value: this.randomData()},
                                {name: '湖北', value: this.randomData()},
                                {name: '广西', value: this.randomData()},
                                {name: '甘肃', value: this.randomData()},
                                {name: '山西', value: this.randomData()},
                                {name: '内蒙古', value: this.randomData()},
                                {name: '陕西', value: this.randomData()},
                                {name: '吉林', value: this.randomData()},
                                {name: '福建', value: this.randomData()},
                                {name: '贵州', value: this.randomData()},
                                {name: '广东', value: this.randomData()},
                                {name: '青海', value: this.randomData()},
                                {name: '西藏', value: this.randomData()},
                                {name: '四川', value: this.randomData()},
                                {name: '宁夏', value: this.randomData()},
                                {name: '海南', value: this.randomData()},
                                {name: '台湾', value: this.randomData()},
                                {name: '香港', value: this.randomData()},
                                {name: '澳门', value: this.randomData()}
                            ]
                        },
                        {
                            name: 'iphone4',
                            type: 'map',
                            mapType: 'china',
                            label: {
                                normal: {
                                    show: true
                                },
                                emphasis: {
                                    show: true
                                }
                            },
                            data: [
                                {name: '北京', value: this.randomData()},
                                {name: '天津', value: this.randomData()},
                                {name: '上海', value: this.randomData()},
                                {name: '重庆', value: this.randomData()},
                                {name: '河北', value: this.randomData()},
                                {name: '安徽', value: this.randomData()},
                                {name: '新疆', value: this.randomData()},
                                {name: '浙江', value: this.randomData()},
                                {name: '江西', value: this.randomData()},
                                {name: '山西', value: this.randomData()},
                                {name: '内蒙古', value: this.randomData()},
                                {name: '吉林', value: this.randomData()},
                                {name: '福建', value: this.randomData()},
                                {name: '广东', value: this.randomData()},
                                {name: '西藏', value: this.randomData()},
                                {name: '四川', value: this.randomData()},
                                {name: '宁夏', value: this.randomData()},
                                {name: '香港', value: this.randomData()},
                                {name: '澳门', value: this.randomData()}
                            ]
                        },
                        {
                            name: 'iphone5',
                            type: 'map',
                            mapType: 'china',
                            label: {
                                normal: {
                                    show: true
                                },
                                emphasis: {
                                    show: true
                                }
                            },
                            data: [
                                {name: '北京', value: this.randomData()},
                                {name: '天津', value: this.randomData()},
                                {name: '上海', value: this.randomData()},
                                {name: '广东', value: this.randomData()},
                                {name: '台湾', value: this.randomData()},
                                {name: '香港', value: this.randomData()},
                                {name: '澳门', value: this.randomData()}
                            ]
                        }
                    ]
                })
            },
            drawLine(id) {
                this.lineCharts = echarts.init(document.getElementById(id));
                this.lineCharts.setOption({
                    title: {
                        text: '堆叠区域图'
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
                        data: ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎']
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
                            name: '邮件营销',
                            type: 'line',
                            stack: '总量',
                            areaStyle: {normal: {}},
                            data: [120, 132, 101, 134, 90, 230, 210]
                        },
                        {
                            name: '联盟广告',
                            type: 'line',
                            stack: '总量',
                            areaStyle: {normal: {}},
                            data: [220, 182, 191, 234, 290, 330, 310]
                        },
                        {
                            name: '视频广告',
                            type: 'line',
                            stack: '总量',
                            areaStyle: {normal: {}},
                            data: [150, 232, 201, 154, 190, 330, 410]
                        },
                        {
                            name: '直接访问',
                            type: 'line',
                            stack: '总量',
                            areaStyle: {normal: {}},
                            data: [320, 332, 301, 334, 390, 330, 320]
                        },
                        {
                            name: '搜索引擎',
                            type: 'line',
                            stack: '总量',
                            label: {
                                normal: {
                                    show: true,
                                    position: 'top'
                                }
                            },
                            areaStyle: {normal: {}},
                            data: [820, 932, 901, 934, 1290, 1330, 1320]
                        }
                    ]
                })
            },
            drawBar(id) {
                var barHeight = 50;
                var cities = ['北京', '上海', '深圳', '广州', '苏州', '杭州', '南京', '福州', '青岛', '济南', '长春', '大连', '温州', '郑州', '武汉', '成都', '东莞', '沈阳', '烟台'];
                var data = [
                    [5000, 10000, 6785.71],
                    [4000, 10000, 6825],
                    [3000, 6500, 4463.33],
                    [2500, 5600, 3793.83],
                    [2000, 4000, 3060],
                    [2000, 4000, 3222.33],
                    [2500, 4000, 3133.33],
                    [1800, 4000, 3100],
                    [2000, 3500, 2750],
                    [2000, 3000, 2500],
                    [1800, 3000, 2433.33],
                    [2000, 2700, 2375],
                    [1500, 2800, 2150],
                    [1500, 2300, 2100],
                    [1600, 3500, 2057.14],
                    [1500, 2600, 2037.5],
                    [1500, 2417.54, 1905.85],
                    [1500, 2000, 1775],
                    [1500, 1800, 1650]
                ];
                this.barCharts = echarts.init(document.getElementById(id));
                this.barCharts.setOption({
                    title: {
                        text: '在中国租个房子有多贵？',
                    },
                    legend: {
                        show: true,
                        data: ['价格范围', '均值']
                    },
                    grid: {
                        top: 100
                    },
                    angleAxis: {
                        type: 'category',
                        data: cities
                    },
                    tooltip: {
                        show: true,
                        formatter: function (params) {
                            var id = params.dataIndex;
                            return cities[id] + '<br>最高：' + data[id][0] + '<br>最低：' + data[id][1] + '<br>平均：' + data[id][2];
                        }
                    },
                    radiusAxis: {},
                    polar: {},
                    series: [{
                        type: 'bar',
                        itemStyle: {
                            normal: {
                                color: 'transparent'
                            }
                        },
                        data: data.map(function (d) {
                            return d[0];
                        }),
                        coordinateSystem: 'polar',
                        stack: '最大最小值',
                        silent: true
                    }, {
                        type: 'bar',
                        data: data.map(function (d) {
                            return d[1] - d[0];
                        }),
                        coordinateSystem: 'polar',
                        name: '价格范围',
                        stack: '最大最小值'
                    }, {
                        type: 'bar',
                        itemStyle: {
                            normal: {
                                color: 'transparent'
                            }
                        },
                        data: data.map(function (d) {
                            return d[2] - barHeight;
                        }),
                        coordinateSystem: 'polar',
                        stack: '均值',
                        silent: true,
                        z: 10
                    }, {
                        type: 'bar',
                        data: data.map(function (d) {
                            return barHeight * 2
                        }),
                        coordinateSystem: 'polar',
                        name: '均值',
                        stack: '均值',
                        barGap: '-100%',
                        z: 10
                    }]
                })
            }
        }
    }
</script>
<style>
    * {
        margin: 0;
        padding: 0;
        list-style: none;
    }
</style>