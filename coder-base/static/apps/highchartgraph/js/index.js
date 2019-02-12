var pointinterval=60000;　// 10分 60X10X1000msewc

var filename='./data/itplanterCapturedData.csv';
var removefilename='';
var mdata=''; // 読み込んだデータ
var minValue = '-10';
var maxValue = '40';

var chart;
var now = new Date();

function readResource(){
    console.log("readResource");
    $.ajaxSetup({ async: false });
    $.getJSON( 
    "/app/highchartgraph/command",//url
    {"command":"cat", "arg":"resources/highchartgraph.res"},//data
    function(data) {
    $.each(data,
    function(key, val) {
    rdata = val;
    }
    );
    rdata=rdata.replace("<br>","");
    console.log("readResource:"+rdata);
    var selectItem=rdata.split(' ')[1];
        console.log("selectItem:"+selectItem);
    if(selectItem){
        var radio='';
        if(selectItem==='temp'){
            radio=document.getElementById("radioTemp");
            if(radio){
                radio.checked=true;
                }
            } else  if(selectItem==='water'){
            radio=document.getElementById("radioWater");
            if(radio){
                radio.checked=true;
                }
            } else  if(selectItem==='illum'){
            radio=document.getElementById("radioIllum");
            if(radio){
                radio.checked=true;
                }                
            } 
        }
    }
    );
    $.ajaxSetup({ async: true });
}

function saveResource(req){
    console.log("saveResource");
    var saveData="Select "+req;
        console.log("saveResource:"+saveData);
    $.ajaxSetup({ async: false });
    $.getJSON( 
    "/app/highchartgraph/writeFile",//url
    {"filename":"resources/highchartgraph.res", "data":saveData},//data
    function(data) {
    $.each(data,
    function(key, val) {
    rdata = val;
    });
    });
    $.ajaxSetup({ async: true });
}

function fileRemove(){
    if(!filename){
       message('select file');
       return;
    }
    // 「OK」時の処理開始 ＋ 確認ダイアログの表示
    if(window.confirm(filename+'を本当に削除しますか？')){
    if(filename.indexOf('./data/')<0) filename = './data/'+filename;
    var dfd1=$.getJSON( 
    "/app/highchartgraph/command",//url
    {"command":"rmXML", "arg":filename});//data
     $.when(dfd1).done(function(data) {
//  処理
      var sdata='';
           $.each(data,
           function(key, val) {
           sdata = val;
           });
//
//  何故か、空白が＋になって返ってくる
//           sdata=sdata.split('<br>').join('\n');
//           sdata=sdata.split('+').join(' ');
        lsDataFile();
console.log(sdata);
     });
    }
}

function loadDataFile( req ) {
 //   $.ajaxSetup({ async: false });
    $.getJSON( 
    "/app/highchartgraph/command",//url
    {"command":"cat", "arg":req},//data
    function(data) {
    //dataがサーバから受け取るjson値
    //var rdata='';
    $.each(data,
    function(key, val) {
    rdata = val;
    }
    );
   //resultmessage(rdata);
    addElement() ;
    //console.log(rdata);
    }
    );
}

var gc='style.backgroundColor = "#22ff22"';
var wc='style.backgroundColor = "white"';

function selectDefault(){
 //    console.log('selectDefault');
     filename='itplanterCapturedData.csv';
    var d=document.getElementsByName('tag');
 //    console.log(d.length);
    for(i=0;i<d.length;i++){
 //       console.log('name='+d[i].innerHTML);
        if(d[i].innerHTML===filename){
 //       console.log('name='+d[i].innerHTML);
            d[i].style.backgroundColor = "#22ff22";
        }
    }
}

