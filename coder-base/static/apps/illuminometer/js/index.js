var np = 0;
var chart=[];
var rdata='';

$(function(){
    // 「自室の温度に戻す」ボタンをクリックした時のイベント
 //   $('#rollback').click(function(){
 //    update(); // sendcomで読み直す
 //   });

    // 初回の測定値の取得と、定期処理(5分毎に自動更新)
   // Logger.getVal();
    //update();
    //setInterval(Logger.getVal ,5 * 60 * 1000);

    // グラフオブジェクトの生成
    // 複数プランターの場合、プランターの数だけ生成
    //np = command('%').split('<br>')[1].split(' ')[1];// temp
    //if( np === 0 ) np = 1;
    
    var p = document.getElementById('meters');
    np=6;
        console.log('start');
    command(['-e', '%']).done(function(data) {
    //なんか処理
     $.each(data,
           function(key, val) {
           data = val;
      });
    np = data;

    // for test
    // np='Command: %<br>ndevices  20<br>|';
    console.log('np=|'+np+'|');
    if( np === '' ) np='Command: %<br>ndevices  2<br>|';
    np = parseInt(np.split('<br>')[1].split('  ')[1]);// temp
    nPlanter=np;
    console.log('np='+np);
    
    var txt = '';
    txt ='<div id="container" style="width: 300px; margin-left:auto;margin-right:auto;">';
    for(i=0;i<np;i++){
    txt += '<div id="illumino'+i+'" style="height: 300px; margin: 0 auto"></div>';
    }
    p.innerHTML=txt;
    
    setInterval(updateAll ,5 * 60 * 1000);
    for(i=0;i<np;i++){
    chart[i] = new Highcharts.Chart({
        chart: {
            renderTo: 'illumino'+i, // <<
            type: 'gauge',
            plotBackgroundColor: null,
            plotBackgroundImage: null,
            plotBorderWidth: 0,
            plotShadow: false
        },
        
        title: {
            text: 'illumino'+i
        },
        
       pane: {
            startAngle: -120,
            endAngle:    120,
            background: [{
                backgroundColor: {
                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                    stops: [
                        [0, '#FFF'],
                        [1, '#333']
                    ]
                },
                borderWidth: 0,
                outerRadius: '109%'
            }, {
                backgroundColor: {
                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                    stops: [
                        [0, '#333'],
                        [1, '#FFF']
                    ]
                },
                borderWidth: 1,
                outerRadius: '107%'
            }, {
                // default background
            }, {
                backgroundColor: '#DDD',
                borderWidth: 0,
                outerRadius: '105%',
                innerRadius: '103%'
            }]
        },
           
        // the value axis
        yAxis: {
            min: 0,
            max: 10000,
            
            minorTickInterval: 'auto',
            minorTickWidth: 1,
            minorTickLength: 10,
            minorTickPosition: 'inside',
            minorTickColor: '#666',
    
            tickPixelInterval: 30,
            tickWidth: 2,
            tickPosition: 'inside',
            tickLength: 10,
            tickColor: '#666',
            labels: {
                step: 2,
                rotation: 'auto'
            },
            title: {
                text: 'Lux'
            },
            plotBands: [{
                from: -600,
                to:   -300,
                color: '#10245D'
            }, {
                from: -300,
                to:     0,
                color: '#2059AD'
            }, {
                from:   0,
                to:   3000,
                color: '#71B2B6'
            }, {
                from: 3000,
                to:   6000,
                color: '#C2CE5D'
            }, {
                from: 6000,
                to:   7000,
                color: '#DDDF0D'
            }, {
                from: 7000,
                to:   8000,
                color: '#E79A20'
            }, {
                from: 8000,
                to:   10000,
                color: '#CA0024'
            }]        
        },
    
        series: [{
            name: 'Illuminomometer<br>照度',
            data: [0],
            tooltip: {
                valueSuffix: 'Lux'
            }
        }]
    });

    }// next i
        
        updateAll();
        
    });


});


$(document).ready( function() {

    //This code will run after your page loads
            
});

function loopSleep(_loopLimit,_interval, _mainFunc){
  var loopLimit = _loopLimit;
  var interval = _interval;
  var mainFunc = _mainFunc;
  var i = 0;
  var loopFunc = function () {
    var result = mainFunc(i);
    if (result === false) {
      // break機能
      return;
    }
    i = i + 1;
    if (i < loopLimit) {
      setTimeout(loopFunc, interval);
    }
  }
  loopFunc();
}

function updateAll(){
    console.log('Update All');
    loopSleep(nPlanter, 300, function(i){
        update(i);
        console.log('Update '+i);
    });
}

function sleep(time, callback){
setTimeout(callback, time);
}

function update(n,callback){
    command([n,'-e', 'F']).done(function(data) {
    //console.log('update['+n+'] DONE!');
    //なんか処理
     $.each(data,
           function(key, val) {
           data = val;
      });
    np = data;
    // for test
    if( np === '' ) np='Command: F<br>illum 0<br>';
    console.log('p['+n+']=|'+np+'|');
    var tmp = np.split('<br>')[1].split(' ')[1];// temp
    console.log('Illum=|'+tmp+'|');
    val = tmp;
    var point = chart[n].series[0].points[0];
    point.update(parseFloat(val));
        
    });   
    
}


function message(mes)
{
if ($(document))
  {
      document.getElementById("message").innerHTML=mes;
  }
}

function command( req ) {
    return $.getJSON( 
    "/app/illuminometer/command",//url
    {"command":"sendcom", "arg":req},//data
    function(data) {
    //dataがサーバから受け取るjson値

    $.each(data, 
    function(key, val) {
    rdata = val;
    });
    return rdata;
    });
}



