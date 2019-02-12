
$(document).ready( function() {
    makeGraph();
    setInterval(makeGraph,10000);
});


function doAutoPID(){
    document.getElementById('state').innerHTML='/home/pi/src/ITBOX/stepResponse.pyを実行してください。'
   /*
    *  stepResponse.pyの動作が継続しない。
    *  shedulerで動かすか？
    */
    $.getJSON(
    "/app/autopid/command",//url
    {"command":"stepResponse", "arg":[]},//data
    function(data) {
        $.each(data, 
        function(key, val) {
        document.getElementById('state').innerHTML=val;
        rdata = val.split('<br>');
        console.log(rdata);
        });
    });
    /* */
}

function makeGraph() {
    console.log('date '+Date());
    file=['/home/coder/coder-dist/coder-base/stepResponseMonitor.csv']
    console.log('makeGraph file='+file);
    $.getJSON(
    "/app/datachart/command",//url
    {"command":"cat", "arg":file},//data
    function(data) {
        $.each(data, 
        function(key, val) {
        rdata = val.split('<br>');
        });
    //   console.log(rdata);
    if(rdata[rdata.length-1]==='') rdata.pop();
    rdata.pop();
    
    var i=0;
    if(!rdata[0]) return;
    lawdata=new Array([]);
    for(i=0;i<rdata[0].split(',').length;i++) lawdata[i]=new Array([]);
    var element=[];
    var date=[];
    for(k=0,i=0;i<rdata.length;i++){
    var t=rdata[i].split(',');
    if(t[0]==='overshoot'){
        // PID parameter
        var p=document.getElementById('PID');
        v = rdata[i].split(',');
        for(q=3;q<v.length;q+=2){
            v[q]=parseFloat(v[q]).toFixed(3);
        }
        rdata[i]=v[0]+'  '+v[1]+' '+v[2]+' '+v[3]+' '+v[4]+' '+v[5]+' '+v[6]+' '+v[7];
        p.innerHTML=rdata[i].replace(',',' ')+'<br>';
        i += 1;
        v = rdata[i].split(',');
        //console.log('v='+v);
        for(q=3;q<v.length;q+=2){
            v[q]=parseFloat(v[q]).toFixed(3);
        }
        rdata[i]=v[0]+' '+v[1]+' '+v[2]+' '+v[3]+' '+v[4]+' '+v[5]+' '+v[6]+' '+v[7];
        console.log('rdata='+rdata[i]);
        p.innerHTML += rdata[i].replace(',',' ')+'<br>';
        } else {
        //console.log('makeGraph t='+t);
        date[k]  = Date.parse(t[0]);
        var v=[];
        
        for(j=0;j<(t.length-1)/2;j++){
            v[j] = parseFloat(t[2*j+1]);
            if(i===0) element.push(t[2*j+1]);
        }
        
        for(j=0;j<v.length;j++){
            lawdata[j][k]=[date[k], v[j]];
            console.log('makeGraph lawdata='+lawdata[j][k]);
            }
            k+=1;
        }
    }// next i
    console.log('makeGraph element='+element);
    
    if(lawdata[lawdata.length-1]==='') lawdata.pop();
    
//console.log(element);
    // 日本時間表示設定
    Highcharts.setOptions({
        global: {
            useUTC: false
        }
    });
    
    
    $(
    function () {
    now = new Date();
        // グラフオブジェクトの生成

    chart = new Highcharts.Chart({
        chart: {
            type: 'scatter',
            zoomType: 'x',
            renderTo: 'container'
        },
        title: {
            text: 'itplanter thermo graph'
        },
        subtitle: {
            text: document.ontouchstart === undefined ?
                    'Click and drag in the plot area to zoom in' :
                    'Pinch the chart to zoom in'
        },
        xAxis: {
            type: 'datetime',
            format: "YYYYMMDDHHmmss",
            minRange: 100 // fourteen days
        },
        yAxis: {
            title: {
                text: '温度変動',
                //tickWidth: 10,
                max: 3.0,
                min: -1.0
            }
        },
        legend: {
            enabled: false
        },
        /*
        rangeSelector: {
            selected: 0
        },
        */
        plotOptions: {
            area: {
                fillColor: {
                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1},
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
            type: 'area',
            name: 'Temp',
            //pointInterval: pointinterval,
            data: lawdata[0],// for normalize graph
            tooltip: {
                valueSuffix: ' ℃'
                    }
                }]
            });
        });
    });
}
