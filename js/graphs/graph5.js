$(function () {
    //$.getJSON('http://www.highcharts.com/samples/data/jsonp.php?filename=usdeur.json&callback=?', function (data) {

        $('#graph5').highcharts({
            chart: {
                zoomType: 'x'
            },
            title: {
                text: 'You overall progress'
            },
            xAxis: {
                type: 'datetime'
            },
            yAxis: {
                title: {
                    text: 'Progress'
                }
            },
            legend: {
                enabled: false
            },
            plotOptions: {
                area: {
                    fillColor: {
                        linearGradient: {
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: 1
                        },
                        stops: [
                            [0, Highcharts.getOptions().colors[0]],
                            [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                        ]
                    },
                    marker: {
                        radius: 2
                    },
                    lineWidth: 1,
                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    },
                    threshold: null,
                    pointStart: Date.UTC(2015, 6, 18, 0, 0, 0),
                    pointInterval: 3600000, // one hour
                },
            },

            series: [{
                type: 'area',
                name: 'Progress',
                data: [1.1, 1.2, 1.3, 1.4, 1.5, 2.0, 1.8, 2.3, 10.0, 11, 12, 50, 56]
            }]
        });
    //});
});