function lsDataFile( req ) {
 //   $.ajaxSetup({ async: false });
    $.getJSON( 
    "/app/highchartgraph/command",//url
    {"command":"ls", "args":['./data/itplanterCapturedData*.csv']},//data
    function(data) {
    //dataがサーバから受け取るjson値
    //var rdata='';
    $.each(data,
    function(key, val) {
    rdata = val;
    }
    );
    //resultmessage(rdata);
    //document.getElementById("list").innerHTML=rdata;
  //  console.log(rdata);
    
     var XMLlist=rdata.split('<br>');
     if(XMLlist[0].indexOf('.csv')<0) return;
     for(i=0;i<XMLlist.length-1;i++){
         XMLlist[i]=XMLlist[i].replace('./data/','');
     }
        
     var ls=document.getElementById("list");
     var flist='<table>';
     for(i=0;i<XMLlist.length-1;i+=2){
//         flist += '<tr><td  >['+i+']</td>'+'<td name="tag" onmouseover='+gc+' onmouseout='+wc+'>'+XMLlist[i]+'<td><td>['+(i+1)+']</td>'+'<td name="tag" onmouseover='+gc+' onmouseout='+wc+'>'+XMLlist[i+1]+'<td><tr>';
         flist += '<tr><td  >['+i+']</td>'+'<td name="tag" >'+XMLlist[i]+'<td><td>['+(i+1)+']</td>'+'<td name="tag" >'+XMLlist[i+1]+'<td><tr>';
     }
    flist += '</table>';
    ls.innerHTML=flist;
    addListners();
  //  console.log(rdata);
    selectDefault();
        }
    );
}
        

function addListners(){
   // 各エレメントを取得
    var elements = document.getElementsByName("tag");
    var element_result = document.getElementById("result");


    // ------------------------------------------------------------
    // マウスのボタンを押すと実行される関数
    // ------------------------------------------------------------
	function MouseDownFunc(e){
            for(var i=0;i<elements.length;i++) elements[i].style.backgroundColor = "#ffffff";
		e.target.style.backgroundColor = "#22ff22";
	//	element_result.innerHTML = "マウスのボタンが押された (type:\"" + e.type + "\" button:" + e.button  + ' target '+e.target + ") " + e.target.innerHTML;
	}

	// ------------------------------------------------------------
	// マウスのボタンを離すと実行される関数
	// ------------------------------------------------------------
	function MouseUpFunc(e){
	//	e.target.style.backgroundColor = "#ffffff";
        filename = e.target.innerHTML;
        var it=document.getElementById('input');
        if(it) it.innerHTML=filename;

        var ot=document.getElementById('output');
        removefilename=filenameDate(filename);
        console.log('|'+removefilename+'|');
        if(ot) ot.innerHTML=removefilename;

		//element_result.innerHTML = "マウスのボタンが離された (type:\"" + e.type + "\" button:" + e.button + 'target '+e.target+") " + e.target.innerHTML;
	}

	// ------------------------------------------------------------
	// クリックすると実行される関数
	// ------------------------------------------------------------
    function MouseClickFunc(e){
		element_result.innerHTML = "マウスがクリックされた (type:\"" + e.type + "\" button:" + e.button + 'target '+e.target + ") " + e.target.innerHTML;
        e.target.style.backgroundColor = "#22ff22";
        oldelm = e.target;
        filename = e.target.innerHTML;
        document.getElementById('input').innerHTML= filename;
        filename = './data/'+filename;

        var dataname='';
        if(radios){
            for(i=0;i<radios.length;i++){
                if(radios[i].checked){
                    dataname=radios[i].value;
                }
            }
        }
       // console.log(dataname);
        loadDataFile(filename, dataname);
	}

	// ------------------------------------------------------------
	// ダブルクリックすると実行される関数
	// ------------------------------------------------------------
	function MouseDoubleClickFunc(e){
		element_result.innerHTML = "マウスがダブルクリックされた (type:\"" + e.type + "\" button:" + e.button + ") " + e.target.innerHTML;
	}

    function MouseOverFunc(e){
        console.log('Over');
        e.target.style.backgroundColor = "#22ff22";
		element_result.innerHTML = "マウスがOverされた (type:\"" + e.type + "\" button:" + e.button + ") " + e.target.innerHTML;
	}

    function MouseOutFunc(e){
        e.target.style.backgroundColor = "#ffffff";
        console.log('Out');
        element_result.innerHTML = "マウスがOutされた (type:\"" + e.type + "\" button:" + e.button + ") " + e.target.innerHTML;
	}


	// ------------------------------------------------------------
	// イベントのリッスンを開始する
	// ------------------------------------------------------------
	// イベントリスナーに対応している
    for(var i=0;i<elements.length;i++){
    var element = elements[i];
	if(element.addEventListener){
        //
     //   element.addEventListener("onmouseout" , MouseOutFunc);
        //
     //   element.addEventListener("onmouseover" , MouseOverFunc);
		// マウスのボタンを押すと実行されるイベント
		element.addEventListener("mousedown" , MouseDownFunc);
		// マウスのボタンを離すと実行されるイベント
		element.addEventListener("mouseup" , MouseUpFunc);
		// クリックすると実行されるイベント
//		element.addEventListener("click" , MouseClickFunc);
		// ダブルクリックすると実行されるイベント
//		element.addEventListener("dblclick" , MouseDoubleClickFunc);
		// コンテキストメニューが表示される直前に実行されるイベント
        /*
		element.addEventListener("contextmenu" , function (e){
			// コンテキストメニューの表示を無効化
        return false;
		});
        */
      //  element.preventDefault();
	// アタッチイベントに対応している for IE
	}else if(element.attachEvent){
     //   element.attachEvent("onmouseover" , MouseOverFunc);
		// マウスのボタンを押すと実行されるイベント
		element.attachEvent("onmousedown" , MouseDownFunc);
		// マウスのボタンを離すと実行されるイベント
		element.attachEvent("onmouseup" , MouseUpFunc);
		// クリックすると実行されるイベント
		//element.attachEvent("onclick" , MouseClickFunc);
		// ダブルクリックすると実行されるイベント
		//element.attachEvent("ondblclick" , MouseDoubleClickFunc);
		// コンテキストメニューが表示される直前に実行されるイベント
		element.attachEvent("oncontextmenu" , function (e){
			// コンテキストメニューの表示を無効化
		return false;
		});
	    }
    }
}

 function loadDataFile( req, datalabel ) {
     Pot.globalize();
//    $.ajaxSetup({ async: false });
    var dfd1=$.getJSON( 
    "/app/highchartgraph/command",//url
    {"command":"cat", "arg":req}
    );
//    $.ajaxSetup({ async: true });
    $.when(dfd1).done(function(rdata) {
    //処理

    setDatatoChart(rdata, datalabel);
    });
}


