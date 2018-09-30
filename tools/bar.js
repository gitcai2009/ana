// 引入 ECharts 主模块
var echarts = require('echarts/lib/echarts');
// 引入柱状图
require('echarts/lib/chart/bar');
// 引入提示框和标题组件
require('echarts/lib/component/tooltip');
require('echarts/lib/component/title');


module.exports = {
    add: function aad() {
        var myChart = echarts.init(document.getElementById('damageSuma'));
        myChart.setOption({
            title: {
                text: '各区总收入占比',
                x: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                x: 'left',
                data: ['海口区', '琼海区', '三亚区', '东方区', '儋州区']
            },
            toolbox: {
                show: true,
                feature: {
        //                    dataView : {show: true, readOnly: false},
        //                    restore : {show: true},
                    saveAsImage: {show: true}
                }
            },
            calculable: true,
            series: [
                {
                    name: '各区收入比',
                    type: 'pie',
                    radius: '60%',
                    center: ['50%', '50%'],
                    data: [
                        {value: 335, name: '海口区'},
                        {value: 810, name: '琼海区'},
                        {value: 234, name: '儋州区'},
                        {value: 135, name: '东方区'},
                        {value: 548, name: '三亚区'}
                    ],
                    itemStyle: {
                        normal: {
                            label: {
                                show: true,
                                formatter: '{b}:{c}' + '\n\r' + '({d}%)'
                            },
                            labelLine: {show: true}
                        }
                    }
                }
            ]
        })
    }
};