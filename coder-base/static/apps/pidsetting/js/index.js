var kp=0.1;
var ki=0.01;
var kd=0.01;
var timePower=[];
var targetTemp=0.0;

function getTimeVal(a){
    t=a.split(':');
    return parseInt(t[0])*60+parseInt(t[1]);
}

function loadTempSchedule(f){
    $.getJSON( 
    "/app/tempschedule/command",//url
    {"command":"setTemps", "arg":['']},//data
    function(data) {
    //dataがサーバから受け取るjson値

    $.each(data, 
    function(key, val) {
    rdata = val.split('<br>');
    });

        var delnum=0;
        for(i=0;i<delnum;i++) delElements(i);
        
//      add Elements
         for(i=0;i<rdata.length-1;i++){
             if(rdata[i]){
        //console.log('rdata='+rdata[i].split(' ')[1]);
            if(rdata[i].split(' ')[0]==='targetTemp'){
            timePower[i]={'time':rdata[i].split(' ')[3].split(':')[0]+':'+rdata[i].split(' ')[3].split(':')[1],'power':rdata[i].split(' ')[1]};
      //console.log('loadTempSchedule['+i+']: |'+timePower[i]['time']+' '+timePower[i]['power']+'|');
            }
            if(rdata[i].split(' ')[0]==='setPID'){
     console.log('loadTempSchedule['+i+']: |'+rdata[i].split(' '));
     console.log('loadTempSchedule['+i+']: |'+rdata[i].split(' ')[4]+' '+rdata[i].split(' ')[4]+' '+rdata[i].split(' ')[6]);
                kp=parseFloat(rdata[i].split(' ')[2]);
                ki=parseFloat(rdata[i].split(' ')[4]);
                kd=parseFloat(rdata[i].split(' ')[6]);
     console.log('loadTempSchedule['+i+']: '+kp+' '+ki+' '+kd);
                setPID();
            }   
                }
            }
            
    timePower.sort(
        function(a,b){
        var aTime = getTimeVal(a["time"]);
        var bTime = getTimeVal(b["time"]);
        if( aTime < bTime ) return -1;
        if( aTime > bTime ) return 1;
        return 0;
        });
        //console.log('timePower'+timePower);
            if(f) f();
    });    
}

function loadPID(f) {
    $.getJSON(
    "/app/pidsetting/command",//url
    {"command":"savePID", "arg":['']},//data
    function(data) {
    //dataがサーバから受け取るjson値
    $.each(data, 
    function(key, val) {
        console.log('loadPID |'+val+'|');
        if(val){
        rdata=val.toString();
        rdata=rdata.replace('<br>','');
        if(rdata.length-1>0){
        kp=parseFloat(rdata.split(' ')[2]);
        ki=parseFloat(rdata.split(' ')[4]);
        kd=parseFloat(rdata.split(' ')[6]);
        setPID();
        }
        }
    });
    if(f) f();
    });
}

function setPID(f){
    document.getElementById('kp').value=kp;
    document.getElementById('ki').value=ki;
    document.getElementById('kd').value=kd;
    if(f) f();
}

function savePID() {
    $.getJSON(
    "/app/pidsetting/command",//url
    {"command":"savePID", "arg":[kp,ki,kd]},//data
    function(data) {
    //dataがサーバから受け取るjson値
    $.each(data, 
    function(key, val) {
        console.log(val);
        loadPID();
    });
    });
}

function changePID(n, v){
    if(isFinite(parseFloat(v))){
        if(n==='kp') kp=parseFloat(v);
        if(n==='ki') ki=parseFloat(v);
        if(n==='kd') kd=parseFloat(v);
        // savePID(kp,ki,kd);
       console.log(n,kp,ki,kd,parseFloat(v));
    }
}

function restGraph(f) {
    $.getJSON(
    "/app/pidsetting/command",//url
    {"command":"cat", "arg":['/dev/null','>','./config/tempController.log']},//data
    function(data) {
    //dataがサーバから受け取るjson値
    $.each(data, 
    function(key, val) {
    });
        if(f) f();
    });
}
function redraw(){
        getTargetTemp(getTemp('',setPID(loadPID(loadTempSchedule(loadTempSchedule(makeGraph()))))));
}

