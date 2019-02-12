//var Highcharts = require('highcharts');
//var exporting = require('exporting');

var start=0;
var chart=[];
var lawdata=[];
var arg=[''];

function reMakeGraph(args) {
    chart=[];lawdata=[];
    arg=args;
    makeGraph(getTemp(getTargetTemp(checkTempController(document.getElementById("msg").innerHTML=''))));
    document.getElementById("msg").innerHTML='Loading data...';
}

var cmd='monitor';
function loadOneDay(a){
    arg=a;
    cmd='oneDayLog';
    console.log('loadOneDay arg='+a);
    reMakeGraph(a);
}

function makeGraph(f) {
    $.getJSON(
    "/app/monitoring/command",//url
    {"command":'monitor', "arg":[]},//data
    function(data) {
    //dataがサーバから受け取るjson値
    $.each(data, 
    function(key, val) {
    rdata = val.split('<br>');
    if( rdata[rdata.length-1]==='' ) rdata.pop();
    var i=0;
    lawdata=new Array([]);
    for(i=0;i<8;i++) lawdata[i]=new Array([]);
    for(i=0;i<rdata.length;i++){
    var t=Date.parse(rdata[i].split(',')[0]);
    //console.log('t='+t+' '+isNaN(t) );
    if( isNaN(t) === false ){
    date  = t;
    //
    //console.log('date='+rdata[i]);
    temp  = parseFloat(rdata[i].split(',')[1]);
    hum   = parseFloat(rdata[i].split(',')[2]);
    press = parseFloat(rdata[i].split(',')[3]);
    pwm   = parseFloat(rdata[i].split(',')[4]);
    pel   = parseFloat(rdata[i].split(',')[5]);
    cons  = parseFloat(rdata[i].split(',')[6]);
    ah    = parseFloat(rdata[i].split(',')[7]);
    illum = parseFloat(rdata[i].split(',')[8]);
//console.log('illum='+illum);
//console.log(date[i]+' '+temp[i]+' '+hum[i]+' '+ press[i] +' '+pwm[i]+' '+pel[i] +' '+cons[i]+' '+ah[i] );
    lawdata[0][i]=[date,temp];
    lawdata[1][i]=[date,hum];
    lawdata[2][i]=[date,pwm];
    lawdata[3][i]=[date,pel];
    lawdata[4][i]=[date,ah];
    lawdata[5][i]=[date,cons];
    lawdata[6][i]=[date,illum];
    //console.log('date='+date[i]+' temp='+temp[i]+' hum='+hum[i]+' press='+press[i]);
    //console.log('lowdata '+lawdata[1][i]);
        }
    }
    n = i;
    // data check
    for(i=1;i<n-1;i++){
        //console.log('!! '+lawdata[0][i][1]);
        if( lawdata[1][i][1] === 0.0 && lawdata[1][i-1][1] !== 0.0 || isNaN(lawdata[1][i][1])===true ){
            //console.log('Error resume '+lawdata[0][i][1]+' -> '+lawdata[0][i+1][1]);
            lawdata[0][i][1]=lawdata[0][i+1][1];
            lawdata[1][i][1]=lawdata[1][i+1][1];
            lawdata[2][i][1]=lawdata[2][i+1][1];
            lawdata[3][i][1]=lawdata[3][i+1][1];
            lawdata[4][i][1]=lawdata[4][i+1][1];
            lawdata[5][i][1]=lawdata[5][i+1][1];
            lawdata[6][i][1]=lawdata[6][i+1][1];
        }
    }


// 日本時間表示設定
Highcharts.setOptions({
    global: {
        useUTC: false
    }
});

        chart[0]=Highcharts.chart('container1', {
            chart: {
                zoomType: 'xy'
            },
            title: {
                text: 'TempController Log（温湿度）'
            },
            subtitle: {
                text: document.ontouchstart === undefined ?
                        'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
            },
            xAxis: {
                type: 'datetime'
            },
            yAxis:[{
                min: 0,
                max: 40,
                title: {
                    text: '温度'
                },            
                labels: {
                format: '{value} ℃',
                style: {
                    color: Highcharts.getOptions().colors[0]
                }
            }
            }, {
                min: 0,
                max: 100,
                title: {
                    text: '相対湿度'
                },
            labels: {
                format: '{value} %RH',
                style: {
                    color: Highcharts.getOptions().colors[1]
                }
            },
                opposite: true
            }],
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
                    threshold: null
                }
            },

            series: [{
                type: 'line',
                name: '温度',
                data: lawdata[0],
                tooltip: {
                valueSuffix: ' °C'
                },
                yAxis: 0
                },{
                type: 'line',
                name: '湿度',
                data: lawdata[1],
                tooltip: {
                valueSuffix: ' %RH'
                },
                yAxis: 1
                }]
            });
    //////
        chart[1]=Highcharts.chart('container2', {
            chart: {
                zoomType: 'xy'
            },
            title: {
                text: 'TempController Log（制御）'
            },
            subtitle: {
                text: document.ontouchstart === undefined ?
                        'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
            },
            xAxis: {
                type: 'datetime'
            },
            yAxis:[{
                min: -100,
                max: 100,
                title: {
                    text: 'PWM'
                },            
                labels: {
                format: '{value} %',
                style: {
                    color: Highcharts.getOptions().colors[0]
                }
            }
            }, {
                min: -10,
                max: 70,
                title: {
                    text: 'ペルチェ温度'
                },
            labels: {
                format: '{value} ℃',
                style: {
                    color: Highcharts.getOptions().colors[1]
                }
            },
                opposite: true
            }],
            legend: {
                enabled: true
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
                    threshold: null
                }
            },

            series: [{
                type: 'line',
                name: 'PWM',
                data: lawdata[2],
                tooltip: {
                valueSuffix: ' %'
                },
                yAxis: 0
                },{
                type: 'line',
                name: 'ペルチェ温度',
                data: lawdata[3],
                tooltip: {
                valueSuffix: ' ℃'
                },
                yAxis: 1
                }]
            });    
    //
        chart[2]=Highcharts.chart('container3', {
            chart: {
                zoomType: 'xy'
            },
            title: {
                text: 'TempController Log（絶対湿度、露点）'
            },
            subtitle: {
                text: document.ontouchstart === undefined ?
                        'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
            },
            xAxis: {
                type: 'datetime'
            },
            yAxis:[{
                min: 0,
                max: 20,
                title: {
                    text: '絶対湿度'
                },            
                labels: {
                format: '{value} kg/m3',
                style: {
                    color: Highcharts.getOptions().colors[0]
                }
            }
            }, {
                min: -20,
                max: 100,
                title: {
                    text: '露点'
                },
            labels: {
                format: '{value} ℃',
                style: {
                    color: Highcharts.getOptions().colors[1]
                }
            },
                opposite: true
            }],
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
                    threshold: null
                }
            },

            series: [{
                type: 'line',
                name: '絶対湿度',
                data: lawdata[4],
                tooltip: {
                valueSuffix: ' kg/m3'
                },
                yAxis: 0
                },{
                type: 'line',
                name: '露点',
                data: lawdata[5],
                tooltip: {
                valueSuffix: ' ℃'
                },
                yAxis: 1
                }]
            });    
                //
        chart[3]=Highcharts.chart('container4', {
            chart: {
                zoomType: 'xy'
            },
            title: {
                text: 'TempController Log（ペルチェ温度、露点）'
            },
            subtitle: {
                text: document.ontouchstart === undefined ?
                        'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
            },
            xAxis: {
                type: 'datetime'
            },
            yAxis:[{
                min: -20,
                max: 100,
                title: {
                    text: 'ペルチェ湿度'
                },            
                labels: {
                format: '{value} ℃',
                style: {
                    color: Highcharts.getOptions().colors[0]
                }
            }
            }, {
                min: -20,
                max: 80,
                title: {
                    text: '露点'
                },
            labels: {
                format: '{value} ℃',
                style: {
                    color: Highcharts.getOptions().colors[1]
                }
            },
                opposite: true
            }],
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
                    //threshold: null
                }
            },

            series: [{
                type: 'line',
                name: 'ペルチェ温度',
                data: lawdata[3],
                tooltip: {
                valueSuffix: ' ℃'
                },
                yAxis: 0
                },{
                type: 'line',
                name: '露点',
                data: lawdata[5],
                tooltip: {
                valueSuffix: ' ℃'
                },
                yAxis: 1
                }]
            });  
        });
        //////
               chart[4]=Highcharts.chart('container5', {
            chart: {
                zoomType: 'xy'
            },
            title: {
                text: 'TempController Log（照度）'
            },
            subtitle: {
                text: document.ontouchstart === undefined ?
                        'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
            },
            xAxis: {
                type: 'datetime'
            },
            yAxis:[{
                min: 0,
                max: 8000,
                title: {
                    text: '照度'
                },            
                labels: {
                format: '{value} Lux',
                style: {
                    color: Highcharts.getOptions().colors[0]
                    }
                }
            }, /*
                {   
                min: -20,
                max: 80,
                title: {
                    text: '露点'
                },
            labels: {
                format: '{value} ℃',
                style: {
                    color: Highcharts.getOptions().colors[1]
                }
            },
                opposite: true
            }*/
            ],
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
                    //threshold: null
                }
            },
            
            series: [{
                type: 'line',
                name: '照度',
                data: lawdata[6],
                tooltip: {
                valueSuffix: ' ℃'
                },
                yAxis: 0
                }
                /*,{
                type: 'line',
                name: '露点',
                data: lawdata[5],
                tooltip: {
                valueSuffix: ' ℃'
                },
                yAxis: 1
                }*/
                ]
            });
        ////
            document.getElementById("msg").innerHTML='';
           if(f) f();
    });
}