function addP(point, datalabel, mdata, prog, prgVal){
var i=0;

var lineNo=8;//
var sw=0;

// 1行の要素数
    for(sw=0,lineNo=0,n=0;n<20;n++){
        if(sw===0 && mdata[n]==='illum'){
            lineNo++;
            sw++;
            continue;
            }
        if(sw !== 0 && mdata[n]==='illum'){ // illumが最後のデータ　illum - ilum間の要素数が１行の要素数
            break;
            }
        if(sw !== 0) lineNo++;
    }
        console.log('lineNo='+lineNo);
        

var n=mdata.length-lineNo;
var m=parseInt(n/lineNo);
var ary=[];
n=2;

    point.chart.yAxis.title=datalabel;
    if(datalabel=='temp' ){
$(
    function () {
    now = new Date();
        // グラフオブジェクトの生成

    chart = new Highcharts.Chart({
        chart: {
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
            //minRange: 1// fourteen days
        },
        yAxis: {
            title: {
                text: '温度変動',
                //tickWidth: 10,
                max: maxValue,
                min: minValue
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
            pointInterval: pointinterval,
           //pointStart: Date.UTC(now.getYear(), now.getMonth()+1, now.getDay()),
           //  pointStart: Date.UTC(now.getFullYear(), now.getMonth()+1, now.getDay(),now.getHours(),now.getMinutes()),
           // pointStart: moment().add(9, 'hours').format("YYYY-MM-DD-HH:mm:ss"), 
            data: [0,30],// for normalize graph
            tooltip: {
                valueSuffix: ' ℃'
            }
        }]
    });
    });

    }
    
    if(datalabel=='water'){
        $(
    function () {
    now = new Date();
        // グラフオブジェクトの生成

    chart = new Highcharts.Chart({
        chart: {
            zoomType: 'x',
            renderTo: 'container'
        },
        title: {
            text: 'itplanter water graph'
        },
        subtitle: {
            text: document.ontouchstart === undefined ?
                    'Click and drag in the plot area to zoom in' :
                    'Pinch the chart to zoom in'
        },
        xAxis: {
           type: 'datetime',
           // minRange: 100 // fourteen days
        },
        yAxis: {
            title: {
                text: '水位変動',
                max: maxValue,
                min: minValue
            }
        },
        legend: {
            enabled: false
        },
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
            name: 'Water',
            pointInterval: pointinterval,
             //pointStart: Date.UTC(now.getYear(), now.getMonth()+1, now.getDay()),
           //  pointStart: Date.UTC(now.getFullYear(), now.getMonth()+1, now.getDay(),now.getHours(),now.getMinutes()),
           // pointStart: moment().add(9, 'hours').format("YYYY-MM-DD-HH:mm:ss"), 
            data: [0,600 ],// for normalize graph
            tooltip: {
                valueSuffix: 'V'
            }
        }]
    });
    });

    }
    if(datalabel=='illum'){
                $(
    function () {
    now = new Date();
        // グラフオブジェクトの生成

    chart = new Highcharts.Chart({
        chart: {
            zoomType: 'x',
            renderTo: 'container'
        },
        title: {
            text: 'itplanter illum graph'
        },
        subtitle: {
            text: document.ontouchstart === undefined ?
                    'Click and drag in the plot area to zoom in' :
                    'Pinch the chart to zoom in'
        },
        xAxis: {
            type: 'datetime',
          //  minRange: 100 // fourteen days
        },
        yAxis: {
            title: {
                text: '照度変動',
                max: maxValue,
                min: minValue
            }
        },
        legend: {
            enabled: false
        },
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
            name: 'illum',
            pointInterval: pointinterval,
             //pointStart: Date.UTC(now.getYear(), now.getMonth()+1, now.getDay()),
           //  pointStart: Date.UTC(now.getFullYear(), now.getMonth()+1, now.getDay(),now.getHours(),now.getMinutes()),
           // pointStart: moment().add(9, 'hours').format("YYYY-MM-DD-HH:mm:ss"), 
            data: [0,6000],// for normalize graph
            tooltip: {
                valueSuffix: 'Lux'
            }
        }]
    });
    });
       
    }
     point = chart.series[0];
    
    for(n=0, i=0;i<mdata.length-1;i++){
        if( mdata[i+1] ){
//console.log('mdata['+i+']'+mdata[i]);
           if(datalabel=='temp'  && (mdata[i]=='temperature'|| mdata[i]=='Temp'   )) ary[n++]=mdata[++i];
           if(datalabel=='water' && (mdata[i]=='waterlevel' || mdata[i]=='WaiterA' || mdata[i]=='WaterA')) ary[n++]=mdata[++i];
           if(datalabel=='illum' &&  mdata[i]=='illum' ){
               ary[n++]=mdata[++i];
           }
           }
    }

