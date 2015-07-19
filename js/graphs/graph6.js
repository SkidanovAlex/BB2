$(function () {
    $('#graph6').highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: 'Hit vs being hit'
        },
        xAxis: {
            title: {
                text: 'Skill set'
            },
            categories: ['Set difference', 'Probability', 'Graph', 'Integrals']
        },
        yAxis: {
            title: {
                text: 'Times'
            }
        },
        credits: {
            enabled: false
        },
        series: [{
            name: 'Hit',
            color: 'green',
            data: [5, 3, 4, 7, 2]
        }, {
            name: 'Was hit',
            color: 'red',
            data: [-2, -2, -3, -2, -4]
        }]
    });
});