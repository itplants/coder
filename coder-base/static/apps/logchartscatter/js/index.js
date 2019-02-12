var pointinterval=60000;　// 10分 60X10X1000msewc
var filename='/mnt/data/tempController.log';
var removefilename='';
var mdata=[]; // 読み込んだデータ
var minValue = '-10';
var maxValue = '40';
var XMLlist=[];
var chart;
var now = new Date();

function readResource(){
    console.log("readResource");
    $.ajaxSetup({ async: false });
    $.getJSON( 
    "/app/logchartscatter/command",//url
    {"command":"cat", "arg":["resources/logchartscatter.res"]},//data
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
            } else  if(selectItem==='hum'){
            radio=document.getElementById("radioHum");
            if(radio){
                radio.checked=true;
                }
            } else  if(selectItem==='illum'){
            radio=document.getElementById("radioIllum");
            if(radio){
                radio.checked=true;
                }                
            } else  if(selectItem==='pwm'){
            radio=document.getElementById("radioPWM");
            if(radio){
                radio.checked=true;
                }                
            } else  if(selectItem==='const'){
            radio=document.getElementById("radioConst");
            if(radio){
                radio.checked=true;
                }                
            } else  if(selectItem==='AH'){
            radio=document.getElementById("radioAH");
            if(radio){
                radio.checked=true;
                } else  if(selectItem==='press'){
            radio=document.getElementById("radioPress");
            if(radio){
                radio.checked=true;
                    }
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
    "/app/logchartscatter/writeFile",//url
    {"filename":"resources/logchartscatter.res", "data":saveData},//data
    function(data) {
    $.each(data,
    function(key, val) {
    rdata = val;
    });
    });
    $.ajaxSetup({ async: true });
}

var dfd=[];
function rmFile(n,filename){
    dfd[n]=$.getJSON( 
    "/app/highchartscatter/command",//url
    {"command":"rmXML", "arg":filename}
    );//data
     $.when(dfd[n]).done(function(data) {
        lsDataFile();
     });
}

function oneDayLogRemove(){
    if(!filename){
       message('select file');
       return;
    }
    var filenames=[];
    var alartfile=[];
    filename=filename.substr(0,24);
    for(i=0;i<XMLlist.length;i++){
        if(XMLlist[i].indexOf(filename)>=0){
            if(XMLlist[i].indexOf('.log')>=0){
                        filenames.push(XMLlist[i]);
                        alartfile.push(XMLlist[i].replace('./data/',''));
            }
        }
    }
    console.log(filenames);
  
    // 「OK」時の処理開始 ＋ 確認ダイアログの表示
    var dfd=[];
    if(window.confirm(alartfile+'を本当に削除しますか？')){
//        oneDayLogRm(filenames[0]);

    for(i=0;i<filenames.length;i++){
        rmFile(i,filenames[i]);
        }

    }

}

function oneDayLogRm(fn){ 
    //console.log('Making CSV file...1  '+fn);
    fn=fn.substr(7,24);
    fn = fn.replace('tempController','');        
    //console.log('Making CSV file...  '+fn);
    message('tempController'+fn+'.csv ファイルを作成し、1日分のログを削除します。');

    $.getJSON( 
    "/app/logchartscatter/command",//url
    {"command":"oneDayLog", "arg":[filename,'-r']},//data
    function(data) {
    //dataがサーバから受け取るjson値
    $.each(data, 
    function(key, val) {
    rdata = val;
    });
    //
    lsDataFile(message(''));
    });

}

function fileRemove(){
    if(!filename){
       message('select file');
       return;
    }
    // 「OK」時の処理開始 ＋ 確認ダイアログの表示
    if(window.confirm(filename+'を本当に削除しますか？')){
    if(filename.indexOf('/mnt/data/')<0) filename = '/mnt/data/'+filename;
    var dfd1=$.getJSON( 
    "/app/highchartscatter/command",//url
    {"command":"rmXML", "arg":[filename]});//data
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

function selectDefault(){
 //    console.log('selectDefault');
     filename='tempController.log';
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

function lsDataFile( f ) {
 //   $.ajaxSetup({ async: false });
    $.getJSON( 
    "/app/highchartscatter/command",//url
    {"command":"ls", "args":['./data/tempController*']},//data
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
    console.log(rdata);
    
     XMLlist=rdata.split('<br>');
     //if(XMLlist[0].indexOf('.log')<0) return;
          for(i=0;i<XMLlist.length-1;i++){
              if(XMLlist[i].indexOf('.err')>=0){
                  console.log('del '+XMLlist[i]);
                  XMLlist.splice(i,1);
              }
          }

        
     var ls=document.getElementById("list");
     var flist='<table>';
     for(i=0;i<XMLlist.length-1;i+=2){
//         flist += '<tr><td  >['+i+']</td>'+'<td name="tag" onmouseover='+gc+' onmouseout='+wc+'>'+XMLlist[i]+'<td><td>['+(i+1)+']</td>'+'<td name="tag" onmouseover='+gc+' onmouseout='+wc+'>'+XMLlist[i+1]+'<td><tr>';
         flist += '<tr><td  >['+i+']</td>'+'<td name="tag" >'+XMLlist[i].replace('./data/','')+'<td><td>['+(i+1)+']</td>'+'<td name="tag" >'+XMLlist[i+1].replace('./data/','')+'<td><tr>';
     }
    flist += '</table>';
    ls.innerHTML=flist;
    addListners();
  //  console.log(rdata);
    selectDefault();
    if(f) f();
        });
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
    //    element_result.innerHTML = "マウスのボタンが押された (type:\"" + e.type + "\" button:" + e.button  + ' target '+e.target + ") " + e.target.innerHTML;
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
        filename = '/mnt/data/'+filename;

        var dataname='';
        if(radios){
            for(i=0;i<radios.length;i++){
                if(radios[i].checked){
                    dataname=radios[i].value;
                }
            }
        }
       // console.log(dataname);
       var series=0;
        loadDataFile(filename, dataname, series);
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
        if(e){
        e.target.style.backgroundColor = "#ffffff";
        console.log('Out');
        element_result.innerHTML = "マウスがOutされた (type:\"" + e.type + "\" button:" + e.button + ") " + e.target.innerHTML;
        }
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

function allDayLog(){
    //message('tempController'+filename+'.csv ファイルを作成します。');
    $.getJSON( 
    "/app/logchartscatter/command",//url
    {"command":"allDayLog", "arg":[]},//data
    function(data) {
    //dataがサーバから受け取るjson値
    $.each(data, 
    function(key, val) {
    rdata = val;
    });
    //
    lsDataFile(message(''));
    });

}
  
function oneDayLog(){   
    if(filename.indexOf('_00.log') < 0 ){
        message('指定日のlogファイルを選択してください。');
        return;
    }
    filename = filename.replace('tempController','').replace('_00.log','');        
    filename=filename.substr(0,10);
    console.log('Making CSV file...  '+filename);
    message('tempController'+filename+'.csv ファイルを作成します。');
    $.getJSON( 
    "/app/logchartscatter/command",//url
    {"command":"oneDayLog", "arg":[filename]},//data
    function(data) {
    //dataがサーバから受け取るjson値
    $.each(data, 
    function(key, val) {
    rdata = val;
    });
    //
    lsDataFile(message(''));
    });
}
  
function loadDataFile( req, datalabel, s ) {
    rdata='';
    //console.log('req=readLog '+req)
    message('');
    messageConsole('data loading...');
    var dfd='';
    if(req.indexOf('.log')>=0){
    dfd=$.getJSON(
    "/app/logchartscatter/command",//url
    {"command":"readLog", "arg":[req,'0']}
    );
    } 
    else if(req.indexOf('.csv')>=0){// CSV
    dfd=$.getJSON(
    "/app/logchartscatter/command",//url
    {"command":"cat", "arg":[req]}
//    {"command":"readLog", "arg":[req]}
    );
    }
    
    $.when(dfd).done(function(rdata) {
    //処理
    setDatatoChart(rdata, datalabel, s);
    messageConsole('');
    });
}

function addP(point, datalabel, mdata, prog, prgVal){
var i=0;
var lineNo=8;// date, temp, hum, press, dir*pwm, constration, AH, illum 
var sw=0;

lineNo=mdata[0].length;
//console.log('lineNo='+lineNo);
        
var n=mdata.length-lineNo;
var m=parseInt(mdata.length-1);
var arx=[];
var ary=[];
var artmp=[],arhum=[],arillum=[],arpwm=[],arpel=[],arcons=[],arah=[],arlux=[];

point.chart.yAxis.title=datalabel;
//point.chart.xAxis.title='time';

// 日本時間表示設定
Highcharts.setOptions({
    global: {
        useUTC: false
    }
});
    
    point = chart.series[0];// 24 series
    var timeOffset=0;//4*60*60*1000-60*7*1000;
    if(mdata.length<=2){
        messageConsole('no data in this file...'+mdata.length-1);
    }
    
   //console.log('Date '+mdata[i]);
    k=0;
    for(i=0;i<mdata.length-1;i++){
        if( mdata[i] ){
        //var d=mdata[i][0].split(' ');
           arx[i]=Date.parse(mdata[i][0]);
           //console.log('arx['+i+']'+arx[i]);
           if(datalabel=='temp' ){ary[i]=parseFloat(mdata[i][1]);artmp[k]=[arx[i],parseFloat(mdata[i][1])]}
           if(datalabel=='hum'  ) ary[i]=arhum[k]=[arx[i],parseFloat(mdata[i][2])];
           if(datalabel=='press') ary[i]=arillum[k]=[arx[i],parseFloat(mdata[i][3])];
           if(datalabel=='pwm')   {ary[i]=parseFloat(mdata[i][4]);arpwm[k]=[arx[i],parseFloat(mdata[i][4])]}
           if(datalabel=='peltier') ary[i]=arpel[k]=[arx[i],parseFloat(mdata[i][5])];
           if(datalabel=='condensation') ary[i]=arcons[k]=[arx[i],parseFloat(mdata[i][6])];
           if(datalabel=='AH') ary[i]=arah[k]=[arx[i],parseFloat(mdata[i][7])];
           if(datalabel=='illum'){
               ary[i]=arlux[k]=[arx[i],parseFloat(mdata[i][8])];
              // console.log('mdata[i][8]:'+parseFloat(mdata[i][8]));
                }
           k+=1;
           }
    }
    
    if(datalabel=='temp' ){
    $(
    function () {
    now = new Date();
        // グラフオブジェクトの生成

    chart = new Highcharts.Chart({
        chart: {
            type: 'area',
            zoomType: 'xy',
            renderTo: 'container'
        },
        title: {
            text: 'ITBOX thermo graph'
        },
        subtitle: {
            text: document.ontouchstart === undefined ?
                    'Click and drag in the plot area to zoom in' :
                    'Pinch the chart to zoom in'
        },
        xAxis: {
            type: 'datetime',
            labels: {
               overflow: 'justify'
            }
        },
        yAxis: {
            title: {
                text: '温度変動',
                tickWidth: 10,
            },
                max: 40,
                min: 0
        },
        legend: {
            enabled: false
        },
        rangeSelector: {
            selected: 0
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
                //threshold: null,
//                pointInterval: 10000, // one hour
//                pointStart: Date.UTC(2016, 11, 20, 0, 0, 0)
//                pointStart: Date.parse(mdata[0][0])
            }
        },
        series: [{
            type: 'line',
            name: 'Temp',
            //pointInterval: pointinterval,
            data: artmp,// for normalize graph
            tooltip: {
                valueSuffix: ' ℃'
            }
        }]
    });
    });
    }
    if(datalabel=='hum'){
        $(
    function () {
    now = new Date();
        // グラフオブジェクトの生成

    chart = new Highcharts.Chart({
        chart: {
            type: 'scatter',
            zoomType: 'xy',
            renderTo: 'container'
        },
        title: {
            text: 'ITBOX hum graph'
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
                text: '相対湿度(%RH)',
                tickWidth: 10,
            },
                max: 100,
                min: 0
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
                //threshold: null
            }
        },

        series: [{
            type: 'line',
            name: 'Hum',
            pointInterval: pointinterval,
            data: arhum,// for normalize graph
            tooltip: {
                valueSuffix: '%RH'
            }
        }]
    });
    });

    }
    if(datalabel=='press'){
    $(
    function () {
    now = new Date();
        // グラフオブジェクトの生成

    chart = new Highcharts.Chart({
        chart: {
            type: 'scatter',
            zoomType: 'xy',
            renderTo: 'container'
        },
        title: {
            text: 'ITBOX pressure graph'
        },
        subtitle: {
            text: document.ontouchstart === undefined ?
                    'Click and drag in the plot area to zoom in' :
                    'Pinch the chart to zoom in'
        },
        xAxis: {
            type: 'datetime',
            format: "YYYYMMDD HHmmss",
            minRange: 100 // fourteen days
        },
        yAxis: {
            title: {
                text: '気圧変動',
            },
                max: 1000,
                min: 900

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
                //threshold: null
            }
        },

        series: [{
            type: 'line',
            name: 'press',
            pointInterval: pointinterval,
            data: arillum,// for normalize graph
            tooltip: {
                valueSuffix: 'hPa'
            }
        }]
    });
    });
       
    }
    if(datalabel=='illum'){
        console.log(arlux[0]);
    $(
    function () {
    now = new Date();
        // グラフオブジェクトの生成

    chart = new Highcharts.Chart({
        chart: {
            type: 'scatter',
            zoomType: 'xy',
            renderTo: 'container'
        },
        title: {
            text: 'ITBOX illum graph'
        },
        subtitle: {
            text: document.ontouchstart === undefined ?
                    'Click and drag in the plot area to zoom in' :
                    'Pinch the chart to zoom in'
        },
        xAxis: {
            type: 'datetime',
            format: "YYYYMMDD HHmmss",
            minRange: 100 // fourteen days
        },
        yAxis: {
            title: {
                text: '照度変動',
            },
               max: 10000,
                min: 0

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
                //threshold: null
            }
        },

        series: [{
            type: 'line',
            name: 'illum',
            pointInterval: pointinterval,
            data: arlux,// for normalize graph
            tooltip: {
                valueSuffix: 'Lux'
            }
        }]
    });
    });
       
    }
    
    if(datalabel=='pwm'){
    $(
    function () {
    now = new Date();
        // グラフオブジェクトの生成

    chart = new Highcharts.Chart({
        chart: {
            type: 'scatter',
            zoomType: 'xy',
            renderTo: 'container'
        },
        title: {
            text: 'ITBOX power graph'
        },
        subtitle: {
            text: document.ontouchstart === undefined ?
                    'Click and drag in the plot area to zoom in' :
                    'Pinch the chart to zoom in'
        },
        xAxis: {
            type: 'datetime',
            format: "YYYYMMDD HHmmss",
            minRange: 100 // fourteen days
        },
        yAxis: {
            title: {
                text: 'PWM変動',
            },
                max: 100,
                min: -100
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
               // threshold: null
            }
        },

        series: [{
            type: 'line',
            name: 'power',
            pointInterval: pointinterval,
            data: arpwm,// for normalize graph  arpwm
            tooltip: {
                valueSuffix: 'PWM(%)'
            }
        }]
    });
    });
       
    }
    if(datalabel=='peltier'){
    $(
    function () {
    now = new Date();
        // グラフオブジェクトの生成

    chart = new Highcharts.Chart({
        chart: {
            type: 'scatter',
            zoomType: 'xy',
            renderTo: 'container'
        },
        title: {
            text: 'ITBOX peltier temp graph'
        },
        subtitle: {
            text: document.ontouchstart === undefined ?
                    'Click and drag in the plot area to zoom in' :
                    'Pinch the chart to zoom in'
        },
        xAxis: {
            type: 'datetime',
            format: "YYYYMMDD HHmmss",
            minRange: 100 // fourteen days
        },
        yAxis: {
            title: {
                text: 'ペルチェ温度変動',
            },
                max: 50,
                min: -40
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
                //threshold: null
            }
        },

        series: [{
            type: 'line',
            name: 'peltier',
            pointInterval: pointinterval,
            data: arpel,// for normalize graph
            tooltip: {
                valueSuffix: '℃'
            }
        }]
    });
    });
       
    }
    if(datalabel=='condensation'){
    $(
    function () {
    now = new Date();
        // グラフオブジェクトの生成

    chart = new Highcharts.Chart({
        chart: {
            type: 'scatter',
            zoomType: 'xy',
            renderTo: 'container'
        },
        title: {
            text: 'ITBOX condensation temp graph'
        },
        subtitle: {
            text: document.ontouchstart === undefined ?
                    'Click and drag in the plot area to zoom in' :
                    'Pinch the chart to zoom in'
        },
        xAxis: {
            type: 'datetime',
            format: "YYYYMMDD HHmmss",
            minRange: 100 // fourteen days
        },
        yAxis: {
            title: {
                text: '露点変動',
            },
                max: 40,
                min: 0
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
                //threshold: null
            }
        },

        series: [{
            type: 'line',
            name: '露点',
            pointInterval: pointinterval,
            data: arcons,// for normalize graph
            tooltip: {
                valueSuffix: '℃'
            }
        }]
    });
    });
       
    }
    if(datalabel=='AH'){
    $(
    function () {
    now = new Date();
        // グラフオブジェクトの生成

    chart = new Highcharts.Chart({
        chart: {
            type: 'scatter',
            zoomType: 'xy',
            renderTo: 'container'
        },
        title: {
            text: 'ITBOX absolute humidity graph'
        },
        subtitle: {
            text: document.ontouchstart === undefined ?
                    'Click and drag in the plot area to zoom in' :
                    'Pinch the chart to zoom in'
        },
        xAxis: {
            type: 'datetime',
            format: "YYYYMMDD HHmmss",
            minRange: 100 // fourteen days
        },
        yAxis: {
            title: {
                text: '絶対湿度',
            },
                max: 20,
                min: 0
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
                //threshold: null
            }
        },
        series: [{
            type: 'line',
            name: 'AH',
            pointInterval: pointinterval,
            data: arah,// for normalize graph
            tooltip: {
                valueSuffix: 'kg/m^3'
            }
        }]
    });
    });   
    }
    
}

