
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
    /*
    var chartIR = Highcharts.chart('container-IR', Highcharts.merge(gaugeOptions, {
        yAxis: {
            min: 0,
            max: 10000,
            title: {
                text: 'IR'
            }
        },

        credits: {
            enabled: false
        },

        series: [{
            name: 'IR',
            data: [0],
            dataLabels: {
                format: '<div style="text-align:center"><span style="font-size:25px;color:' +
                    ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y:.1f}</span><br/>' +
                       '<span style="font-size:12px;color:silver">Lux</span></div>'
            },
            tooltip: {
                valueSuffix: ' Lux'
            }
        }]

    }));

    // The hum gauge
    var chartVisible = Highcharts.chart('container-visible', Highcharts.merge(gaugeOptions, {
        yAxis: {
            min: 0,
            max: 10000,
            title: {
                text: 'Visible'
            }
        },

        series: [{
            name: 'Visible',
            data: [0],
            dataLabels: {
                format: '<div style="text-align:center"><span style="font-size:25px;color:' +
                    ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y:.1f}</span><br/>' +
                       '<span style="font-size:12px;color:silver">Lux</span></div>'
            },
            tooltip: {
                valueSuffix: ' Lux'
            }
        }]

    }));
    */
    
      // The press gauge
    var chartFull = Highcharts.chart('container-full', Highcharts.merge(gaugeOptions, {
        yAxis: {
            min: 0,
            max: 10000,
            title: {
                text: 'Full'
            }
        },

        credits: {
            enabled: false
        },

        series: [{
            name: 'Full',
            data: [0],
            dataLabels: {
                format: '<div style="text-align:center"><span style="font-size:25px;color:' +
                    ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y:.1f}</span><br/>' +
                       '<span style="font-size:12px;color:silver">Lux</span></div>'
            },
            tooltip: {
                valueSuffix: ' Lux'
            }
        }]

    }));


    // Bring life to the dials
    setInterval(function () {
        
    $.getJSON(
    "/app/tsl2561/command",//url
    {"command":"TSL2561", "arg":[""]},//data
    function(data) {
    //dataがサーバから受け取るjson値
    $.each(data, 
    function(key, val) {
    rdata = val.split('<br>');
    
    //console.log('rdata=|'+val+'|');
    var point,IR=0,visible=0,full=0;
    /*
    IR  = parseFloat(rdata[7].split(' ')[1]);
    visible = parseFloat(rdata[8].split(' ')[1]);
    full = parseFloat(rdata[11].split(' ')[1])/10.0;
    */
    full = parseFloat(val);
    //console.log('IR='+IR+' visible='+visible+' full='+full);
        /*
        // Temp
        if (chartIR) {
            point = chartIR.series[0].points[0];
            point.update(IR);
        }

        // Hum
        if (chartVisible) {
            point = chartVisible.series[0].points[0];
            point.update(visible);
        }
        */
        // Press
        if (chartFull) {
            point = chartFull.series[0].points[0];
            point.update(full);
        }
        
    //console.log(rdata);
            
            }); 
        });
        
    }, 2000);

});


