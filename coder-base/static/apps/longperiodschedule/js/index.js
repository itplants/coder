//var EventEmitter = require('events').EventEmitter;
var MaxScN=1440;
var filename='saveLongPeriodSchedule.txt';
var saveFileName='saveLongPeriodSchedule.txt';

function getTempScheduleName(){
    var i=document.getElementById('saveFileName');
    if(i){
    console.log('getTempScheduleName='+i.value);
    return './LongPeriodSchedule/'+i.value;
    } else return'';
}

function setTempScheduleName(f){
    var i=document.getElementById('setFileName');
    if(i) i.value=f;
    console.log('setTempScheduleName='+f);
}

function fileRemove(){
    if(!filename){
       message('select file');
       return;
    }
    // 「OK」時の処理開始 ＋ 確認ダイアログの表示
    if(window.confirm(filename+'を本当に削除しますか？')){
    if(filename.indexOf('./LongPeriodSchedule/')<0) filename = './LongPeriodSchedule/'+filename;
    console.log('rm '+filename);
    var dfd1=$.getJSON( 
    "/app/longperiodschedule/command",//url
    {"command":"rmXML", "args":[filename]});//data
     $.when(dfd1).done(function(data) {
//  処理
      var sdata='';
           $.each(data,
           function(key, val) {
           sdata = val;
           });
           console.log(sdata)
        lsTempSchDataFile(setBtnEnable());
     });
    }
}

