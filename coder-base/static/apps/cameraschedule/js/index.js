//var EventEmitter = require('events').EventEmitter;
var MaxScN=1440;

function go(){
//Enterキー
var req=document.getElementById("worktime").value;
message(req);
if(window.event.keyCode==13){
    message(req);
    }
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

function cancel() {
     window.location.href="/";
}

var rdata=''; // return from command

function sendcomCommand( req, f ) {
//var ev = new EventEmitter();
    
//     message("command:"+req);
//    $.ajaxSetup({ async: false });
    $.getJSON( 
    "/app/cameraschedule/command",//url
    {"command":"sendcom", "arg":req},//data
    function(data) {
    //dataがサーバから受け取るjson値

    $.each(data, 
    function(key, val) {
    rdata = val;
    console.log('sendcomCommand:'+rdata);
    });
    if(f) f(rdata);
    });
    
}

function saveCamSchedule(req, f){
    
    if(req) console.log('saveCamSchedule: |'+req+'|');
    $.getJSON( 
    "/app/cameraschedule/command",//url
    {"command":"saveCamSchedule", "arg":[req]},//data
    function(data) {
    //dataがサーバから受け取るjson値
    $.each(data, 
    function(key, val) {
    rdata = val;
    });
    console.log('saveCamSchedule: |'+rdata+'|');
    if(f) f();
    });    
}

var camInfo='';
// USB CamのIDを取得すること
function checkVideo(req,f) {
//     message("command:"+req);
    $.getJSON( 
    "/app/cameraschedule/command",//url
    {"command":"ls", "arg":req},//data
    function(data) {
    //dataがサーバから受け取るjson値

    $.each(data, 
    function(key, val) {
    rdata = val;
    console.log('checkVideo:'+rdata);
    }
    );
    camInfo = rdata.replace('<br>','');
       //resultmessage('checkVideo: |'+camInfo+'|');
       setCamRadioBtn(camInfo);
       if(f) f();
    }
    );    
}

function checkITP(f) {
    $.getJSON( 
    "/app/cameraschedule/command",//url
    {"command":"sendcom", "arg":['-e','D']},//data
    function(data) {
    //dataがサーバから受け取るjson値

    $.each(data, 
    function(key, val) {
    rdata = val;
        console.log('checkItp:'+rdata);
    }
    );
       setITPRadioBtn(rdata.split('<br>')[0].split('  ')[1]);
       setLEDRadioBtn(rdata.split('<br>')[0].split('  ')[1]);

       if(f) f();
    }
    );
}

function setCamRadioBtn(data){
    console.log('setCamRadioBtn:'+data.length);
    if(data.indexOf('/dev/vchiq')>=0) nvideo=1; else nvideo=0;
    for(i=0;i<data.length;i++){
    if(data[i].indexOf('/dev/video')>=0) nvideo++;
    }
//    message('nvideo='+nvideo);    

console.log('nvideo='+nvideo);

    var parent=document.getElementById('Camera');
for(i=0; i<nvideo; i++){
var labelelement = document.createElement('label'); 
    labelelement.for="camera";
    labelelement.id="searchtitle";
    labelelement.innerHTML=i; 
        var element = document.createElement('input'); 
        element.type = 'radio'; 
        element.id = 'cam'+i; 
        element.name = 'camera'; 
        element.value = i;
        if(i===0) element.checked='checked';
 
        labelelement.appendChild(element);
        parent.appendChild(labelelement);
    }
    return nvideo;
}

function setITPRadioBtn(n){
    nitp=parseInt(n);
console.log('nitp0='+nitp);
nitp=1;
    
    var parentITP=document.getElementById('Planter');
for(i=0; i<nitp; i++){
var labelelement = document.createElement('label'); 
    labelelement.for="planter";
    labelelement.id="searchtitle";
    labelelement.innerHTML=' '+(i+1); 
        var element = document.createElement('input'); 
        element.type = 'radio'; 
        element.id = 'itp'+i; 
        element.name = 'planter'; 
        element.value = i;
        if(i===0) element.checked='checked';
 
        labelelement.appendChild(element);
        parentITP.appendChild(labelelement);
    }
    return nitp;
}

function setLEDRadioBtn(n){
    nitp=parseInt(n);
    nitp=1;
    var parentITP=document.getElementById('led');
for(i=0; i<nitp; i++){
var labelelement = document.createElement('ledb'); 
    labelelement.for="led";
    labelelement.id="searchtitle";
    //labelelement.class="sled-button";
    labelelement.innerHTML=' Control'; 
        var element = document.createElement('input'); 
        element.type = 'checkbox';
        
        element.id = 'led'+i; 
        element.name = 'nled'; 
        if(LEDstate==='ON') element.checked=true;
        else element.checked=false;
 
        labelelement.appendChild(element);
        parentITP.appendChild(labelelement);
    }
    
    return nitp;
}

src="/static/datetimepicker/jquery.datetimepicker.js";

var addnum=0;
var active=[];

function deleteAllElements(){
// delete all Elements
    var activeList=getActiveElements();
    for(i=0;i<activeList.length;i++){
        delElements(activeList[i]);
    }
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
    if( active[i] !== true ){
        emptyNo=i;
        break;
        }
    }
    return emptyNo;
}

