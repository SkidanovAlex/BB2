$(function () {
    $('#graph3').highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: 'How often do you skip puzzle'
        },
        xAxis: {
            categories: [
                'Jul 18, 5:00',
                'Jul 18, 9:00',
                'Jul 19, 1:00',
                'Jul 19, 5:00',
                'Jul 19, 9:00'
            ],
            crosshair: true
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Times'
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: [{
            name: 'Set difference',
            data: [5.9, 7.5, 10.4, 12.2, 14.0]

        }, {
            name: 'Probability',
            data: [5.6, 8.8, 9.5, 9.4, 10.0]

        }, {
            name: 'Graph Theory',
            data: [3.9, 3.8, 3.3, 4.4, 4.0]

        }, {
            name: 'Integral',
            data: [2.4, 3.2, 4.5, 3.7, 5.6]

        }]
    });
});