// 異常な値を削除する

    for(i=0;i<ary.length;i++){
//console.log('['+i+']'+ary[i]);
        if( isFinite(ary[i]) && !isNaN(ary[i]) ){
            /*
            if(datalabel=='temp'  && ary[i] > 60 )   ary[i]=60;
            if(datalabel=='water' && ary[i] > 600  ) ary[i]=600;
            if(datalabel=='illum' && ary[i] > 6000 ) ary[i]=6000;
            */
        } else ary[i]=0;// 異常値は０に置き換える
    }

i=0;
Deferred.forEach(ary, function(value, key) {
    if( isFinite(ary[i]) ){// skip illegler data
    point.addPoint(parseFloat(ary[i]));
    }
//    console.log(i+' '+ary[i]);
    if((i % parseInt(m/100)) === 0 ){
                prog.value= parseInt(i/(m-1)*100);
                prgVal.innerHTML= parseInt(i/m*100)+'';
//               console.log('prog '+(i % parseInt((m-1)/100)) +' '+parseInt(i/(m-1)*100)+' % '+'val = '+parseFloat(ary[i]));
//            }
        }
        i++;
        if(i==ary.length){
                prog.value= 100;
                prgVal.innerHTML= '100';
        }
    });
  
    
}

function setDatatoChart(data, datalabel){
var txt='';

    //dataがサーバから受け取るjson値をパースする
    var sdata='';
    $.each(data,
    function(key, val) {
    //val=val.split('<br>').join('\n');
    sdata = val;
    });
    
//   resultmessage(sdata);
//    printProperties(sdata);
//console.log('setDatatoChart1  '+sdata);  
    if(typeof sdata === 'undefined' ) return false;

    sdata=sdata.split('<br>').join(',');  
    
    mdata=sdata.split(',');
    for(i=0;i<mdata.length;i++){
    mdata[i]=mdata[i].replace(':','0');
 //   console.log('mdata00  ['+i+'] '+mdata[i]);  
    }

    var timedata=mdata[0].split(',')[0];
    var year=timedata.substr(0,4);
    var month=timedata.substr(5,2);
    var day=timedata.substr(7,2);
    var hour=timedata.substr(timedata.length-4,2);
    var min=timedata.substr(timedata.length-2,2);
    if(month.length==1) month='0'+month;
    if(day.length==1) day='0'+day;
    if(hour.length==1) hour='0'+hour;
    if(min.length==1) min='0'+min;
    //
    console.log(year+' '+month+' '+day+' '+hour+' '+min);

    var point = chart.series[0];//.data;
    point.yAxis.Minimum = minValue;
    point.yAxis.Maximum = maxValue;
 
  // pointStart: Date.UTC(now.getYear(), now.getMonth()+1, now.getDay(),now.getHours(),now.getMinutes()),
    point.pointStart=Date.UTC(year,month,day,hour,min);
    
 //   console.log('setDatatoChart2  addPoint start'); 
  //  alert('START');
   //
   var prog     = document.getElementById('progress');
   var prgVal   = document.getElementById('prgVal');
   //var prgBar   = document.getElementById('prgBar');
   //prgBar.display.style= true;
   
   addP(point, datalabel,  mdata, prog, prgVal);

    console.log('setDatatoChart2  addPoint done'); 
   //     // initial value
   if(typeof mdata === "undefined"){
       point.addPoint(0.0);
       point.addPoint(30.0);       
   }
 
//    message('Done...');
    //prgBar.display.style= none;
    return true;
}

