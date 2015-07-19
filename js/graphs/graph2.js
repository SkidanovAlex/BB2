// Data retrieved from http://vikjavev.no/ver/index.php?spenn=2d&sluttid=16.06.2015.
$(function () {
    $('#graph2').highcharts({
        chart: {
            type: 'spline'
        },
        title: {
            text: 'Time to solve a puzzle over time'
        },
        xAxis: {
            type: 'datetime',
            labels: {
                overflow: 'justify'
            }
        },
        yAxis: {
            title: {
                text: 'Time to solve puzzle'
            },
            min: 0,
            minorGridLineWidth: 0,
            gridLineWidth: 0,
            alternateGridColor: null,
            plotBands: [{ // Light air
                from: 0,
                to: 20,
                color: 'rgba(68, 170, 213, 0.1)',
                label: {
                    text: 'Light air',
                    style: {
                        color: '#606060'
                    }
                }
            }, { // Light breeze
                from: 20,
                to: 40,
                color: 'rgba(0, 0, 0, 0)',
                label: {
                    text: 'Light breeze',
                    style: {
                        color: '#606060'
                    }
                }
            }, { // Gentle breeze
                from: 40,
                to: 60,
                color: 'rgba(68, 170, 213, 0.1)',
                label: {
                    text: 'Gentle breeze',
                    style: {
                        color: '#606060'
                    }
                }
            }, { // Moderate breeze
                from: 60,
                to: 80,
                color: 'rgba(0, 0, 0, 0)',
                label: {
                    text: 'Moderate breeze',
                    style: {
                        color: '#606060'
                    }
                }
            }, { // Fresh breeze
                from: 80,
                to: 90,
                color: 'rgba(68, 170, 213, 0.1)',
                label: {
                    text: 'Fresh breeze',
                    style: {
                        color: '#606060'
                    }
                }
            }, { // Strong breeze
                from: 90,
                to: 100,
                color: 'rgba(0, 0, 0, 0)',
                label: {
                    text: 'Strong breeze',
                    style: {
                        color: '#606060'
                    }
                }
            }]
        },
        tooltip: {
            valueSuffix: ' %'
        },
        plotOptions: {
            spline: {
                lineWidth: 4,
                states: {
                    hover: {
                        lineWidth: 5
                    }
                },
                marker: {
                    enabled: false
                },
                pointInterval: 3600000, // one hour
                pointStart: Date.UTC(2015, 6, 18, 0, 0, 0)
            }
        },
        series: [{
            name: 'Set Difference',
            data: [69, 55, 57, 61, 59, 55, 51, 39, 51, 47, 50, 45, 40, 39, 39, 38, 30, 29, 32, 29, 26, 17, 16, 23, 18, 20, 15, 12, 14, 12]

        }, {
            name: 'Graph Theory ',
            data: [78, 65, 71, 68, 59, 55, 58, 55, 61, 59, 50, 45, 50, 54, 52, 51, 50, 45, 46, 44, 43, 45, 44, 37, 23, 20, 10, 8, 8, 12]
        }, {
            name: 'Probability Theory',
            data: [135, 138, 126, 130, 117, 115, 109, 104, 108, 101, 101, 98, 84, 83, 80, 75, 76, 65, 61, 60, 62, 57, 53, 43, 42, 32, 37, 31, 27, 17]
        }, {
            name: '3D',
            data: [129, 130, 118, 121, 110, 115, 107, 101, 105, 93, 94, 89, 78, 81, 77, 68, 76, 65, 61, 57, 52, 49, 44, 36, 33, 22, 37, 23, 18, 8]
        }],
        navigation: {
            menuItemStyle: {
                fontSize: '10px'
            }
        }
    });
});