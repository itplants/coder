var selectedFile=[];
var chart=[];
var lawdata=[];
var pathdir='./SensorsData/';

$(document).ready( function() {
   makeTree();
       $('#tree1').on("changed.jstree", function (e, data) {

        var p=document.getElementById(data.node.parent);
        var selectDir='';
        selectedFile=[];
        if(p) selectDir=p.innerText.split('\n')[0];
        console.log('selected='+data.selected.length);
        for(i=0;i<data.selected.length;i++){
            p=document.getElementById(data.selected[i]);
            //console.log(p.innerText);
            selectedFile[i]=selectDir+'/'+p.innerText;
        }
        console.log('selectedFile='+selectedFile);
    });
    
    console.log('selectedFile='+selectedFile);
    makeGraph([selectedFile]);
});


function fileRemove(){
    if(!selectedFile){
       message('select file');
       return;
    }
    // 「OK」時の処理開始 ＋ 確認ダイアログの表示
    //if(selectedFile.indexOf(pathdir)<0) selectedFile = pathdir+selectedFile;
    if(window.confirm(selectedFile+'を本当に削除しますか？')){
    if(selectedFile.indexOf(pathdir)<0) selectedFile = pathdir+selectedFile;
    var dfd1=$.getJSON( 
    "/app/datachart/command",//url
    {"command":"rmXML", "arg":['-rf',selectedFile]});//data
     $.when(dfd1).done(function(data) {
//  処理
      var sdata='';
           $.each(data,
           function(key, val) {
           sdata = val;
           });
           console.log(sdata);
           //makeTree();
     });
    }
}

/* 
 * 平均を求める
 */
function average(data)
{
    var sum = 0;
    for (i=0; i<data.length; i++) {
      sum = sum + data[i];
    }
    return (sum / data.length);
}
 
/*
 * 分散を求める
 * 分散 ＝（（データ－平均値）の２乗）の総和 ÷ 個数
 */
function variance(data)
{
    // 平均値を求める
    var ave = average(data);
 
    var varia = 0;
    for (i=0; i<data.length; i++) {
        varia = varia + Math.pow(data[i] - ave, 2);
    }
    return (varia / data.length);
}
 
/*
 * 標準偏差を求める
 */
function standard_deviation(data)
{
    // 分散を求める
    var varia = variance(data);
 
    // 分散の平方根
    return Math.sqrt(varia);
}
 

function filterdData(data){
    if(data.length > 1){
    sd = standard_deviation(data);
    //console.log('filterdData SD='+sd);
    sd=3.0*sd;
    //console.log('data.length='+data.length);
    for(i=1;i<data.length-1;i++){
        //console.log('data='+data[i]);
        if(data[i] > data[i-1]+sd || data[i] < data[i-1]-sd){
            //console.log('illdata '+data[i]);
            data[i]=(data[i-1]+data[i+1])/2.0;
            }
        // remove illegral data
        if(data[i] < 10 ) data[i]=data[i-1];
        }
    }
    return data;
}

function makeGraph(file, f) {
    //console.log('makeGraph1 type of file=|'+(typeof  file)+'|');
    //console.log('makeGraph1 file=|'+file+'|');
    //console.log('makeGraph1 file.length='+file.length);
    //console.log('makeGraph1 selectedFile=|'+selectedFile+'|');
    if( file === undefined && selectedFile === ''){
        file[0]=[pathdir+'TVOC/saveSGP30data.csv'];
        } else {
    file=[];
    console.log('makeGraph selectedFile.lenght='+selectedFile.length);
    console.log('makeGraph selectedFile='+selectedFile);
    for(i=0;i<selectedFile.length;i++){
        file[i]=pathdir+selectedFile[i];
        if(file[i][file[i].length-1] !== 'v') file[i]=[pathdir+selectedFile[i]+'/*'];
        }
    }
    if(!file[0]) return;
    if( file[0].length <= 1 && selectedFile === ''){
            file[0]=[pathdir+'TVOC/saveSGP30data.csv'];
    }
    console.log('makeGraph file='+file);
    $.getJSON(
    "/app/datachart/command",//url
    {"command":"cat", "arg":file},//data
    function(data) {
        $.each(data, 
        function(key, val) {
        rdata = val.split('<br>');
        });
    if(rdata[rdata.length-1]==='') rdata.pop();
    
    var i=0;
    if(!rdata[0]) return;
    lawdata=new Array([]);
    for(i=0;i<rdata[0].split(',').length;i++) lawdata[i]=new Array([]);
    var element=[];
    var date=[];
    for(i=0;i<rdata.length;i++){
    var t=rdata[i].split(',');
    //2018-09-16 10:02:30,CO2,400,TVOC,0,CO2EQ_BASELINE,35187,TVOC_BASELINE,35516
    //
    
    //console.log('makeGraph t='+t);
    date[i]  = Date.parse(t[0]);
    var v=[];
        for(j=0;j<(t.length-1)/2;j++){
            v[j] = parseFloat(t[2*(j+1)]);
            if(i===0) element.push(t[2*j+1]);
        }
        for(j=0;j<v.length;j++){
            lawdata[j][i]=[date[i], v[j]];
        }
    }// next i
    
    if(lawdata[lawdata.length-1]==='') lawdata.pop();
        for(j=0;j<lawdata.length;j++){
            data=[];
            for(i=0;i<lawdata[j].length;i++){
            //console.log('lawdata['+j+']='+lawdata[j][i][1]);
                data[i]=lawdata[j][i][1];
            }
            data=filterdData(data);
            for(i=0;i<lawdata[j].length;i++){
                lawdata[j][i][1]=data[i];
            }   
        }


//console.log(element);
    // 日本時間表示設定
    Highcharts.setOptions({
        global: {
            useUTC: false
        }
    });
    chart=[];
    
    var cp=document.getElementById('charts');
    if(cp) cp.innerHTML='';
    for(k=0;k<element.length-1;k+=2){
        if(cp) cp.innerHTML+='<div id="container'+(k/2)+'" style="min-width: 310px; height: 400px; margin: 0 auto"></div>';
    }    
    for(k=0;k<element.length-1;k+=2){
        chart[k/2]=Highcharts.chart('container'+(k/2), {
            chart: {
                zoomType: 'xy'
            },
            title: {
                text: element[k]
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
                //max: 500,
                title: {
                    text: element[k]
                },            
                labels: {
                format: '{value}',
                style: {
                    color: Highcharts.getOptions().colors[0]
                }
            }
            }, {
                min: 0,
                //max: 50000,
                title: {
                    text: element[k+1]
                },
            labels: {
                format: '{value}',
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
                name: element[k],
                data: lawdata[k],
                tooltip: {
                valueSuffix: ''
                },
                yAxis: 0
                },{
                type: 'line',
                name: element[k+1],
                data: lawdata[k+1],
                tooltip: {
                valueSuffix: ''
                },
                yAxis: 1
                    }]
                });
            }        
        });
        document.getElementById("msg").innerHTML='';
        if(f) f();
}

