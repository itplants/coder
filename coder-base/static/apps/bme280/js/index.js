
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
    var chartTmp = Highcharts.chart('container-tmp', Highcharts.merge(gaugeOptions, {
        yAxis: {
            min: 0,
            max: 40,
            title: {
                text: 'Temp'
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

    // The hum gauge
    var chartHum = Highcharts.chart('container-hum', Highcharts.merge(gaugeOptions, {
        yAxis: {
            min: 0,
            max: 100,
            title: {
                text: 'Hum'
            }
        },

        series: [{
            name: 'Hum',
            data: [0],
            dataLabels: {
                format: '<div style="text-align:center"><span style="font-size:25px;color:' +
                    ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y:.1f}</span><br/>' +
                       '<span style="font-size:12px;color:silver">%RH</span></div>'
            },
            tooltip: {
                valueSuffix: ' %RH'
            }
        }]

    }));
    
      // The press gauge
    var chartPress = Highcharts.chart('container-press', Highcharts.merge(gaugeOptions, {
        yAxis: {
            min: 0,
            max: 1500,
            title: {
                text: 'Press'
            }
        },

        credits: {
            enabled: false
        },

        series: [{
            name: 'Press',
            data: [0],
            dataLabels: {
                format: '<div style="text-align:center"><span style="font-size:25px;color:' +
                    ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y:.1f}</span><br/>' +
                       '<span style="font-size:12px;color:silver">hPa</span></div>'
            },
            tooltip: {
                valueSuffix: ' hPa'
            }
        }]

    }));


    // Bring life to the dials
    setInterval(function () {
        
    $.getJSON(
    "/app/bme280/command",//url
    {"command":"BME280", "arg":[""]},//data
    function(data) {
    //dataがサーバから受け取るjson値
    $.each(data, 
    function(key, val) {
    rdata = val;
    //console.log('rdata='+val);
    var point,temp=0,hum=0,press=0;

    temp  = parseFloat(rdata.split(' ')[5]);
    hum   = parseFloat(rdata.split(' ')[1]);
    press = parseFloat(rdata.split(' ')[3]);
    console.log('temp='+temp+'hum='+hum+'press='+press);
    
        // Temp
        if (chartTmp) {
            point = chartTmp.series[0].points[0];
            point.update(temp);
        }

        // Hum
        if (chartHum) {
            point = chartHum.series[0].points[0];
            point.update(hum);
        }
        
        // Press
        if (chartPress) {
            point = chartPress.series[0].points[0];
            point.update(press);
        }
        
    //console.log(rdata);
            
            }); 
        });
        
    }, 2000);

});