function makeGraph(f) {
    $.getJSON(
    "/app/pidsetting/command",//url
    {"command":"readLog", "arg":['']},//data
    function(data) {
    //dataがサーバから受け取るjson値
    $.each(data, 
    function(key, val) {
    rdata = val.split('<br>');
    //console.log('val='+val);
    var point,date=[],temp=[],hum=[],press=[],pwm=[],ah=[],pel=[],cons=[],lawdata=[],lawdata2=[],lawdata3=[],lawdata4=[],lawdata5=[],lawdata6=[],lawdata7=[];
    var i=0;
    for(l=0;l<rdata.length-1;l++){
    var t=Date.parse(rdata[l].split(',')[0]);
    
    //console.log('t='+rdata[l].split(',')[1] );
    if( isNaN(t) === false ){
    date[i]  = t;
    //console.log('date='+date[i]);
    temp[i]  = parseFloat(rdata[i].split(',')[1]);
    hum[i]   = parseFloat(rdata[i].split(',')[2]);
    press[i] = parseFloat(rdata[i].split(',')[3]);
    pwm[i]   = parseFloat(rdata[i].split(',')[4]);
    pel[i]   = parseFloat(rdata[i].split(',')[5]);
    cons[i]  = parseFloat(rdata[i].split(',')[6]);
    ah[i]    = parseFloat(rdata[i].split(',')[7]);

//console.log(date[i]+' '+temp[i]+' '+hum[i]+' '+ press[i] +' '+pwm[i]+' '+pel[i] +' '+cons[i]+' '+ah[i] );
    lawdata[i]=[date[i],temp[i]];
    lawdata2[i]=[date[i],hum[i]];
    lawdata3[i]=[date[i],pwm[i]];
    lawdata4[i]=[date[i],pel[i]];
    lawdata5[i]=[date[i],ah[i]];
    lawdata6[i]=[date[i],cons[i]];
    lawdata7[i]=[date[i],targetTemp];

    
//    console.log('date='+date[i]+' temp='+temp[i]+' hum='+hum[i]+' press='+press[i]);
    //console.log('lowdata '+lawdata[i]);
    i++;
        }
    }
// 日本時間表示設定
Highcharts.setOptions({
    global: {
        useUTC: false
    }
});

chart=Highcharts.chart('container', {
            chart: {
                zoomType: 'x'
            },
            title: {
                text: 'TempController Log（温度-PMW）'
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
                max: 30,
                title: {
                    text: '温度'
                },            
                labels: {
                format: '{value} deg',
                style: {
                    color: Highcharts.getOptions().colors[0]
                }
            }
            }, {
                min: -100,
                max: 100,
                title: {
                    text: 'PWM'
                },
            labels: {
                format: '{value} %',
                style: {
                    color: Highcharts.getOptions().colors[1]
                }
            },
               opposite: true
            }, {
                min: 10,
                max: 50,
                title: {
                    text: '設定温度'
                },
            labels: {
                format: '{value} deg',
                style: {
                    color: Highcharts.getOptions().colors[3]
                }
            },
               opposite: false
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
                        radius: 0
                    },
                    lineWidth: 1,
                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    }
                 //   threshold: null
                }
            },
            series: [{
                type: 'line',
                name: '温度',
                data: lawdata,
                tooltip: {
                valueSuffix: ' °C'
                },
                yAxis: 0
                },{
                type: 'line',
                name: 'PWM',
                data: lawdata3,
                tooltip: {
                valueSuffix: ' %'
                },
                yAxis: 1
                },{
                type: 'line',
                name: '設定温度',
                data: lawdata7,
                tooltip: {
                    valueSuffix: ' deg'
                },
                yAxis: 0
                }]
            });
    
        });
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
    var v=parseInt(parseFloat(rdata[0])+0.5);
    //console.log('v='+v);
    if(!isFinite(v)) getTemp('');
    console.log('getTargetTemp='+v);
    targetTemp=parseFloat(v);
    if(isFinite(v)) document.getElementById('targettmp').innerHTML='現在の設定温度 : '+parseFloat(v).toFixed(1)+'度';
    if(f) f();
        });
    });
}

function getTemp(arg,f) {
    //   console.log('getTemp');
    $.getJSON(
    "/app/pidsetting/command",//url
    {"command":"getCurrentTemp.sh", "arg":[arg]},//data
    function(data) {
    //dataがサーバから受け取るjson値
    $.each(data, 
    function(key, val) {
    //console.log('val='+val);

    rdata = val.split('<br>');
    //console.log('v='+rdata);
    var v=parseFloat(rdata[0]);
    console.log('getTemp v='+v);
    if(!isFinite(v)) getTemp(arg);
    console.log(v);
    if(isFinite(v)) document.getElementById('curtmp').innerHTML='現在の温度 : '+parseFloat(v).toFixed(1)+'度';
        });
        if(f) f();
    });
}

function checkTempController(arg,f) {
    console.log('checkTempController');
    $.getJSON(
    "/app/pidsetting/command",//url
    {"command":"activeQuery", "arg":[arg]},//data
    function(data) {
    //dataがサーバから受け取るjson値
    $.each(data, 
    function(key, val) {
    console.log('checkTempController val=|'+val+'|');

    rdata = val.split('<br>');
    //console.log('v='+rdata);
    var v=parseFloat(rdata[0].split(' ')[1]);
    //console.log('v='+v);
    if(!isFinite(v)) checkTempController(arg);
    console.log('checkTempController '+v);
    if(v>60) document.getElementById('checkTempController').innerHTML='注意　tempControllerが止まっています！！　/home/pi/src/ITBOX/err.logを保存して確認ください。';
    else document.getElementById('checkTempController').innerHTML='tempControllerは正常に動作しています。';
        });
        if(f) f();
    });
}

function setTempValue(){
       var val=document.getElementById("value").value;
       if(val === '') return;
       //console.log(val);
       if(!isFinite(val)){
          // console.log('not value');
           return;
           //val='';
       }
//       if(!isFinite(val)) val=20.0;
       setTemp([val]);
       //setTemp('');
}

$(document).ready( function() {
    //This code will run after your page loads
    checkTempController('',getTargetTemp(getTemp('',setPID(loadPID(loadTempSchedule(loadTempSchedule(makeGraph())))))));
    
  setInterval(function() {
    checkTempController('',getTargetTemp(getTemp('',setPID(loadPID(loadTempSchedule(loadTempSchedule(makeGraph())))))));
    }, 60000);

});