function addElements() {
    
    var targetnum=0;
//
//  active[i]==falseの場所に入れる    
//
    var activeList=getActiveElements();
    console.log('addElements activeList=',activeList);

    if(activeList.length > MaxScN-1){
        document.getElementById("Error").innerHTML=targetnum+'これ以上設定できません';
        return;
    }
    
    // 空の番号
    targetnum=getEmptyElement();
    console.log('addElements targetnum=',targetnum);

    addnum=activeList.length;
    
    // 予約
    active[targetnum] = true;
    
    var start_element = document.createElement('div');
    var start_id = 'start'+targetnum;
    start_element.id = start_id;
    start_element.name = 'tags';
    start_element.innerHTML =null;
    start_element.visibility = 'hidden';

    var end_element = document.createElement('div');
    var end_id = 'end'+targetnum;
    end_element.id = end_id;
    end_element.name = 'tags';
    end_element.innerHTML =null;
    end_element.visibility = 'hidden';

    var base_element = document.createElement('tr');
    var base_id = 'base'+targetnum;
    base_element.id = base_id;
    base_element.name = 'tags';
    
    base_element.innerHTML = '<td class="No"><button type="button" name="btnX" onclick="delElements('+targetnum+')">X'+targetnum+'</button></td><td><input type="text" id="'+start_id+'"/><input style="width: 120px;" type="range" min="0" max="59" id="range'+targetnum+'" step="1" value="0" oninput="changeVal('+targetnum+',this.value)" onchange="changeMin('+targetnum+',this.value)"></><input style="width: 15px;" type="text" id="lv'+targetnum+'" value="0" onchange="changeMin('+targetnum+',this.value)" ></></td>';
    base_element.innerHTML += '<td class="Repeat"><input type="text" name="repeat" id="repeat'+targetnum+'"<input style="width: 120px;" type="range" min="0" max="59" id="range'+targetnum+'" step="1" value="0" onchange="changeRepeatMin('+targetnum+',this.value)"></></td>';
    
    base_element.appendChild(start_element);
    base_element.appendChild(end_element);

    // list sort ///
    var options = {
      valueNames: [ 'No' ]
    };
    var userList = new List('settings', options);
    //console.log('userList=',userList);
    userList.sort('No');
    /////

    // jQueryでなければならない
    var stable = $('#tableID');
    stable.append(base_element); 
    /*
    var ppp=document.getElementsByName('btnX');
    for(i=0;i<ppp.length;i++){
        ppp[i].innerHTML='X'+i;
        ppp[i].value='X'+i;
    }
    */
    
//messageConsole('#target: '+targetnum+" addnum="+addnum +'i= '+i);
    $('#'+start_id).datetimepicker({
            value:'07:00',
            datepicker:false,
            format:'H:i',
            //step:30,
            language: 'ja',
            
          onShow:function( ct ){
           this.setOptions({
           // document.getElementById("message").textContent="ABC";
            value:'カメラの撮影日時を選択'
           })
          },
          onSelectTime:function(ct,$i){
          //　設定されるたびにデータ取得する
          console.log('Camera'+i+': '+ct);
          changeRange(i,0);
          changeVal(i,0);
          } 
        });
        
         addnum++;
}

function changeVal(n, v){
var lv=document.getElementById('lv'+n);
    if(lv){
        lv.value=v;
    }
}

