
$(document).ready( function() {

    //This code will run after your page loads

});

$(function () {

    var gaugeOptions = {

        chart: {
            type: 'solidgauge'
        },

        title: null,

        pane: {
            center: ['50%', '85%'],
            size: '140%',
            startAngle: -90,
            endAngle: 90,
            background: {
                backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || '#EEE',
                innerRadius: '60%',
                outerRadius: '100%',
                shape: 'arc'
            }
        },

        tooltip: {
            enabled: false
        },

        // the value axis
        yAxis: {
            stops: [
                [0.2, '#55BF3B'], // green
                [0.5, '#DDDF0D'], // yellow
                [0.8, '#DF5353'] // red
            ],
            lineWidth: 0,
            minorTickInterval: null,
            tickAmount: 2,
            title: {
                y: -70
            },
            labels: {
                y: 16
            }
        },

        plotOptions: {
            solidgauge: {
                dataLabels: {
                    y: 5,
                    borderWidth: 0,
                    useHTML: true
                }
            }
        }
    };

    // The tmp gauge
    var chartTmp1 = Highcharts.chart('container-tmp1', Highcharts.merge(gaugeOptions, {
        yAxis: {
            min: 0,
            max: 40,
            title: {
                text: 'Temp1'
            }
        },

        credits: {
            enabled: false
        },

        series: [{
            name: 'Temp',
            data: [0],
            dataLabels: {
                format: '<div style="text-align:center"><span style="font-size:25px;color:' +
                    ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y:.1f}</span><br/>' +
                       '<span style="font-size:12px;color:silver">deg</span></div>'
            },
            tooltip: {
                valueSuffix: ' deg'
            }
        }]

    }));

    // The tmp gauge
    var chartTmp2 = Highcharts.chart('container-tmp2', Highcharts.merge(gaugeOptions, {
        yAxis: {
            min: 0,
            max: 40,
            title: {
                text: 'Temp2'
            }
        },

        credits: {
            enabled: false
        },

        series: [{
            name: 'Temp',
            data: [0],
            dataLabels: {
                format: '<div style="text-align:center"><span style="font-size:25px;color:' +
                    ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y:.1f}</span><br/>' +
                       '<span style="font-size:12px;color:silver">deg</span></div>'
            },
            tooltip: {
                valueSuffix: ' deg'
            }
        }]

    }));


    // Bring life to the dials
    setInterval(function () {
        
    $.getJSON(
    "/app/ds18b20/command",//url
    {"command":"DS18B20", "arg":[""]},//data
    function(data) {
    //dataがサーバから受け取るjson値
    $.each(data, 
    function(key, val) {
    rdata = val;
    console.log('rdata='+val);
    var point,temp1=0,temp2=0;

    temp1  = parseFloat(rdata.split(' ')[3]);
    temp2  = parseFloat(rdata.split(' ')[7]);
    console.log('temp1='+temp1+' temp2='+temp2);
    
        // Temp
        if (chartTmp1) {
            point = chartTmp1.series[0].points[0];
            point.update(temp1);
        }

        // Temp
        if (chartTmp2) {
            point = chartTmp2.series[0].points[0];
            point.update(temp2);
        }
        
    //console.log(rdata);
            
            }); 
        });
        
    }, 5000);

});