function replaceAll(str, beforeStr, afterStr){
  var reg = new RegExp(beforeStr, "g");
  return str.replace(reg, afterStr);
}

function lsData(f){
    console.log(pathdir+selectedFile);
    $.getJSON(
    "/app/treetest/command",//url
    {"command":'ls', "arg":[pathdir+selectedFile]},//data
    function(data) {
    //dataがサーバから受け取るjson値
    $.each(data, 
    function(key, val) {
        rdata=val;
        //rdata = replaceAll(val,'<br>','\n');
        var p=document.getElementById('list');
        if(p) p.innerHTML=rdata;
    })
    })
}

function loadData(f){
    console.log(pathdir+selectedFile);
    if(selectedFile[selectedFile.length-1] !== 'v') selectedFile=selectedFile+'/*';
    console.log(pathdir+selectedFile);
    $.getJSON(
    "/app/treetest/command",//url
    {"command":'cat', "arg":[pathdir+selectedFile]},//data
    function(data) {
    //dataがサーバから受け取るjson値
    $.each(data, 
    function(key, val) {
        rdata=val;
        var p=document.getElementById('data');
        if(p) p.innerHTML=rdata;
    })
    })
}

function makeTree(f) {
    console.log('makeTree');
            console.log(pathdir+'*/*/*/*');
    $.getJSON(
    "/app/datachart/command",//url
    {"command":'ls', "arg":[pathdir+'*/*/*/*']},//data
    function(data) {
    //dataがサーバから受け取るjson値
    $.each(data, 
    function(key, val) {
    //rdata = val.replace(/<br>/g,'\n');
    rdata = replaceAll(val,'<br>','\n');
    if( rdata[rdata.length-1]==='' ) rdata.pop();
    //rdata = rdata.split(',');
    rdata = rdata.split('\n');
    for(i=0;i<rdata.length;i++){
        if(rdata[i].indexOf(pathdir)>=0){
            rdata[i]=rdata[i].replace(':','');
            rdata[i]=rdata[i].replace(pathdir,'');
            rdata[i]='<ul><li name="tag">'+rdata[i]+'<ul>';
        } else
        if(rdata[i].indexOf('20')>=0){
            rdata[i]='<li name="tag">'+rdata[i]+'</li>';
        }
        if(rdata[i]===''){
            rdata[i]='</ul></li></ul>';
        }
     //       console.log(rdata[i]);
    }
    var p=document.getElementById('tree1');
    p.innerHTML=rdata.join('\n');
    $(function(){$('#tree1').jstree();});
    $.jstree.defaults.core.expand_selected_onload=true;
        })
        if(f) f();
    })
}

function filenameDate(filename){
/*
 var now = new Date();
 filename=filename.replace('./data/','');
 console.log('filename='+filename);
 var month=now.getMonth()+1;
 if(month.length==1) month='0'+month;
 var day=now.getDate();
 if(day.length==1) day='0'+day;
 var hour=now.getHours();
 if(hour.length==1) hour='0'+hour;
 var min=now.getMinutes();
 if(min.length==1) min='0'+min;

 timedate =  (now.getYear()+1900)+''+month +''+day+''+hour+''+min;
 var f=filename.split('.');
 return f[0]+timedate+'.'+f[1];
 */
 return filename;
}