function printProperties(obj) {
    var properties = '';
    for (var prop in obj){
        properties += prop + "=" + obj[prop] + "\n";
    }
    alert(properties);
}

var sdata='';
function readDataFile(){
    if(!filename){
       message('select file');
       return;
    }
    var radios = document.getElementsByName('radiosw');
        var dataname='';
        if(radios){
            for(i=0;i<radios.length;i++){
                if(radios[i].checked){
                    dataname=radios[i].value;
                }
            }
    }
    //
    if(filename.indexOf("./data/")<0)    filename = './data/'+filename;
        
    console.log('Loading...  '+filename+' '+dataname);
    loadDataFile(filename, dataname);
    console.log('Wait a moment...');
}

function filenameDate(filename){
//  change file.csv  -->  file[yyyymmddHHMM]
 require("date-utils");
 var now = new Date();
 filename=filename.replace('./data/','');
 console.log('filename='+filename);
 var month=now.getMonth()+1;
 if(month.length==1) month='0'+month;
 var day=now.getDay();
 if(day.length==1) day='0'+day;
 var hour=now.getHours();
 if(hour.length==1) hour='0'+hour;
 var min=now.getMinutes();
 if(min.length==1) min='0'+min;

 var timedate =  (now.getYear()+1900)+''+month +''+day+''+hour+''+min;
 var f=filename.split('.');
 return f[0]+timedate+'.'+f[1];
}


function message(mes)
{
if ($(document))
  {
      document.getElementById("message").innerHTML=mes;
  }
}

function resultmessage(mes)
{
if ($(document))
  {
      document.getElementById("result").innerHTML=mes;
  }
}

function messageConsole(mes)
{
if ($(document))
  {
      document.getElementById("messageConsole").innerHTML=mes;
  }
}
function cancel() {
     window.location.href="/";
}

var rdata=''; // return from command

function getCommandResult(){
    return(rdata);
}
    
function command( req ) {
    // message("command:"+req);
    $.ajaxSetup({ async: false });
    $.getJSON( 
    "/app/websendcom/command",//url
    {"command":"sendcom", "arg":req},//data
    function(data) {
    //dataがサーバから受け取るjson値

    $.each(data, 
    function(key, val) {
    rdata = val;
    }
    );
    //   resultmessage(rdata);
    }
    );
    $.ajaxSetup({ async: true });
    return rdata;
}

function command2( f1, f2 ) {
    $.ajaxSetup({ async: false });
    $.getJSON( 
    "/app/highchartgraph/filePutContents",//url
    {"command":"addfile", "arg":[f1,f2]},//data
    function(data) {
    //dataがサーバから受け取るjson値

    $.each(data, 
    function(key, val) {
    rdata = val;
    }
    );
 //      resultmessage(rdata);
    }
    );
    return rdata;
}

function commandtest( req, f1, f2 ) {
     message("command:"+req);
    $.ajaxSetup({ async: false });
    $.getJSON( 
    "/app/highchartgraph/filePutContents",//url
    {"command":"ps", "arg":[f1,f2]},//data
    function(data) {
    //dataがサーバから受け取るjson値

    $.each(data, 
    function(key, val) {
    rdata = val;
    }
    );
       resultmessage(rdata);
    }
    );
    return rdata;
}