function setDatatoChart(data, datalabel, s){
    //dataがサーバから受け取るjson値をパースする
    var sdata='';
    $.each(data,
    function(key, val) {
    sdata = val;
    });
    
    if(typeof sdata === 'undefined' ) return false;
    sdata=sdata.split('<br>');  
    
    for(j=0;j<sdata.length-1;j++){
        if(sdata[j].split)
            mdata[j]=sdata[j].split(',');
console.log('mdata['+j+']='+mdata[j]);
    }

    for(j=1;j<mdata.length-1;j++){
        if(mdata[j][1] < 10) console.log('mdata['+j+']='+mdata[j][1]);
        if(mdata[j][1] === 0){
        //console.log('!!! mdata['+j+']='+mdata[j][1]);
            for(k=1;k<mdata[0].length-1;k++){
            mdata[j][k]=mdata[j-1][k];
            }
        }
    }

/////!!!!!!/////
    var point = chart.series[s];//.data;
    point.yAxis.Minimum = minValue;
    point.yAxis.Maximum = maxValue;
//console.log('mdata2='+mdata[0].toString().split(',')[0]);
 
    //point.pointStart=Date.parse(mdata[0].toString().split(',')[0]);
    
   var prog     = document.getElementById('progress');
   var prgVal   = document.getElementById('prgVal');
   
   addP(point, datalabel, mdata, prog, prgVal);

   //     initial value
   if(typeof mdata === "undefined"){
       point.addPoint(0.0);
       point.addPoint(40.0);       
   }
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
    if(filename.indexOf("/mnt/data/")<0)    filename = '/mnt/data/'+filename;
        
    console.log('Loading...  '+filename+' '+dataname);
    
    var seriese=0;
    mdata=[];
    loadDataFile(filename, dataname, seriese);
    //console.log('Wait a moment...');
}

