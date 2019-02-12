var chart=[];
var lawdata=[];

function changeSampling(sp){
    console.log('changeSampling='+sp);
    $.getJSON(
    "/app/o2rec/command",//url
    {"command":"chO2rec.sh", "arg":[sp]},//data
    function(data) {
        $.each(data, 
        function(key, val) {
        rdata = val.split('<br>');
        });
        console.log('changeSampling='+rdata);
        var p=document.getElementById('recog');
        p.innerHTML='サンプリング時間は、'+sp+' sec になりました。';
    });
}

function loadSampling(){
    console.log('loadSampling');
    $.getJSON(
    "/app/o2rec/command",//url
    {"command":"cat", "arg":['/home/pi/src/SensorRec/O2rec.sh']},//data
    function(data) {
        $.each(data, 
        function(key, val) {
        rdata = val.split('<br>');
        });
        samplingTime=rdata[1].split(' ')[2];
        console.log('loadSampling='+samplingTime);
        document.getElementById('sampling').value=samplingTime;
    });
}

function loadOneDay(){
    date=new Date();
    year = date.getFullYear();
    
    month = String(date.getMonth()+1);
    if(month.length===1) month='0'+month;
    
    day = String(date.getDate());
    if(day.length===1) day='0'+day;
    
    hour = String(date.getHours());
    if(hour.length===1) hour='0'+hour;
    
    filename=year+'-'+month+'-'+day+'_'+'*.csv';
    dirpath='./SensorsData/O2/'+year+'/'+month+'/'+day+'/';
    console.log('loadOneDay ls '+dirpath+filename);
    
    $.getJSON(
    "/app/o2rec/command",//url
    {"command":"ls", "arg":[dirpath+filename]},//data
    function(data) {
        $.each(data, 
        function(key, val) {
        //console.log('loadOneDay val='+val+' key='+key);
        var rdata = val.split('<br>');
        if(rdata[rdata.length-1]==='') rdata.pop();
        console.log('loadOneDay rdata='+rdata);
        makeGraph(rdata);
        });
    });
}

function makeGraph(file, f) {
    if( file === undefined ) file=['./SensorsData/O2/saveO2data.csv'];
    console.log('makeGraph file='+file);
    
    $.getJSON(
    "/app/o2rec/command",//url
    {"command":"cat", "arg":file},//data
    function(data) {
        $.each(data, 
        function(key, val) {
        rdata = val.split('<br>');
        });
    if(rdata[rdata.length-1]==='') rdata.pop();
    console.log('makeGraph data='+rdata);
    var i=0;
    lawdata=new Array([]);
    for(i=0;i<6;i++) lawdata[i]=new Array([]);
    for(i=0;i<rdata.length;i++){
    var t=rdata[i].split(',');
    //2018-09-16 10:02:30,CO2,400,TVOC,0,CO2EQ_BASELINE,35187,TVOC_BASELINE,35516
    //console.log('makeGraph t='+t);
    date  = Date.parse(t[0]);
    O2   = parseFloat(t[2]);
    T  = parseFloat(t[4]);
    P = parseFloat(t[6]);
    O2percent  = parseFloat(t[8]);
    
    //console.log('makeGraph date='+date+' O2='+O2+' T='+T+' P='+P+' O2percent='+O2percent );

    lawdata[0][i]=[date,O2];
    lawdata[1][i]=[date,T];
    lawdata[2][i]=[date,P];
    lawdata[3][i]=[date,O2percent];
    }

    // 日本時間表示設定
    Highcharts.setOptions({
        global: {
            useUTC: false
        }
    });

   //////
        chart[0]=Highcharts.chart('container1', {
            chart: {
                zoomType: 'x'
            },
            title: {
                text: 'O2 Log'
            },
            subtitle: {
                text: document.ontouchstart === undefined ?
                        'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
            },
            xAxis: {
                type: 'datetime'
            },
            yAxis:[{
                //min: 150,
                //max: 250,
                title: {
                    text: 'O2'
                },            
                labels: {
                format: '{value} ppm',
                style: {
                    color: Highcharts.getOptions().colors[0]
                }
            }
            }, {
                //min: 15,
                //max: 25,
                title: {
                    text: 'O2%'
                },
            labels: {
                format: '{value} %',
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
                name: 'O2',
                data: lawdata[0],
                tooltip: {
                valueSuffix: ' ppm'
                },
                yAxis: 0
                },{
                type: 'line',
                name: 'O2%',
                data: lawdata[3],
                tooltip: {
                valueSuffix: ''
                },
                yAxis: 1
                }]
            });    
    //////
        chart[1]=Highcharts.chart('container2', {
            chart: {
                zoomType: 'x'
            },
            title: {
                text: 'T Log'
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
                //max: 40,
                title: {
                    text: 'Temp'
                },            
                labels: {
                format: '{value} deg',
                style: {
                    color: Highcharts.getOptions().colors[0]
                }
            }
            }, {
                //min: 900,
                //max: 1100,
                title: {
                    text: 'Press'
                },
            labels: {
                format: '{value} hPa',
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
                name: 'Temp',
                data: lawdata[1],
                tooltip: {
                valueSuffix: ' deg'
                },
                yAxis: 0
                },{
                type: 'line',
                name: 'Press',
                data: lawdata[2],
                tooltip: {
                valueSuffix: 'hPa'
                },
                yAxis: 1
                }]
            });    
                        
        });
        document.getElementById("msg").innerHTML='';
        if(f) f();
}

function getKalmanSW(){
    //console.log('kalmanSwitch ='+kalmanSW);
    var p=document.getElementById('kalmansw1');
    if(p) kalmanSW=p.checked;
    console.log('getKalmanSW p='+p.checked);
}

$(document).ready( function() {
    loadSampling();
    //getKalmanSW();
    makeGraph(['./SensorsData/O2/saveO2data.csv']);  
  setInterval(function() {
    makeGraph();
    }, 60000);

});