function getTargetTemp(f) {
    //   console.log('getTemp');

    $.getJSON(
    "/app/monitoring/command",//url
    {"command":"getTargetTemp.sh", "arg":['']},//data
    function(data) {
    //dataがサーバから受け取るjson値
    $.each(data, 
    function(key, val) {
    //console.log('val='+val);

    rdata = val.split('<br>');
    //console.log('v='+rdata);
    var v=parseFloat(rdata[0]);
    //console.log('v='+v);
    if(!isFinite(v)) getTemp('');
    //console.log(v);
    if(isFinite(v)) document.getElementById('targettmp').innerHTML='現在の設定温度 : '+parseFloat(v).toFixed(1)+'度';
    if(f) f();
        });
    });
}

function getTemp(f) {
    //   console.log('getTemp');

    $.getJSON(
    "/app/monitoring/command",//url
    {"command":"getCurrentTemp.sh", "arg":['']},//data
    function(data) {
    //dataがサーバから受け取るjson値
    $.each(data, 
    function(key, val) {
    //console.log('val='+val);

    rdata = val.split('<br>');
    //console.log('v='+rdata);
    var v=parseFloat(rdata[0]);
    //console.log('v='+v);
    if(!isFinite(v)) getTemp(f);
    //console.log(v);
    if(isFinite(v)) document.getElementById('curtmp').innerHTML='現在の温度 : '+parseFloat(v).toFixed(1)+'度';
    if(f) f();
        });
    });
}