function filenameDate(filename){
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
 
}

function message(mes){
if ($(document))
  {
      document.getElementById("message").innerHTML=mes;
  }
}

function resultmessage(mes){
if ($(document))
  {
      document.getElementById("result").innerHTML=mes;
  }
}

function messageConsole(mes){
if ($(document))
  {
      document.getElementById("messageConsole").innerHTML=mes;
  }
}

function cancel() {
     window.location.href="/";
}

var rdata=''; // return from command

function filePutContents(filename , dataVal) {
     message("filePutContents:"+filename);
//    $.ajaxSetup({ async: false });
    $.getJSON( 
    "/app/logchartscatter/filePutContents",//url
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
    if(window.confirm('本当に'+filename+'を'+removefilename.replace('/mnt/data/','')+'に変更しますか？')){
     message("newfile:");
     resultmessage('');
     
     if(filename.indexOf('/mnt/data/')<0) filename='/mnt/data/'+filename;
     if(removefilename.indexOf('/mnt/data/')<0) removefilename='/mnt/data/'+removefilename;
     var movedfile=removefilename;//filenameDate(filename);
     message('movefile  from '+filename+' to '+movedfile);
     
//    $.ajaxSetup({ async: false });
    $.getJSON( 
    "/app/logchartscatter/newfile",//url
    {"command":"mv", "arg":[filename, movedfile]},//data
    function(data) {
    //dataがサーバから受け取るjson値
    $.each(data, 
    function(key, val) {
    rdata = val;
    }
    );
       resultmessage(rdata);
       lsDataFile();
       // var point = chart.series[0];//.data;
       // point.remove(true);
    }
    );
//    return rdata;
    }
}

function update(){
    resultmessage('');
}

function makeChart() {
    $('#rollback').click(function(){
     update(); 
    });

    // 初回の測定値の取得と、定期処理(5分毎に自動更新)
   // Logger.getVal();
    //update();
    //setInterval(Logger.getVal ,5 * 60 * 1000);

    //setInterval(update , pointinterval);

        // グラフオブジェクトの生成
//    $('#container').highcharts({
    chart = new Highcharts.Chart({
        chart: {
            zoomType: 'xy',
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
             pointStart: Date.UTC(now.getYear(), now.getMonth()+1, now.getDate(),now.getHours(),now.getMinutes()),
           // pointStart: moment().add(9, 'hours').format("YYYY-MM-DD-HH:mm:ss"), 
            data: [0,40],// for normalize graph
            tooltip: {
                valueSuffix: ' ℃'
            }
        }]
    });
}

$(document).ready( function() {
    makeChart();
    readResource();
    lsDataFile();
});