function changeRange(n, v){
var lv=document.getElementById('range'+n);
    if(lv){
        lv.value=v;
    }
}

function changeMin(n, v){
    v= v|0;
//console.log('slider value='+v);
     var ids = 'start'+n;
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

function changeRepeatMin(n, v){
    var p=document.getElementById('repeat'+n);
    if(p){
        // repeat minute
        console.log(p.value);
    }
}

function delElements(no) {
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
   // document.getElementById('repeat'+no).remove();
}

function func(cmd){
//console.log('func0 '+cmd);
    var serialNo=cmd.split('<br>')[1];
    if(isFinite(serialNo)===false)
                serialNo='12345678'
    // console.log('func1 '+serialNo);
    var result = 'itplanter-02+'+serialNo+' ';
    
    var seq=document.getElementsByName('sequence');
//console.log('seq.length '+seq.length);
    for(i=0;i<seq.length;i++){
        console.log(seq[i].value+' '+seq[i].checked);
        if(seq[i].checked){
            result += 'Sequence+'+seq[i].value+' ';
        }
    }
    
    // repeat time schedule    
    var rep=document.getElementsByName('repeat');
    console.log('rep.length = '+(rep.length-1));
    var rn=0, ids = '', objs='', startm ='', mmtime='', starttime=0, stoptime=0, rtime0=0, rtime1=0;
    
    for(i=0;i<rep.length-1;i++){
            rtime0=rep[i].value;
    console.log('rtime0 = ',rtime0);
            ids = 'start'+i;
            objs= $('#'+ids).datetimepicker('getDate');
            startm = objs.val();
        if(rtime0 > 0){
            mmtime= startm.replace('+','').split(':');
            starttime=parseInt(mmtime[0])*60+parseInt(mmtime[1]);
            console.log('starttime = ',starttime);
            if( i+1 <rep.length-1){
            rtime1=rep[i+1].value;
            ids = 'start'+(i+1);
            objs= $('#'+ids).datetimepicker('getDate');
            startm = objs.val();      
            mmtime= startm.replace('+','').split(':');
            stoptime=parseInt(mmtime[0])*60+parseInt(mmtime[1]);
            rn += (parseInt((stoptime-starttime)/(rtime0-rtime1))-1);
            console.log('starttime = ',starttime, 'stoptime = ',stoptime,' rn=',rn,' rtime=',(rtime0-rtime1));
            }
        }
    }
    console.log('rn = ',rn);
    console.log('addnum = ',addnum);
    
    result += 'scheduleNo+'+(addnum+rn)+' ';
//message(res);
    for(var i=0;i<addnum;i++){
        ids = 'start'+i;
        objs= $('#'+ids).datetimepicker('getDate');
        startm = objs.val();
        result += '['+i+']+'+startm+' ';
    }
    

    for(i=0;i<rep.length-1;i++){
        rtime=rep[i].value;
        console.log('rtime = '+rtime);
        if(rtime > 0){
            ids = 'start'+i;
            objs= $('#'+ids).datetimepicker('getDate');
            startm = objs.val();
            mmtime= startm.replace('+','').split(':');
            mtime=parseInt(mmtime[0])*60+parseInt(mmtime[1]);
            
            for(var t=1;t<parseInt((stoptime-starttime)/rtime);t++){
                var ntime = mtime+rtime*t;
                var h=parseInt(ntime/60);
                if( h >= stoptime ) break;
                var m=parseInt(ntime % 60);
                if( h < 10 ) h = '0'+h;
                if( m < 10 ) m = '0'+m;
                var nextTime='['+(addnum+t-1)+']+'+h+':'+m+' ';
                console.log('startm='+startm+' t='+t+' rtime='+rtime+' mtime='+mtime+' ntime='+ntime+' nextTime='+nextTime);
                result += nextTime;
                }
        }
    }
    
    var led=document.getElementsByName('nled');
//console.log('seq.length '+seq.length);
    for(i=0;i<led.length;i++){
        console.log(led[i].value+' '+led[i].checked);
        if(led[i].checked){
            result += 'LED+'+'ON ';
        } else result += 'LED+'+'OFF ';
    }
    // 
    console.log("|",result,"|");
    saveCamSchedule(result);
    
    setTimeout(load_itplanterSettings(),10);
}

function writeElements() {
    console.log('writeElements');
    saveCamSchedule();
    sendcomCommand(['-e','Z'],func);
}

var scheduleNo =0;
var LEDstate ='ON';

function loadDataFile( req, f ) {
    $.getJSON( 
    "/app/cameraschedule/command",//url
    {"command":"cat", "arg":[req]},//data
    function(data) {
    //dataがサーバから受け取るjson値
    //var rdata='';
    $.each(data,
    function(key, val) {
    rdata = val;
    }
    );
       console.log(rdata);
// parse and set data
// iplanter-02+1207000114 Sequence+everyDay scheduleNo+3 [0]+07:00 [1]+2015/02/14+19:30 [2]+2015/02/14+22:00
// itplanter-02 12345678 Sequence everyDay scheduleNo 2 [0] 07:00 [1] 18:00<br>
        rdata=rdata.replace('<br>','');
        var cdata=rdata.split(' ');
        var datas = { key1: 'value1' , key2: 'value2' };
        var datavalue = [];
        var ccdata=[2];
        console.log("cdata",cdata);
        for(var i=0;i<cdata.length;i++){// var i=0; であること。
      //  console.log("cdata[i].indexOf('scheduleNo')=",cdata[i].indexOf("scheduleNo"));
        // scheduleNo
        if(cdata[i].indexOf("scheduleNo") >= 0){
          if(cdata[i].indexOf("+") >= 0){
              ccdata=cdata[i].split('+');
          } else {
              ccdata[0]=cdata[i];
              ccdata[1]=cdata[i+1];
          }
            scheduleNo=parseInt(ccdata[1]);
            console.log("scheduleNo",scheduleNo);
/*
            datas.key1='scheduleNo';
            datas.key2=ccdata[1];
            console.log("datas.key1",datas.key1);
            console.log("datas.key2",datas.key2);
            console.log("datas['scheduleNo']",datas['scheduleNo']);
*/
        }
    ////
        if(cdata[i].indexOf("LED") >= 0){
            if(cdata[i].indexOf("+") >= 0){
              ccdata=cdata[i].split('+');
            } else {
              ccdata[0]=cdata[i];
              ccdata[1]=cdata[i+1];
            }
            
            datas.key1='LED'
            datas.key2=ccdata[1];
            LEDstate=ccdata[1];
            console.log("LEDstate",LEDstate);
            /*
            console.log("datas.key1",datas.key1);
            console.log("datas.key2",datas.key2);
            */
        }
    ////
        if(cdata[i].indexOf('[') >= 0 && cdata[i].indexOf(']') >= 0){ 
        cdata[i]=cdata[i].replace('[','').replace(']','');
          if(cdata[i].indexOf("+") >= 0){
              ccdata=cdata[i].split('+');
          } else {
              ccdata[0]=cdata[i];
              ccdata[1]=cdata[i+1];
          }
        datavalue[ccdata[0]]=ccdata[1];
            }
        }
        
        console.log('scheduleNo '+scheduleNo);
        console.log('LEDstate '+LEDstate);
        
//        console.log('adnum1='+addnum);
        deleteAllElements();//   delete all elements
//      add Elements
         for(i=0;i<scheduleNo;i++){
            //console.log('addElements='+i);
            addElements();
            var ids = 'start'+i;
            $('#'+ids).datetimepicker({value: datavalue[i], format:'H:i'})
            }
            if(f) f();
        });
}

function load_itplanterSettings(f){
    // config/saveCamSchedule.txt' を読み込んで表示する
        loadDataFile('./config/saveCamSchedule.txt',f);
    //
  }

function messageConsole(mes){
if ($(document))
  {
      document.getElementById("messageConsole").innerHTML=mes;
  }
}

function message2(mes){
if ($(document))
  {
      document.getElementById("message").innerHTML=mes;
  }
}

    var start=[];
    var end=[];
    var ms='';

function btnDisablede(){
        document.getElementById("addBtn").disabled=true;
        document.getElementById("setBtn").disabled=true;
}

function btnEnablede(){
        document.getElementById("addBtn").disabled=false;
        document.getElementById("setBtn").disabled=false;
}

$(document).ready( function() {
    active[0] = true;
    for(var i=1;i<MaxScN;i++) active[i] = false;

  //btnDisablede();
    checkVideo(['/dev/vchiq','/dev/video*'],checkITP(load_itplanterSettings()));

});