$(function () {
    $('#graph4').highcharts({
        chart: {
            type: 'pie',
            options3d: {
                enabled: true,
                alpha: 45,
                beta: 0
            }
        },
        title: {
            text: 'Most Favourite Skills'
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                depth: 35,
                dataLabels: {
                    enabled: true,
                    format: '{point.name}'
                }
            }
        },
        series: [{
            type: 'pie',
            name: 'Skills',
            data: [
                ['Integral',   45.0],
                ['Probability',       26.8],
                {
                    name: 'Set difference',
                    y: 12.8,
                    sliced: true,
                    selected: true
                },
                ['Graph',    8.5]
            ]
        }]
    });
});