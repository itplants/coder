//var EventEmitter = require('events').EventEmitter;
var MaxScN=1440;
var filename='tempSchedule.txt';
var saveFileName='tempSchedule.txt';

function getTempScheduleName(){
    var i=document.getElementById('saveFileName');
    if(i){
    console.log('getTempScheduleName='+i.value);
    return './schedule/'+i.value;
    } else return('');
}

function setTempScheduleName(f){
    var i=document.getElementById('setFileName');
    if(i) i.value=f;
    console.log('setTempScheduleName='+f);
}

// 新規作成
function newfile(){
    //delElements
    // 要素を全部消す。
    for(var i=0;i<MaxScN;i++){
        if(active[i] === true ) delElements(i);
    } 
    // 要素を１つだけ作る。
     addElements();
}

function fileRemove(){
    if(!filename){
       message('select file');
       return;
    }
    // 「OK」時の処理開始 ＋ 確認ダイアログの表示
    if(window.confirm(filename+'を本当に削除しますか？')){
    if(filename.indexOf('./schedule/')<0) filename = './schedule/'+filename;
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
        lsTempSchDataFile(console.log(sdata));
     });
    }
}

function selectDefault(){
 //    console.log('selectDefault');
     filename='tempSchedule.txt';
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
    "/app/highchartscatter/writeFileSync",//url
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

function lsTempSchDataFile( f ) {
 //   $.ajaxSetup({ async: false });
    $.getJSON( 
    "/app/highchartscatter/command",//url
    {"command":"ls", "args":['./schedule/*.txt']},//data
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
              XMLlist[i]=XMLlist[i].substr(11);
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
    //	e.target.style.backgroundColor = "#ffffff";
        filename = e.target.innerHTML;
        //var ot=document.getElementById('output');
        //if(ot) ot.innerHTML=filename;
        document.getElementById('saveFileName').value= filename;
        filename = './schedule/'+filename;

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
        filename = './schedule/'+filename;

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
    "/app/logchartscatter/command",//url
    {"command":"cat", "arg":[req]}
    );
    
    $.when(dfd).done(function(rdata) {
    //処理
    var sdata='';
    $.each(rdata,
    function(key, val) {
    sdata = val;
    console.log('sdata=|'+sdata+'|');
    });
    
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

function deleteAllElements(){
// delete all Elements
    var activeList=getActiveElements();
    for(i=0;i<activeList.length;i++) delElements(activeList[i]);
}

// アクティブな要素番号を返す
function getActiveElements(){
// return active Elements list
    var activeList=[];// 要素番号リスト
    for(j=0,i=0;i<MaxScN;i++){
    if( active[i] === true ){
        activeList[j++]=i;
        }
    }
    return activeList;
}

// 空の要素番号を返す
function getEmptyElement(){
    var emptyNo=0;
    for(i=0;i<MaxScN;i++){
    if( active[i] === false ){
        emptyNo=i;
        break;
        }
    }
    return emptyNo;
}

function interpolateElements(){
    var result='';
    var seq=document.getElementsByName('sequence');
    result ='';
    timePower=[];

    // 要素数の数え直し
    var activeList=getActiveElements();
    
    // 設定時間の読み出し
    for(i=0;i<activeList.length;i++){
        timePower[i]={'time':getTime(activeList[i]),'power':getPower(activeList[i])};
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
    
    deleteAllElements();    

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
    console.log('saveTempSchedule:'+filename+'|'+value+'|');
    // 拡張子を付ける
    if(filename.indexOf('.txt')<0) filename+'.txt';
    $.getJSON( 
    "/app/tempschedule/writeFileSync",//url
    {"file":filename, "data":value},//data
    function(data) {
    //dataがサーバから受け取るjson値

    $.each(data, 
    function(key, val) {
    rdata = val.replace(/<br>/g,'\n');
    });
     console.log('saveTempSchedule: |'+rdata+'|');
     if(f) f();
    });    
}

var timePower=[];

function getTimeVal(a){
    t=a.split(':');
    return parseInt(t[0])*60+parseInt(t[1]);
}

function setData(rdata){
 ///////////////////   
        if(rdata[rdata.length-1]==='') rdata.pop();
        deleteAllElements(); 
        var tdata=String(rdata).split(',');
// var i=0 にしないと、途中でiの内容が変わる。
         for(var i=0;i<tdata.length;i++){
//     console.log('setData tdata['+i+']='+tdata[i]);
            if(tdata[i].split(' ')[0]==='targetTemp'){
                var t=tdata[i].split(' ')[3];
                var p=tdata[i].split(' ')[1];
                    addElements();
                    changeTime(i, t);
                    changePower(i,p);
                    timePower[i]={'time':t,'power':p};
                    }
                    if(tdata[i].split(' ')[0]==='setPID'){
                        kp=parseFloat(tdata[i].split(' ')[2]);
                        ki=parseFloat(tdata[i].split(' ')[4]);
                        kd=parseFloat(tdata[i].split(' ')[6]);
                        setPID();
                    } 
        }// next i
            
    timePower.sort(
        function(a,b){
        var aTime = getTimeVal(a["time"]);
        var bTime = getTimeVal(b["time"]);
        if( aTime < bTime ) return -1;
        if( aTime > bTime ) return 1;
        return 0;
        });   
}

function loadTempSchedule(){
    // load default file
    // /home/coder/coder-dist/coder-base/config/saveTempController.txt
    $.getJSON( 
    "/app/tempschedule/command",//url
    {"command":"setTemps", "arg":['']},//data
    function(data) {
    //dataがサーバから受け取るjson値
    $.each(data, 
    function(key, val) {
    rdata = val.split('<br>');
    });
    setData(rdata);
    });    
}

function loadTempSchedule2(){
    f = getTempScheduleName();
    // load  file f

    console.log('loadTempSchedule2:'+f);
    $.getJSON( 
    "/app/tempschedule/command",//url
    {"command":"setTemps", "arg":[f]},//data
    function(data) {
    //dataがサーバから受け取るjson値
    $.each(data, 
    function(key, val) {
        rdata = val.split('<br>');
    });
    setData(rdata);        
    });    
}

src="/static/datetimepicker/jquery.datetimepicker.js";

var addnum=0;
var active=[];

function addElements() {
//
//  active[i]==falseの場所に入れる    
//
    var activeList=getActiveElements();
    console.log('addElements activeList=',activeList);

    if(activeList.length > MaxScN-1){
        document.getElementById("Error").innerHTML=targetnum+'これ以上設定できません';
        return;
    }
    if(activeList.length===0) activeList[0]=0;
    
    // 空の番号
    targetnum=getEmptyElement();
        console.log('addElements targetnum=',targetnum);

    addnum=activeList.length;
    
    // 予約
    active[targetnum] = true;
    
    // HTML
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
    
    // add class="No"
    base_element.innerHTML = '<td class="No"><button name="Btn" onclick="delElements('+targetnum+')">X'+targetnum+'</button></td>';
    base_element.innerHTML +='<td><input type="text" id="'+start_id+'"/><input style="width: 120px;" type="range" min="0" max="59" id="range'+targetnum+'" step="1" value="0" oninput="changeVal('+targetnum+',this.value)" onchange="changeMin('+targetnum+',this.value)"></><input style="width: 15px;" type="text" id="lv'+targetnum+'" value="0" onchange="changeMin('+targetnum+',this.value)" ></></td>';
    base_element.innerHTML += '<td><input style="width: 80px;" type="text" id="power'+targetnum+'" value="0" onchange="changePower('+targetnum+',this.value)" ></td>';
    
    base_element.appendChild(start_element);
    base_element.appendChild(end_element);
    
    // jQueryでなければならない。ソートできない。
    var stable = $('#tableID');
    stable.append(base_element); 
    /*
    p=document.getElementById('power'+targetnum);
    p=document.getElementById('time'+targetnum);
    */
    
    // renumbering button
    p=document.getElementsByName('Btn');
    for(i=0;i<p.length;i++){
        p[i].innerHTML='X'+i;
        p[i].value='X'+i;
        console.log('p.innerHTML='+p[i].innerHTML);
    }
/*
    // list sort ///
    var options = {
      valueNames: [ 'No' ]
    };
    var userList = new List('settings', options);
    //console.log('userList=',userList);
    userList.sort( 'No');
    /////
*/
    // body要素にdivエレメントを追加
 addnum++;

    $('#'+start_id).datetimepicker({
            value:'00:00',
            datepicker:false,
            format:'H:i',
            //step:30,
            language: 'ja',
          onShow:function( ct ){
           this.setOptions({
            value:'設定時刻を選択'
           })
          },
          onSelectTime:function(ct,$i){
          //　設定されるたびにデータ取得する
          var tt=ct.toString();
         //console.log('tt='+tt);
          changeVal(i,0);
          changeRange(i,0);
          var t=tt.split(' ')[4].split(':')[0]+':'+tt.split(' ')[4].split(':')[1];
          console.log(t);
          changeTime(i,t);
          } 
        });       
}

function changeTime(n, v){
    // hh:mm
    console.log('changeTime'+n+':  '+v);
    $('#start'+n).datetimepicker({value: v, format:'H:i'});
    changeRange(n,v.split(':')[1]);
}

function getTime(n){
    var ids = 'start'+n;
    var objs= $('#'+ids).datetimepicker('getDate');
    return objs.val();
}

function changeVal(n, v){
var lv=document.getElementById('lv'+n);
    if(lv){
        lv.value=v;
    }
}

function getVal(n){
var lv=document.getElementById('lv'+n);
    if(lv){
        return lv.value;
    }
}

function changeRange(n, v){
var lv=document.getElementById('range'+n);
    if(lv){
        lv.value=v;
    }
}

function getRange(n, v){
var lv=document.getElementById('range'+n);
    if(lv){
        return lv.value;
    }
}

function changePower(n, v){
var lv=document.getElementById('power'+n);
    if(lv){
        lv.value=v;
    }
}

function getPower(n){
var lv=document.getElementById('power'+n);
    if(lv){
        return lv.value;
    }
}

function changeMin(n, v){
    v= v|0;
//console.log('slider value='+v);
     var ids = 'start'+n;
//     var objs= $('#'+ids).datetimepicker('getDate');
     var objs= $('#'+ids).datetimepicker('getDate');
//console.log('dataPicker value1='+objs.val());
     var yt= objs.val().split(' ');
     var hm=yt[0];
     if(yt.length>1) hm=yt[1];
     var t = hm.split(':');     
//console.log('dataPicker value2='+t[0]+':'+t[1]);
     var startm= parseInt(v);
     if(startm<0) startm=0;
//console.log('startm='+startm);

     var starth= t[0]|0;
//console.log('starth='+starth);
    starth += parseInt(startm / 60);
//console.log('starth='+starth);

     startm = parseInt(startm % 60);
     if( starth <= 9 ) starth= '0'+starth;
     if( startm <= 9 ) startm= '0'+startm;
//console.log('dataPicker value='+starth+':'+startm);
    if(yt.length==1)
         $('#'+ids).datetimepicker({value: starth+':'+startm, format:'H:i'})
    if(yt.length==2)
         $('#'+ids).datetimepicker({value: yt[0]+' '+starth+':'+startm/*, format:'H:i'*/})           
}

function getTempTemplate(f) {
    $.getJSON( 
    "/app/tempschedule/command",//url
    {"command":"getTempTemplate.py", "arg":['']},//data
    function(data) {
    //dataがサーバから受け取るjson値
        $.each(data, 
        function(key, val) {
          rdata = val.split('<br>');
        });

        deleteAllElements();
        
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
            
    timePower.sort(
        function(a,b){
        var aTime = getTimeVal(a["time"]);
        var bTime = getTimeVal(b["time"]);
        if( aTime < bTime ) return -1;
        if( aTime > bTime ) return 1;
		return 0;
      });
    });    
}

function delElements(no) {
//console.log('del='+no);
 var p=document.getElementById('start'+no);
    if(p){
    addnum--;
    active[no] = false;
    if(addnum <= 0) addnum=0;
    
    document.getElementById('start'+no).remove();    
    document.getElementById('end'+no).remove();
    document.getElementById('base'+no).remove();
    } else {
    console.log('delElements Error start'+no+' is not found');
    }
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

function makeData(){
///////
var result='';
    setBtnDisable();
    var seq=document.getElementsByName('sequence');
    result ='';
    var activeList=getActiveElements();
    for(var i=0;i<activeList.length;i++){
        var ii=activeList[i];
    result += 'targetTemp '+getPower(ii)+' start '+getTime(ii)+'\n';
    timePower[ii]={'time':getTime(ii),'power':getPower(ii)};
    } 
    timePower.sort(
        function(a,b){
        var aTime = getTimeVal(a["time"]);
        var bTime = getTimeVal(b["time"]);
        if( aTime < bTime ) return -1;
		if( aTime > bTime ) return 1;
		return 0;
	});
    
    result ='';
    for(i=0;i<activeList.length;i++){
        ii=activeList[i];
        result += 'targetTemp '+timePower[ii]['power']+' start '+timePower[ii]['time']+'\n';
    }
    // PID
    // 'setPID Kp '+kp+' Ki '+ki+' Kd '+kd;
    result += 'setPID Kp '+kp+' Ki '+ki+' Kd '+kd;
    return result;
 ///////   
}

function saveElements() {
    var result=makeData();
/*
///////
var result='';
    setBtnDisable();
    var seq=document.getElementsByName('sequence');
    result ='';
    for(i=0;i<addnum;i++){
    if( active[i] === true ){
    result += 'targetTemp '+getPower(i)+' start '+getTime(i)+'\n';
    timePower[i]={'time':getTime(i),'power':getPower(i)};
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
    
    result ='';
    for(i=0;i<addnum;i++){
    if( active[i] === true ){
    result += 'targetTemp '+timePower[i]['power']+' start '+timePower[i]['time']+'\n';
        }
    }
    // PID
    // 'setPID Kp '+kp+' Ki '+ki+' Kd '+kd;
    result += 'setPID Kp '+kp+' Ki '+ki+' Kd '+kd;
 ///////   
*/
    console.log(result);
    saveTempSchedule('./config/saveTempController.txt',result,setBtnEnable());
}

function saveElements2() {
        var result=makeData();
/*
///////
var result='';
    setBtnDisable();
    saveFileName=getTempScheduleName();
    var seq=document.getElementsByName('sequence');
//    if(window.confirm(saveFileName+'を本当に保存しますか？ '+addnum)){
    for(var i=0;i<addnum;i++){
    if( active[i] === true ){
    timePower[i]={'time':getTime(i),'power':getPower(i)};
        }
    }
    for(i=0;i<addnum;i++){
    if( active[i] === true ){
    result += 'targetTemp '+timePower[i]['power']+' start '+timePower[i]['time']+'\n';
        }
    }
    // PID
    // 'setPID Kp '+kp+' Ki '+ki+' Kd '+kd;
    result += 'setPID Kp '+kp+' Ki '+ki+' Kd '+kd;
///////    
 */   
    saveFileName=getTempScheduleName();
    // 拡張子を付ける
    if(saveFileName.indexOf('.txt')<0)
            saveFileName=saveFileName+'.txt';
    if(saveFileName.indexOf('./schedule/')<0)
            saveFileName='./schedule/'+saveFileName;
    lsTempSchDataFile(saveTempSchedule(saveFileName,result,lateJob()));
    //lsTempSchDataFile(loadTempSchedule(''));
//    }
}

function setTemp(arg) {
    $.getJSON(
    "/app/tempcontroller/command",//url
    {"command":"getTargetTemp.sh", "arg":[arg]},//data
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
    {"command":"getCurrentTemp.sh", "arg":[arg]},//data
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
    setTempScheduleName('./config/saveTempController.txt');
    lsTempSchDataFile(loadTempSchedule(''));
    //
});