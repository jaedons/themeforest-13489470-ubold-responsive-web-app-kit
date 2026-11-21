/**
Template Name: Ubold Dashboard
Author: CoderThemes
Email: coderthemes@gmail.com
File: Chartjs
*/


!function($) {
    "use strict";

    var ChartJs = function() {};

    ChartJs.prototype.respChart = function respChart(selector,type,data, options) {
        const canvas = selector.get(0);
        const chartType = {Line: 'line', Doughnut: 'doughnut', Pie: 'pie', Bar: 'bar', Radar: 'radar', PolarArea: 'polarArea'}[type];
        const modernData = Array.isArray(data) ? {
            labels: data.map(item => item.label),
            datasets: [{data: data.map(item => item.value), backgroundColor: data.map(item => item.color)}]
        } : {
            labels: data.labels,
            datasets: data.datasets.map((item, index) => ({
                label: 'Series ' + (index + 1), data: item.data,
                backgroundColor: item.fillColor, borderColor: item.strokeColor,
                pointBackgroundColor: item.pointColor, pointBorderColor: item.pointStrokeColor,
                hoverBackgroundColor: item.highlightFill, fill: type === 'Line' || type === 'Radar'
            }))
        };
        const existing = Chart.getChart(canvas);
        if (existing) existing.destroy();
        return new Chart(canvas, {type: chartType, data: modernData,
            options: Object.assign({responsive: true}, options || {})});
    },
    //init
    ChartJs.prototype.init = function() {
        //creating lineChart
        var LineChart = {
            labels : ["January","February","March","April","May","June","July"],
            datasets : [
                {
                    fillColor : "rgba(93, 156, 236, 0.5)",
                    strokeColor : "rgba(93, 156, 236, 1)",
                    pointColor : "rgba(93, 156, 236, 1)",
                    pointStrokeColor : "#fff",
                    data : [33,52,63,92,50,53,46]
                },
                {
                    fillColor : "rgba(95, 190, 170, 0.5)",
                    strokeColor : "rgba(95, 190, 170, 1)",
                    pointColor : "rgba(95, 190, 170, 1)",
                    pointStrokeColor : "#fff",
                    data : [22,20,30,60,29,25,12]
                }
                
            ]
        };
        
        this.respChart($("#lineChart"),'Line',LineChart);

        //donut chart
        var DonutChart = [
            {
                value: 300,
                color: "#5fbeaa",
                highlight: "#5fbeaa",
                label: "Chrome"
            }, {
                value: 50,
                color: "#36404a",
                highlight: "#36404a",
                label: "IE"
            }, {
                value: 40,
                color: "#ebeff2",
                highlight: "#ebeff2",
                label: "Other"
            }, {
                value: 120,
                color: "#5d9cec",
                highlight: "#5d9cec",
                label: "Firefox"
            }

        ]
        this.respChart($("#doughnut"),'Doughnut',DonutChart);


        //Pie chart
        var PieChart = [
            {
                value: 40,
                color:"#ebeff2",
                label: "IE"
            },
            {
                value : 80,
                color : "#5fbeaa",
                label: "Chrome"
            },
            {
                value : 70,
                color : "#5d9cec",
                label: "Safari"
            }
        ]
        this.respChart($("#pie"),'Pie',PieChart);


        //barchart
        var BarChart = {
            labels : ["January","February","March","April","May","June","July"],
            datasets : [
                {
                    fillColor: 'rgba(93, 156, 236, 0.7)',
                    strokeColor: 'rgba(93, 156, 236, 1)',
                    highlightFill: 'rgba(93, 156, 236, 1)',
                    highlightStroke: 'rgba(93, 156, 236, 0.9)',
                    data : [65,59,90,81,56,55,40]
                },
                {
                    fillColor: 'rgba(235, 239, 242, 0.7)',
                    strokeColor: 'rgba(235, 239, 242, 1)',
                    highlightFill: 'rgba(235, 239, 242, 1)',
                    highlightStroke: 'rgba(235, 239, 242, 0.9)',
                    data : [28,48,40,19,96,27,100]
                }
            ]
        }
        this.respChart($("#bar"),'Bar',BarChart);
        
        
        //barchart-Single
        var BarChartSingle = {
            labels : ["January","February","March","April","May","June","July","August","September","October","November","December"],
            datasets : [
                {
                    fillColor: '#ebeff2',
                    strokeColor: '#ebeff2',
                    highlightFill: '#5fbeaa',
                    highlightStroke: '#ebeff2',
                    data : [65,59,90,81,56,55,40,34,50,35,90,75]
                }
            ]
        }
        this.respChart($("#bar-single"),'Bar',BarChartSingle);

        //radar chart
        var RadarChart = {
            labels : ["Eating","Drinking","Sleeping","Designing","Coding","Partying","Running"],
            datasets : [
                {
                    fillColor : "rgba(93, 156, 236, 0.5)",
                    strokeColor : "rgba(93, 156, 236, 0.5)",
                    pointColor : "rgba(93, 156, 236, 1)",
                    pointStrokeColor : "#fff",
                    data : [65,59,90,81,56,55,40]
                },
                {
                    fillColor : "rgba(54, 64, 74, 0.5)",
                    strokeColor : "rgba(54, 64, 74, 0.8)",
                    pointColor : "rgba(54, 64, 74, 1)",
                    pointStrokeColor : "#fff",
                    data : [28,48,40,19,96,27,100]
                }
            ]
        }
        this.respChart($("#radar"),'Radar',RadarChart);

        //Polar area chart
        var PolarChart = [
            
            {
                value : 90,
                color: "#5fbeaa",
                label: "Chrom"
            },
            {
                value : 24,
                color: "#1a2942",
                label: "Firefox"
            },
            {
                value : 58,
                color: "#5d9cec",
                label: "Other"
            },
            
            {
                value : 42,
                color: "#ebeff2",
                label: "IE9+"
            }
        ]
        this.respChart($("#polarArea"),'PolarArea',PolarChart);
    },
    $.ChartJs = new ChartJs, $.ChartJs.Constructor = ChartJs

}(window.jQuery),

//initializing 
function($) {
    "use strict";
    $.ChartJs.init()
}(window.jQuery);