function filePutContents(filename , dataVal) {
     message("filePutContents:"+filename);
//    $.ajaxSetup({ async: false });
    $.getJSON( 
    "/app/highchartgraph/filePutContents",//url
    {"command":"filePutContents", "arg":[filename,dataVal]},//data
    function(data) {
    //dataがサーバから受け取るjson値

    $.each(data, 
    function(key, val) {
    rdata = val;
    }
    );
    //   resultmessage(rdata);
    }
    );
    return rdata;
}


function newfile() {
        // 「OK」時の処理開始 ＋ 確認ダイアログの表示
    if(window.confirm(filename+'を'+removefilename+'に変更しますか？')){
     console.log("newfile:");
     if(removefilename.indexOf('./data/')<0) removefilename='./data/'+removefilename;
     var movedfile=removefilename;//filenameDate(filename);
     message('movefile  from '+filename+' to '+movedfile);
     
//    $.ajaxSetup({ async: false });
    $.getJSON( 
    "/app/highchartgraph/newfile",//url
    {"command":"mv", "arg":[filename, movedfile]},//data
    function(data) {
    //dataがサーバから受け取るjson値
    $.each(data, 
    function(key, val) {
    rdata = val;
    }
    );
     　lsDataFile();
       resultmessage(rdata);
       // var point = chart.series[0];//.data;
       // point.remove(true);
    }
    );
//    return rdata;
    }
}


function update(){
    resultmessage('');
    /*
        var val = command('A').split('<br>')[1].split(' ')[1];// temp
       
        var point = chart.series[0];//.data;
        point.addPoint(parseFloat(val));
        point.yAxis.Minimum = minValue;
        point.yAxis.Maximum = maxValue;
        
        // ついでに、水位と照度を記録しておく。
        //var val='';
        var val2 = command('B').split('<br>')[1].split(' ')[1];// water
        var val3 = command('F').split('<br>')[1].split(' ')[1];// illum
//       var dataVal = Date().toFormat("YYYYMMDDHH24MI")+',temperature,'+val+',waterlevel,'+val2+',illum,'+val3+'\n';


       var month=now.getMonth()+1;
         if(month<=9) month='0'+month;
         
         var day=now.getDay();
         if(day.length==1) day='0'+day;
         
         var hour=now.getHours();
         if(hour.length==1) hour='0'+hour;
         
         var min=now.getMinutes();
         if(min.length==1) min='0'+min;
         
         var timedate =  (now.getYear()+1900)+''+month +''+day+''+hour+''+min;
         
        var dataVal =  timedate +',temperature,'+val+',waterlevel,'+val2+',illum,'+val3+'\n';
        
        var res=filePutContents( filename , dataVal );
        message(res);
     */
//  自ら測定するのではなく、itplanterCapturedData.csv の　最新情報(tailを読み込む
//  timestampを比較して、新しければ読み込む

}


$(
    function () {
    $('#rollback').click(function(){
     update(); // sendcomで読み直す
    });

    // 初回の測定値の取得と、定期処理(5分毎に自動更新)
   // Logger.getVal();
    //update();
    //setInterval(Logger.getVal ,5 * 60 * 1000);

    setInterval(update , pointinterval);

        // グラフオブジェクトの生成
//    $('#container').highcharts({
    chart = new Highcharts.Chart({
        
        chart: {
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
           // minRange: 100 // fourteen days
        },
        yAxis: {
            title: {
                text: '温度変動',
                max: maxValue,
                min: minValue
            }
        },
        legend: {
            enabled: false
        },
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
            pointInterval: pointinterval,
             //pointStart: Date.UTC(now.getYear(), now.getMonth()+1, now.getDay()),
             pointStart: Date.UTC(now.getYear(), now.getMonth()+1, now.getDay(),now.getHours(),now.getMinutes()),
           // pointStart: moment().add(9, 'hours').format("YYYY-MM-DD-HH:mm:ss"), 
            data: [0,30],// for normalize graph
            tooltip: {
                valueSuffix: ' ℃'
            }
        }]
    });
});

$(document).ready( function() {
    readResource();
    lsDataFile();

        var it=document.getElementById('input');
        if(it) it.innerHTML=filename;
        var ot=document.getElementById('output');
        removefilename=filenameDate(filename);
        console.log('|'+removefilename+'|');
        if(ot) ot.innerHTML=removefilename;

});