function selectDefault(){
 //    console.log('selectDefault');
     filename='saveLongPeriodSchedule.txt';
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

//writeFileSync
function writeFileSync( file, data, f ) {
 //   $.ajaxSetup({ async: false });
    $.getJSON( 
    "/app/longperiodschedule/writeFileSync",//url
    {"file":file, "data":data},//data
    function(data) {
    //dataがサーバから受け取るjson値
    //var rdata='';
    $.each(data,
    function(key, val) {
    rdata = val;
        });
        if(f) f();
    });
}

//
// 
function lsTempSchDataFile( f ) {
    $.getJSON( 
    "/app/longperiodschedule/command",//url
    {"command":"ls", "args":["./LongPeriodSchedule/*"]},//data
    function(data) {
    //dataがサーバから受け取るjson値
    $.each(data,
    function(key, val) {
    rdata = val;
    });
    console.log("rdata="+rdata);
    
     XMLlist=rdata.split('<br>');
          for(i=0;i<XMLlist.length-1;i++){
              XMLlist[i]=XMLlist[i].replace("./LongPeriodSchedule/","");
              if(XMLlist[i].indexOf('.err')>=0){
                  console.log('del '+XMLlist[i]);
                  XMLlist.splice(i,1);
              }
          }

     var ls=document.getElementById("list");
     var flist='<table>';
     for(i=0;i<XMLlist.length-1;i+=2){
         flist += '<tr><td  >['+i+']</td>'+'<td name="tag" >'+XMLlist[i].replace('./data/','')+'<td><td>['+(i+1)+']</td>'+'<td name="tag" >'+XMLlist[i+1].replace('./data/','')+'<td><tr>';
     }
    flist += '</table>';
    ls.innerHTML=flist;
    addListners();
    console.log('XMLlist=|'+XMLlist+"|");
    console.log('XMLlist.length='+XMLlist.length);
    selectDefault();
    if(XMLlist.length===1){
        ls.innerHTML='Long Period Scheduleは動作していません。';
    }
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
       // var ot=document.getElementById('output');
        //filename = e.target.innerHTML;
        //if(ot) ot.innerHTML=filename;
        //var ot=document.getElementById('output');
        //filename = e.target.innerHTML;
    }

    // ------------------------------------------------------------
    // マウスのボタンを離すと実行される関数
    // ------------------------------------------------------------
    function MouseUpFunc(e){
    //    e.target.style.backgroundColor = "#ffffff";
        filename = e.target.innerHTML;
        //var ot=document.getElementById('output');
        //if(ot) ot.innerHTML=filename;
        document.getElementById('saveFileName').value= filename;
        filename = './LongPeriodSchedule/'+filename;

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
        //document.getElementById('input').innerHTML= filename;
        document.getElementById('saveFileName').value= filename;
        filename = './LongPeriodSchedule/'+filename;

        var dataname='';
        if(radios){
            for(i=0;i<radios.length;i++){
                if(radios[i].checked){
                    dataname=radios[i].value;
                }
            }
        }
       console.log(dataname);
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

function loadDataFile( req, datalabel, s ) {
    rdata='';
    //console.log('req=readLog '+req)
    message('');
    messageConsole('data loading...');
    var dfd='';
    dfd=$.getJSON(
    "/app/longperiodschedule/command",//url
    {"command":"cat", "args":[req]}
    );
    
    $.when(dfd).done(function(rdata) {
    //処理
    var sdata='';
    $.each(rdata,
    function(key, val) {
    sdata = val;
    console.log('sdata=|'+sdata+'|');
    });
    
   // setDatatoChart(rdata, datalabel, s);
    messageConsole('');
    });
}

function go(){
//Enterキー
var req=document.getElementById("worktime").value;
if(window.event.keyCode==13){
    }
}

function cancel() {
     window.location.href="/";
}

var rdata=''; // return from command
var kp=0.1;
var ki=0.01;
var kd=0.01;

function changePID(n, v){
    if(isFinite(parseFloat(v))){
        if(n==='kp') kp=parseFloat(v);
        if(n==='ki') ki=parseFloat(v);
        if(n==='kd') kd=parseFloat(v);
        // savePID(kp,ki,kd);
       console.log(n,kp,ki,kd,parseFloat(v));
    }
}

function setPID(){
    document.getElementById('kp').value=kp;
    document.getElementById('ki').value=ki;
    document.getElementById('kd').value=kd;
}

function interpolateElements(){
    var result='';
    var seq=document.getElementsByName('sequence');
    result ='';
    timePower=[];
    for(j=0,i=0;i<addnum;i++){
    if( active[i] === true ){
    timePower[j]={'time':getTime(i),'power':getPower(i)};
    j++;
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
    
var time=[];
var tmp=[];
for(i=0;i<timePower.length;i++){
        tmp[i] =timePower[i]["power"];
        a=timePower[i]["time"].split(':');
        time[i]=parseInt(a[0])*60+parseInt(a[1]);
}
    var an=addnum;
    for(i=0;i<an;i++) delElements(i);

    var intp=6;
    var n=timePower.length;
    console.log('n='+n);
   //var sprintf = require("sprintf-js").sprintf;
   var j=0;
   var tt=0;
   var tm=0;
    for(i=0;i<time.length-1;i++){
        for(var m=0;m<intp;m++){
    tt=parseFloat(tmp[i+1]-tmp[i])/parseFloat(intp)*m+parseFloat(tmp[i]);
    tm=parseInt(parseFloat(time[i+1]-time[i])*parseFloat(m)/parseFloat(intp))+time[i];
    tt=Math.floor(parseFloat(tt*100.0))/100.0;
        console.log('i='+i+'m='+m+'targetTemp '+tt+' start '+parseInt(parseFloat(tm)/60.0)+':'+parseInt(tm % 60 ));
        addElements();
        changeTime(j,parseInt(parseFloat(tm)/60.0)+':'+parseInt(tm % 60));
        changePower(j,parseFloat(tt));
        j++;
        }
    }
    tt=tmp[time.length-1];
    tt=Math.floor(parseFloat(tt*100.0))/100.0;
    tm=parseInt(time[time.length-1]);
        console.log('i='+i+'m='+m+'targetTemp '+tt+' start '+parseInt(parseFloat(tm)/60.0)+':'+parseInt(tm % 60 ));
        addElements();
        changeTime(j,parseInt(parseFloat(tm)/60.0)+':'+parseInt(tm % 60));
        changePower(j,parseFloat(tt));
}

function saveTempSchedule(filename,value,f){
    console.log('saveLongPeriodSchedule:'+filename+'|'+value+'|');
    if(filename.indexOf("LongPeriodSchedule/") < 0){
        filename = "./LongPeriodSchedule/"+filename;
    }
    $.getJSON( 
    "/app/longperiodschedule/writeFileSync",//url
    {"file":filename, "data":value},//data
    function(data) {
    //dataがサーバから受け取るjson値

    $.each(data, 
    function(key, val) {
    rdata = val.replace(/<br>/g,'\n');
    });
     console.log('saveLongPeriodSchedule: |'+rdata+'|');
     if(f) f();
    });    
}

var timePower=[];

function getTimeVal(a){
    t=a.split(':');
    return parseInt(t[0])*60+parseInt(t[1]);
}

function loadTempSchedule(){
    $.getJSON( 
    "/app/longperiodschedule/command",//url
    {"command":"setLongPeriodSchedule", "args":['']},//data
    function(data) {
    //dataがサーバから受け取るjson値

    $.each(data, 
    function(key, val) {
    rdata = val.split('<br>');
    });

        var delnum=addnum;
        for(i=0;i<delnum;i++) delElements(i);
        
//      add Elements
         for(i=0;i<rdata.length-1;i++){
             if(rdata[i]){
        //console.log('rdata='+rdata[i].split(' ')[1]);
            if(rdata[i].split(' ')[0]==='targetTemp'){
            addElements();
            changeTime(i,rdata[i].split(' ')[3].split(':')[0]+':'+rdata[i].split(' ')[3].split(':')[1]);
            changePower(i,rdata[i].split(' ')[1]);
            timePower[i]={'time':rdata[i].split(' ')[3].split(':')[0]+':'+rdata[i].split(' ')[3].split(':')[1],'power':rdata[i].split(' ')[1]};
      // console.log('loadTempSchedule: |'+timePower[i]['time']+' '+timePower[i]['power']+'|');
            }
            if(rdata[i].split(' ')[0]==='setPID'){
                kp=parseFloat(rdata[i].split(' ')[2]);
                ki=parseFloat(rdata[i].split(' ')[4]);
                kd=parseFloat(rdata[i].split(' ')[6]);
                setPID();
            }   
                }
            }       
    });    
}

function loadTempSchedule2(){
    f = getTempScheduleName();
    console.log('loadTempSchedule2:'+f);
//    if(window.confirm(f+'を本当に読込しますか？')){
    $.getJSON( 
    "/app/longperiodschedule/command",//url
    {"command":"setLongPeriodSchedule", "args":[f]},//data
    function(data) {
    //dataがサーバから受け取るjson値

    $.each(data, 
    function(key, val) {
    rdata = val.split('<br>');
    });

        var delnum=addnum;
        for(i=0;i<delnum;i++) delElements(i);
        
//      add Elements
         for(i=0;i<rdata.length-1;i++){
             if(rdata[i]){
        //console.log('rdata='+rdata[i].split(' ')[1]);
            if(rdata[i].split(' ')[0]==='targetTemp'){
            addElements();
            changeTime(i,rdata[i].split(' ')[3].split(':')[0]+':'+rdata[i].split(' ')[3].split(':')[1]);
            changePower(i,rdata[i].split(' ')[1]);
            timePower[i]={'time':rdata[i].split(' ')[3].split(':')[0]+':'+rdata[i].split(' ')[3].split(':')[1],'power':rdata[i].split(' ')[1]};
      // console.log('loadTempSchedule: |'+timePower[i]['time']+' '+timePower[i]['power']+'|');
            }
            if(rdata[i].split(' ')[0]==='setPID'){
                kp=parseFloat(rdata[i].split(' ')[2]);
                ki=parseFloat(rdata[i].split(' ')[4]);
                kd=parseFloat(rdata[i].split(' ')[6]);
                setPID();
            }   
                }
            }          
        });    
}

var addnum=0;
var active=[];

function addElements() {
//
//  active[i]==falseの場所に入れる    
//
var targetnum=0;

    for(var i=0;i<MaxScN;i++){
        if(active[i] === false){
//            document.getElementById("clicked").innerHTML=i+' is empty';
          targetnum=i;
          break;
        }
    }
    //console.log('targetnum '+targetnum);
    //    document.getElementById("Error").innerHTML='Target num:'+targetnum;
    if(targetnum>MaxScN-1){
        document.getElementById("Error").innerHTML=targetnum+'これ以上設定できません';
        return;
    }
    
    active[targetnum] = true;
    
    var start_element = document.createElement('div');
    var start_id = 'start'+targetnum;
    start_element.id = start_id;
    start_element.innerHTML =null;
    start_element.visibility = 'hidden';

    var end_element = document.createElement('div');
    var end_id = 'end'+targetnum;
    end_element.id = end_id;
    end_element.innerHTML =null;
    end_element.visibility = 'hidden';


    var base_element = document.createElement('tr');
    var base_id = 'base'+targetnum;
    base_element.id = base_id;
    
    base_element.innerHTML = '<td><button onclick="delElements('+targetnum+')">X'+targetnum+'</button></td>';
    base_element.innerHTML +='<td><input type="text" id="time'+targetnum+'" value="00:00"/></td>';
    base_element.innerHTML += '<td><input style="width: 80px;" type="text" id="power'+targetnum+'" value="0" ></td>';
    base_element.appendChild(start_element);
    base_element.appendChild(end_element);

var stable = $('#tableID');
    stable.append(base_element);
 addnum++;

}

function changeTime(n, v){
var lv=document.getElementById('time'+n);
    if(lv){
        lv.value=v;
    } else console.log("changeTime null "+n+" "+v);
}

function getTime(n){
    var obj=document.getElementById('time'+n);
    if(obj){
        console.log("getTime "+'time'+n);
        return obj.value;
        } else {
            console.log("getTime null");
            return null;
        }
}

function changePower(n, v){
var lv=document.getElementById('power'+n);
    if(lv){
        lv.value=v;
    } else console.log("changePower null");
}

function getPower(n){
var lv=document.getElementById('power'+n);
    if(lv){
        return lv.value;
    } else console.log("getPower null");
}

function getTempTemplate(f) {
    $.getJSON( 
    "/app/tempschedule/command",//url
    {"command":"getTempTemplate.py", "args":['']},//data
    function(data) {
    //dataがサーバから受け取るjson値

    $.each(data, 
    function(key, val) {
    rdata = val.split('<br>');
    });

        var delnum=addnum;
        for(i=0;i<delnum;i++) delElements(i);
        
//      add Elements
         for(i=0;i<rdata.length-1;i++){
             if(rdata[i]){
        console.log('rdata='+rdata[i].split(' ')[1]);
            if(rdata[i].split(' ')[0]==='targetTemp'){
            addElements();
            changeTime(i,rdata[i].split(' ')[3].split(':')[0]+':'+rdata[i].split(' ')[3].split(':')[1]);
            changePower(i,rdata[i].split(' ')[1]);
            timePower[i]={'time':rdata[i].split(' ')[3].split(':')[0]+':'+rdata[i].split(' ')[3].split(':')[1],'power':rdata[i].split(' ')[1]};
      // console.log('loadTempSchedule: |'+timePower[i]['time']+' '+timePower[i]['power']+'|');
            }
            if(rdata[i].split(' ')[0]==='setPID'){
                kp=parseFloat(rdata[i].split(' ')[2]);
                ki=parseFloat(rdata[i].split(' ')[4]);
                kd=parseFloat(rdata[i].split(' ')[6]);
                setPID();
            }   
                }
            }
            
    });    
}

function delElements(no) {
//console.log('del='+no);
    addnum--;
    active[no] = false;
    if(addnum <= 0) addnum=0;
    
    document.getElementById('start'+no).remove();    
    document.getElementById('end'+no).remove();
    document.getElementById('base'+no).remove();
    
    // body要素にdivエレメントを削除
}

function setBtnDisable(){
    var b=document.getElementById('setBtn');
    b.disabled = true;
}

function setBtnEnable(){
    var b=document.getElementById('setBtn');
    b.disabled = false;
}

function lateJob(){
    lsTempSchDataFile(setBtnEnable());
}

function saveElements() {
var result='';
    setBtnDisable();
    var seq=document.getElementsByName('sequence');
    result ='';
    for(i=0;i<addnum;i++){
    if( active[i] === true ){
    result += 'targetTemp '+getPower(i)+' period '+getTime(i)+'\n';
    timePower[i]={'time':getTime(i),'power':getPower(i)};
        }
    } 

    result ='';
    for(i=0;i<addnum;i++){
    if( active[i] === true ){
    result += 'targetTemp '+timePower[i]['power']+' period '+timePower[i]['time']+'\n';
        }
    }
    // PID
    // 'setPID Kp '+kp+' Ki '+ki+' Kd '+kd;
    if(result.length>0){
    result += 'setPID Kp '+kp+' Ki '+ki+' Kd '+kd;
    }
    console.log(result);
    saveTempSchedule('saveLongPeriodSchedule.txt',result,setBtnEnable());
}

function saveElements2() {
var result='';
    setBtnDisable();
    saveFileName=getTempScheduleName();
    var seq=document.getElementsByName('sequence');
//    if(window.confirm(saveFileName+'を本当に保存しますか？ '+addnum)){
    for(i=0;i<addnum;i++){
    if( active[i] === true ){
    timePower[i]={'time':getTime(i),'power':getPower(i)};
        }
    }
    for(i=0;i<addnum;i++){
    if( active[i] === true ){
    result += 'targetTemp '+timePower[i]['power']+' period '+timePower[i]['time']+'\n';
        }
    }
    // PID
    // 'setPID Kp '+kp+' Ki '+ki+' Kd '+kd;
    result += 'setPID Kp '+kp+' Ki '+ki+' Kd '+kd;
    //window.alert(result);
//    if(saveFileName.indexOf('./LongPeriodSchedule/')<0){
//            saveFileName='./LongPeriodSchedule/'+saveFileName;
//    }
    lsTempSchDataFile(saveTempSchedule(saveFileName,result,lateJob()));
}

function setTemp(arg) {
    $.getJSON(
    "/app/tempcontroller/command",//url
    {"command":"getTargetTemp.sh", "args":[arg]},//data
    function(data) {
    //dataがサーバから受け取るjson値
    $.each(data, 
    function(key, val) {
    //rdata = val.split('<br>');
    var targetT=parseInt(val);
    //rdata[0].split(' ')[1];
    if( !isFinite(targetT) ) setTemp(arg);
    console.log(targetT);
    document.getElementById('curtmp').innerHTML='現在の設定温度 : '+targetT+'度';
        });
    });
}

function getTemp(arg) {
    //   console.log('getTemp');

    $.getJSON(
    "/app/tempcontroller/command",//url
    {"command":"getCurrentTemp.sh", "args":[arg]},//data
    function(data) {
    //dataがサーバから受け取るjson値
    $.each(data, 
    function(key, val) {
    //console.log('val='+val);

    rdata = val.split('<br>');
    //console.log('v='+rdata);
    var v=parseFloat(rdata[0]);
    //console.log('v='+v);
    if(!isFinite(v)) getTemp(arg);
    console.log(v);
    document.getElementById('curtmp').innerHTML='現在の設定温度 : '+v+'度';
        });
    });
}

function setTempValue(){
       var val=document.getElementById("value").value;
       //console.log(val);
       if(!isFinite(val)) return;
//       if(!isFinite(val)) val=20.0;
       setTemp([val]);
       //setTemp('');
}
/*
    var start=[];
    var end=[];
    var ms='';
*/
$(document).ready( function() {
    active[0] = true;
    for(var i=1;i<MaxScN;i++) active[i] = false;
 $('#tableID').dataTable( {
    "bPaginate": false,
    "bLengthChange": false,
    "bFilter": false,
    "bSort": false,
    "bInfo": false,
    "bAutoWidth": false,
    "paging":   false,
    "ordering": true,
    "info":     false,
    "tableID_info":false
  });
    //
    setTempScheduleName('./LongPeriodSchedule/saveLongPeriodSchedule.txt');
    lsTempSchDataFile(loadTempSchedule(''));
    //
});