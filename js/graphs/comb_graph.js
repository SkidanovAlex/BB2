$(function () {
    $('#comb_graph').highcharts({
        title: {
            text: 'Probability'
        },
        xAxis: {
            categories: ['Game 1', 'Game 2', 'Game 3', 'Game 4', 'Game 5']
        },
        labels: {
            items: [{
                html: 'Wins / Loses',
                style: {
                    left: '50px',
                    top: '18px',
                    color: (Highcharts.theme && Highcharts.theme.textColor) || 'black'
                }
            }]
        },
        series: [{
            type: 'column',
            name: 'Your progress',
            color: "green",
            data: [3, 2, 1, 3, 4]
        }, {
            type: 'column',
            name: 'Expected progress',
            color: "blue",
            data: [2, 3, 5, 7, 6]
        }, {
            type: 'pie',
            name: 'Compare wins/loses',
            data: [{
                name: 'Wins',
                y: 13,
                color: "green"
            }, {
                name: 'Loses',
                y: 23,
                color: "red"
            }],
            center: [100, 80],
            size: 100,
            showInLegend: false,
            dataLabels: {
                enabled: false
            }
        }]
    });
});