function checkTempController(f) {
    console.log('checkTempController');
    $.getJSON(
    "/app/monitoring/command",//url
    {"command":"activeQuery", "arg":['']},//data
    function(data) {
    //dataがサーバから受け取るjson値
    $.each(data, 
    function(key, val) {
    console.log('checkTempController val=|'+val+'|');

    rdata = val.split('<br>');
    //console.log('v='+rdata);
    var v=parseInt(rdata[0].split(' ')[1]);
    //console.log('v='+v);
    if(isNaN(v)) checkTempController(f);
    console.log('checkTempController '+v);
    v=parseInt(v);
    document.getElementById('checkTempController').innerHTML='v=|'+v+'|';
    if(isNaN(v)) document.getElementById('checkTempController').innerHTML='tempControllerの記録が開始されました。';
    if(!isNaN(v) && v>1000) document.getElementById('checkTempController').innerHTML='注意　tempControllerが止まっています！！　/home/pi/src/ITBOX/err.logを保存して確認ください。 遅延:'+v+'秒';
    else if(!isNaN(v) && v <= 1000)
        document.getElementById('checkTempController').innerHTML='tempControllerは正常に動作しています。 遅延:'+v+'秒';
        });
        if(f) f();
    });
}

$(document).ready( function() {
    //This code will run after your page loads
    checkTempController('');
    makeGraph(getTemp(getTargetTemp()));
  
  setInterval(function() {
      reMakeGraph();
    }, 60000);

});