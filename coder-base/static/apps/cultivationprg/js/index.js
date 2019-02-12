var nitp=1;

function resultmessage(mes){
if ($(document))
  {
      document.getElementById("result").innerHTML=mes;
  }
}

function message(mes){
if ($(document))
  {
      document.getElementById("message").innerHTML=mes;
  }
}

function messageConsole(mes){
if ($(document))
  {
      document.getElementById("messageConsole").innerHTML=mes;
  }
}

function wait( r ){
    return r;
}

function setITPRadioBtn(rdata){
    if(!rdata) return;
    var tmp=rdata.replace('<br>','');
//console.log('nitp00='+tmp);

    var ndevices=(tmp.split('  ')[0]);
        if( ndevices !== 'ndevices') return; 
        
    nitp=(tmp.split('  ')[1]);

console.log('setITPRadioBtn nitp0='+nitp);

    var parentITP=document.getElementById('Planter');
for(var i=0; i<nitp; i++){
var labelelement = document.createElement('label'); 
    labelelement.for="planter";
    labelelement.id="searchtitle";
    labelelement.innerHTML=' '+(i+1); 
        var element = document.createElement('input'); 
        element.type = 'checkbox'; 
        element.id = 'itp'+i; 
        element.name = 'planter'; 
        element.value = i;
        if(i===0) element.checked='checked';
 
        labelelement.appendChild(element);
        parentITP.appendChild(labelelement);
    }
    return nitp;
}

function selectFirstPlanter(){
    for(var i=1; i<nitp; i++){
     var radio=document.getElementById('itp'+i);
    radio.checked=false;
    }
}

function selectAllPlanter(){
    for(var i=0; i<nitp; i++){
     var radio=document.getElementById('itp'+i);
    radio.checked='checked';
    }
}

function checkITP(f) {
console.log('checkITP: |');

    $.getJSON( 
    "/app/cultivationprg/command2",//url
    {"command":"sendcom", "arg":['1','-e','D']},//data
    function(data) {
    //dataがサーバから受け取るjson値

    $.each(data, 
    function(key, val) {
    rdata = val;
          console.log('checkITP: |'+rdata+'|');
    });
//       resultmessage('checkITP: |'+rdata+'|');
    if(f && typeof f === 'function') f();
       return setITPRadioBtn(rdata);
    });
    if(f && typeof f === 'function') f();
    return rdata;
}

function filenameDate(filename){
//  change file.csv  -->  file[yyyymmddHHMM]
 require("date-utils");
 var now = new Date();
 
 var month=now.getMonth()+1;
 if(month <= 9) month='0'+month;
 var day=now.getDate();
 if(day <= 9) day='0'+day;
 var hour=now.getHours();
 if(hour <= 9) hour='0'+hour;
 var min=now.getMinutes();
 if(min <= 9) min='0'+min;

// var timedate =  (now.getYear()+1900)+''+month +''+day+''+hour+''+min;
 var timedate =  month +''+day+''+hour+''+min;

 var f=filename.split('.');
 return f[0]+timedate+'.'+f[1];
}

function commandSendcom( req, f ) {
console.log("commandSendcom:nitp="+nitp);
    var z=0;
  (function(){ 
     var ii=z;
console.log("commandSendcom["+ii+"]:"+req);
    
     var dfd1=$.getJSON(
    "/app/cultivationprg/command2",//url
    { "command":"sendcom", "arg":[(ii+1),'-e',req] });//data
     $.when(dfd1).done(function(data) {
   //処理
      var sdata='';
           $.each(data,
           function(key, val) {
           sdata = val;
           });
console.log('!!commandSendcom:|'+sdata+'|');
       if(f && sdata)  f(sdata);
       return sdata;
            });
      })(z); // 関数定義ここまで。最後の()が重要。
}

function goSave(){
//Enterキー
var req=document.getElementById("save");
    req.value='';
}

function goInput(){
//Enterキー
var req=document.getElementById("input");
    req.value='';
}

function goDuty(num){
//Enterキー
var req=document.getElementById("endDuty"+num).value;
message(req);
if(window.event.keyCode==13){
    message(req);
    readElementsDuty()
    }
}

function goPumpWorkingTime(){
//Enterキー
var req=document.getElementById("PumpWorkTime").value;
message(req);
if(window.event.keyCode==13){
    message(req);
    readElementsPump();
    }
}

var rdata='';

function ITPsetting( req,f ) {
    // アイティプランターの設定を一気に読み込む  2018/08/22
  console.log("ITPsetting req="+req);
  var dfd1=$.getJSON(
    "/app/cultivationprg/command2",//url
    { "command":"ITPsetting", "arg":req });//data
     $.when(dfd1).done(function(data) {
   //処理
      var sdata='';
           $.each(data,
           function(key, val) {
           sdata = val.split('<br>');
           });
           console.log('ITPsetting result='+sdata);
       if(f && typeof f === 'function') f(sdata);
    });
}

function setdata(data){
    if(!data) return;
    console.log('setdata ',data);
    console.log('setdata.length=',data.length);
    var dataLamp='', dataPump='', dataDuty='';
    
    for(i=0;i<data.length;i++){
        if(data[i].indexOf('pumpWorkingTime')>=0){
            pumpWorkTime=parseInt(data[i].replace('pumpWorkingTime=',''));
            document.getElementById("PumpWorkTime").value = pumpWorkTime;
        }
        if(data[i].indexOf('PumpStartTime')>=0){
            dataPump=(data[i].replace(/\[/g,'').replace(/\]/g,'').replace(/\{/g,'').replace(/\}/g,'').replace(/'/g,''));
        }
        if(data[i].indexOf('LightContTime')>=0){
            dataLamp=(data[i].replace(/\[/g,'').replace(/\]/g,'').replace(/\{/g,'').replace(/\}/g,'').replace(/'/g,''));
        }
        if(data[i].indexOf('PWM')>=0){
            dataDuty=(data[i].replace(/\[/g,'').replace(/\]/g,'').replace(/\{/g,'').replace(/\}/g,'').replace(/'/g,''));
        }
    }
    
    if(dataPump){
        console.log('PumpWorkTime=',pumpWorkTime);
        dataPump=(dataPump.replace(/\[/g,'').replace(/\]/g,'').replace(/\{/g,'').replace(/\}/g,'').replace(/'/g,'').split(','));

        console.log('setdata  dataPump='+ dataPump );

        if(dataPump[dataPump.length-1].length<=1) dataPump.pop();
// pump
        for( i=0;i<6;i++)  delElementsPump(i);

        for( i=0;i<dataPump.length;i++){
            var obj=dataPump[i];
            v=String(obj).replace('PumpStartTime','').replace(':','');
            startPump[i]= parseInt(v);
            
            addElementsPump();
           
                starthPump=parseInt(parseInt(startPump[i]) / 60);
                startmPump=parseInt(parseInt(startPump[i]) % 60);
                console.log('setdata Pump n='+i+' starthPump='+starthPump+' startmPump='+startmPump+' i='+i);
                $('#startPump'+i).datetimepicker({value: starthPump+':'+startmPump, format:'H:i'});    
         
        }// next i
        if(pumpWorkTime){
    // pumpWorkTime
        var req=document.getElementById("PumpWorkTime");
        req.value=pumpWorkTime;
        //console.log('pumpWorkingTime=',pumpWorkingTime);
        }
    }
        
// Lamp
    if( dataLamp ){
        console.log('setdata lightdata   1  dataLamp=',dataLamp);
        dataLamp=(dataLamp.replace(/\[/g,'').replace(/\]/g,'').replace(/\{/g,'').replace(/\}/g,'').replace(/'/g,'').split(','));
        for(i=0;i<6;i++)　delElementsLamp(i);
        console.log('setdata lightdata   2  dataLamp=',dataLamp);
    
        addnumLamp=parseInt(dataLamp.length/2);
        //console.log('load_itplanterSettingsLamp  addnumLamp='+addnumLamp);    
        for( i=0;i<dataLamp.length;i+=2){
        //console.log('setdata lightdata  data[0][',i,']=',data[0][i]);
        obj=dataLamp[i];
        console.log('setdata obj1=',String(obj).replace('LightContTime','').replace(':',''));
        v=String(obj).replace('LightContTime','').replace(':','');
        cont[i/2]= parseInt(v);
        console.log('setdata cont 1='+cont[i/2]);
        
        obj=dataLamp[i+1];
        console.log('setdata obj2=',String(obj).replace('LightStartTime','').replace(':',''));
        v=String(obj).replace('LightStartTime','').replace(':','');
        start[i/2]= parseInt(v);
        console.log('setdata start 1='+start[i/2]);
        
        cont[i/2] += start[i/2];
    
        console.log('setdata Lamp start=',start[i/2],' cont=',cont[i/2]);
        addElementsLamp(i/2);
          }//next i
    }
    
// Duty
if( dataDuty ){
    dataDuty=(dataDuty.replace(/\[/g,'').replace(/\]/g,'').replace(/\{/g,'').replace(/\}/g,'').replace(/'/g,'').split(','));
    //      console.log('data[1]=', data[1]);
    addnumDuty=dataDuty.length;
   for(i=0;i<6;i++) delElementsDuty(i);
   
   targetnumDuty=dataDuty.length/2;
//          console.log('-------[-1] load_itplanterSettingsDuty fnDuty='+fnDuty);
       for( i=0;i<dataDuty.length;i+=2){
        obj=dataDuty[i];
        console.log('PWM obj=',obj);
        v=String(obj).replace('PWM','').replace(':','');
        endDuty[i/2]= parseInt(v);
        obj=dataDuty[i+1];
        
        v=String(obj).replace('PTime','').replace(':','');
        startDuty[i/2]= parseInt(v);
        
        console.log('PWM start=',startDuty[i/2],' PWM=',endDuty[i/2]);
           addElementsDuty(i/2);
        }// next i
    }
}

$(document).ready( function() {
        $("#acMenu dtLight").on("click", function() {
            $(this).next().slideToggle();
        });
        $("#acMenu dtDuty").on("click", function() {
            $(this).next().slideToggle();
        });
        $("#acMenu dtPump").on("click", function() {
            $(this).next().slideToggle();
        });

    checkITP(lsDataFile(setSelectFile()));
    
    document.getElementById('input').value= 'Click File';
    ITPsetting(['-No','1','-r'],setdata)

    cultivationProgramLoad();
/*
jQuery(function() {
    $('#language-swicher').toggles({
        text:{on:'日本語',off:'English'},
    });
    $('#language-swicher').on('toggle', function (e, active) {
        if (active) {
            showLangage('jp');  // 日本語を表示 詳細後述
        } else {
            showLangage('en');  // 英語を表示
        }
    });
    showLangage('jp');  // デフォルトで日本語を表示
});
*/    
    showLangage('jp');

});

var lang='en';// 英語表示ならjpになり、日本語表示ならenになる。表示と逆なので注意。
var langDisp={jp:'English',en:'日本語'};
// 言語切り替え
function showLangage() {
    if( lang == 'jp' ) lang = 'en'; else lang = 'jp';
    var tb=document.getElementById('change_lang');
    if(tb) tb.innerHTML=langDisp[lang];
    
    var langSet = ["jp", "en"];     // 切り替え対象の locale リスト
    for (var i = 0, len = langSet.length; i < len; i++) {
        if (lang === langSet[i]) {
            $('.' + langSet[i]).show();
        } else {
            $('.' + langSet[i]).hide();
        }
    }
    setLang(lang);  // セッション保持：後述
}

// 言語設定をセッションに保存する
function setLang(lang) {
    $.post(
        'session_set',
        {
            'lang': lang
        },
        function(data){
            // 特に何もしない
        }
    );
}

/////// XML ////////
var XMLlist='';
 
function listXMLfiles(){
 if(XMLlist){
 XMLlist=rdata.split('<br>');
 if(XMLlist[0].indexOf('.xml')<0) return;
    
 var ls=document.getElementById("list");
 var flist='<table>';
 for(var i=0;i<XMLlist.length-1;i+=2){
     flist += '<tr><td>['+i+']</td>'+'<td>'+XMLlist[i]+'<td><td>['+(i+1)+']</td>'+'<td>'+XMLlist[i+1]+'<td><tr>';
     }
     flist += '</table>';
     ls.innerHTML=flist;     
    }
}

function XMLaddElement(rdata) {
    document.getElementById("hide").innerHTML=rdata;
    document.getElementById("hide").visibility='hidden';
}

function cultivationProgramLoad(){
    var inp=document.getElementById("input");
    var input=inp.value;
    console.log('cultivationProgramLoad  xml/'+input);
    loadDataFile('./xml/'+input);
    setAllData();
}

var lampStartTime=[];
var lampEndTime=[];
var lampContTime=[];
var dutyStartTime=[];
var dutyDuty=[];    
var pumpStartTime=[];
var SerialNo = 0;
var mejarVersion = 0;
var minerVersion = 0;
var tempWarn = 0;
var waterWarn = 0;
var illumWarn = 0;
var pumpWrokTime = 0;
var Name = '';


function cultivationProgramRemove(){
    var fn=document.getElementById('save').value;
    // 「OK」時の処理開始 ＋ 確認ダイアログの表示
    var msg='本当に'+fn+'を削除しますか？';
    if(window.confirm(msg)){
        // save datas
    if(fn.indexOf('./xml/')<0) fn = './xml/'+fn;
    var dfd1=$.getJSON(
    "/app/cultivationprg/command",//url
    {"command":"rmXML", "arg":fn});//data
     $.when(dfd1).done(function(data) {
   //処理
      var sdata='';
           $.each(data,
           function(key, val) {
           sdata = val;
           });
//  何故か、空白が＋になって返ってくる
        lsDataFile();
    document.getElementById('comment').value='';
    document.getElementById('name').value='';
    var p=document.getElementById('message');
    if(p) p.innerHTML='remove '+sdata;
console.log('cultivationProgramRemove '+sdata);
     });
    }
}

function setSelectFile(f){
// リストが更新されたので、ファイルを選択し直す
//            .style.backgroundColor = "#22ff22";  
     var ls=document.getElementsByName("tag");
     var fn=document.getElementById("input");
    for(var i=0;i<ls.length;i++){
        if(ls[i].innerHTML===fn.value){
            ls[i].style.backgroundColor = "#22ff22"; 
        }
    }
    if(f && typeof f === 'function') f();
}

function calcContTime(start, end){
    // start    12:30
    // end      14:00
    // cont     01:30
    var sstart=start;
    var send=end;
    var tc=0;
    if(start && end ){
    var shm=sstart.split(':');
    var ehm=send.split(':');
    var ts=parseInt(shm[0])*60+parseInt(shm[1]);
    var te=parseInt(ehm[0])*60+parseInt(ehm[1]);
    tc=te-ts;
    console.log('calcContTime ts '+ts+' te '+te+' tc='+tc);
    }
    // start 0:0 end 0:0
    contc=tc;
    if( ts === 0 && te === 0 ) contc = 60*24; // all days
    console.log('calcContTime start '+start+' end '+end+' cont '+contc);
    return contc;
}

function calcEndTime(start, cont){
    // start    12:30
    // cont     01:30
    // end      14:00
    if(cont.indexOf(':')<=0){
    console.log('calcEndTime  cont '+cont);
        cont = String(parseInt((cont/60)))+':'+String(parseInt((cont % 60)));
    }
    console.log('calcEndTime start [0] '+start+' cont '+cont);
    
    var sstart=start+'';
    var scont=cont+'';

    var shm=sstart.split(':');
    var chm=scont.split(':');

    var ts=parseInt(shm[0])*60+parseInt(shm[1]);
    var tc=parseInt(chm[0])*60+parseInt(chm[1]);
    console.log('calcEndTime ts '+ts+' tc '+tc);
    var te=ts+tc;
    var ehm=[];
    ehm[0]=parseInt((te/ 60));
    if(ehm[0]>=24) ehm[0]=ehm[0]-24;
    if(ehm[0]<=9 ) ehm[0]='0'+ehm[0];
    ehm[1]=te % 60;
    if(ehm[1]<=9) ehm[1]='0'+ehm[1];
    var end=ehm[0]+':'+ehm[1];
    
    if( cont === 1440 ){
        end='0:0';
    }
    console.log('calcEndTime start [1] '+start+' cont '+cont+' end '+end);
    return end;
}

function cultivationProgramSave(f){
 var k=0, j=0, i=0;
 console.log('------cultivationProgramSave-----------');
//p//Plant//Name
    var nodesSnapshot3 = document.evaluate('//p//Cultivation//Name',    document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null );
    var nodesSnapshot4 = document.evaluate('//p//Cultivation//Comment', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null );
    var name0=[];
    var comment0=[];
    var array0=[];
    var str0='';
    
    for (  i=0 ; i < nodesSnapshot3.snapshotLength; i++ ) name0[i]=nodesSnapshot3.snapshotItem(i).textContent;
    for (  i=0 ; i < nodesSnapshot4.snapshotLength; i++ ) comment0[i]=nodesSnapshot4.snapshotItem(i).textContent;
    
    console.log('cultivationProgramSave ---comment0.length---'+comment0.length);
    for( i=0;i<1/*comment0.length*/;i++){// 4?  2!!
    var a=document.getElementById('name');
    if(a){
         console.log('cultivationProgramSave name='+a.value);
        nodesSnapshot3.snapshotItem(i).textContent = a.value;
    }
    var b=document.getElementById('comment');
    if(b){
         console.log('cultivationProgramSave comment='+b.value);
         nodesSnapshot4.snapshotItem(i).textContent = b.value;
    }
    console.log('cultivationProgramSave ---comment0---'+nodesSnapshot4.snapshotItem(i).textContent);
    }

    var nodesSnapshot1 = document.evaluate('//p//RecordingDefinition//Name',    document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null );
    var nodesSnapshot2 = document.evaluate('//p//RecordingDefinition//Comment', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null );
//
    readElementsAll();
//
    var name=[];
    var comment=[];
    var array=[];
    ////p//RecordingDefinition//Name
    var length=nodesSnapshot1.snapshotLength;
    if(length < nodesSnapshot2.snapshotLength ) length=nodesSnapshot2.snapshotLength;
    for ( i=0 ; i < length; i++ )
    {
        var e=nodesSnapshot1.snapshotItem(i).textContent+'';
        if( e === 'category' ) continue;// dust
    ////p//RecordingDefinition//Comment
    console.log('cultivationProgramSave e=',e);
        switch(e){
         case 'pumpWrokTime':
               nodesSnapshot2.snapshotItem(j).textContent = pumpWrokTime;
               break;
         case 'dutySchedule':
             // Duty * StartTime *:*
console.log('cultivationProgramSave dutyScheduleBefore:'+nodesSnapshot2.snapshotItem(j).textContent);
                nodesSnapshot2.snapshotItem(j).textContent='';
                for( k=0;k<dutyStartTime.length;k++){
                   nodesSnapshot2.snapshotItem(j).textContent += ' Duty '+dutyDuty[k]+' StartTime '+dutyStartTime[k]+' ';
                }
console.log('cultivationProgramSave dutyScheduleAfter:'+nodesSnapshot2.snapshotItem(j).textContent);
                break;
         case 'lampSchedule':
             // StartTime *:* EndTime *:*
console.log('cultivationProgramSave lampScheduleBefore:'+nodesSnapshot2.snapshotItem(j).textContent);
                nodesSnapshot2.snapshotItem(j).textContent='';
                for( k=0;k<lampStartTime.length;k++){
// BUG
// EndTimeではなくContinueTimeだった。継続時間を入れるのだから、lanmpEndTime[i]-lampStartTime[i]に変更すること
// 時間文字列の引き算結果を文字列に入れる
// ContinueTimeが正しい
// lampEndTime -> lampContTime に変更
//
//                nodesSnapshot2.snapshotItem(j).textContent += 'StartTime '+ lampStartTime[k]+' EndTime '+lampEndTime[k]+' ';
                lampContTime[k] = calcContTime(lampStartTime[k],lampEndTime[k]);
                nodesSnapshot2.snapshotItem(j).textContent += ' StartTime '+ lampStartTime[k]+' ContinueTime '+lampContTime[k]+' ';
                }
console.log('cultivationProgramSave lampScheduleAfter: '+nodesSnapshot2.snapshotItem(j).textContent);
                break;
         case 'pumpSchedule':
console.log('cultivationProgramSave pumpScheduleBefore: '+nodesSnapshot2.snapshotItem(j).textContent);
                nodesSnapshot2.snapshotItem(j).textContent='';
console.log('cultivationProgramSave pumpStartTime.length: '+pumpStartTime.length);
                for( k=0;k<pumpStartTime.length;k++){
                nodesSnapshot2.snapshotItem(j).textContent += ' StartTime '+pumpStartTime[k];
                }
console.log('cultivationProgramSave pumpScheduleAfter: '+nodesSnapshot2.snapshotItem(j).textContent);
                break;
            }// end switch
                j++;
      }// next i
      
        var    datas = document.getElementById("hide").innerHTML;
 console.log('cultivationProgramSave datas=',datas);
        
    // save data
    var fn=document.getElementById('save').value;
    if(fn.indexOf('.xml')<0) fn = f+'.xml';// .xml拡張子を付ける
    if(fn.indexOf('./xml/')<0) fn = './xml/'+fn;
    
    var dfd1=$.getJSON( 
    "/app/cultivationprg/command2",//url
    {"command":"saveXML", "arg":[fn,datas]});//data
     $.when(dfd1).done(function(data) {
   //処理
      var sdata='';
           $.each(data,
           function(key, val) {
           sdata = val;
           });
//  何故か、空白が＋になって返ってくる
//           sdata=sdata.split('<br>').join('\n');
//           sdata=sdata.split('+').join(' ');
            var ot=document.getElementById('save');
            var it=document.getElementById('input');
            it.value=ot.value;
            
           lsDataFile(setSelectFile);
            
            message('Save OK');
     });
   // dutySchedule
   /*  残り
    SerialNo = array['SerialNo'];
    mejarVersion = array['mejarVersion'];
    minerVersion = array['minerVersion'];
    tempWarn = array['tempWarn'];
    waterWarn = array['waterWarn'];
    illumWarn = array['illumWarn'];
    */
    if(f && typeof f === 'function') f();
    
// リスト更新    
    
}

function splitDataKey(d){
console.log('splitDataKey');    
console.log('splitDataKey d='+d);
 var s='';
 s = d.split(' '); // itpManager's file
if(s) console.log('splitDataKey [1]s.length='+s.length);  
if(s.length===1) s=d.split('+'); // this app file
if(s) console.log('splitDataKey [2]s.length='+s.length);  
    if(s){
     for(i=0;i<s.length;i++){
//console.log('s[i]='+s[i]);  
         var c= -1;
         if( c < 0 ) c=s[i].indexOf('Continue');
         if( c < 0 ) c=s[i].indexOf('Duty');
         if( c < 0 ) c=s[i].indexOf('Start');
         if( c < 0 ) c=s[i].indexOf('End');
         if(c > 0){
//console.log('c='+c);
             var t=s[i].substr(0,c);
//console.log('t='+t);
             var u=s[i].replace(t,'');
//console.log('u='+u);
            s[i]=t;
            s.splice(i+1, 0, u); //i+1番目にuを挿入
            i++;
            }
        }
    }
    var v='';
    for(i=0;i<s.length;i++){
             v += s[i]+' ';
    }
//console.log('v='+v);
    return v;
}

// save Cultivation Program

function cultivationProgramRead(f){
//
 var j=0, i=0;
 console.log('------cultivationProgramRead-----------');

    var nodesSnapshot3 = document.evaluate('//p//Plant//Name',    document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null );
    var nodesSnapshot4 = document.evaluate('//p//Plant//Comment', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null );
    var name0=[];
    var comment0=[];
    var array0=[];
    var str0='';
    for ( i=0 ; i < nodesSnapshot3.snapshotLength; i++ ) name0[i]=nodesSnapshot3.snapshotItem(i).textContent;
    for ( i=0 ; i < nodesSnapshot4.snapshotLength; i++ ) comment0[i]=nodesSnapshot4.snapshotItem(i).textContent;
    
    var comstr='';
    for( i=0;i<comment0.length;i++){
    array0[name0[i]]=comment0[i];
//console.log('---cultivationProgramRead comment0---['+i+'] name='+name0[i]+' comment='+comment0[i]);
    } 
    document.getElementById('comment').value=comment0[0];
    document.getElementById('name').value=name0[0];

    var nodesSnapshot1 = document.evaluate('//p//RecordingDefinition//Name',    document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null );
    var nodesSnapshot2 = document.evaluate('//p//RecordingDefinition//Comment', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null );

    var name=[];
    var comment=[];
    var array=[[]];
    var str='';
    
    for (i=0 ; i < nodesSnapshot1.snapshotLength; i++ )
    {
        var e=nodesSnapshot1.snapshotItem(i).textContent+'';
        if( e == 'category' ) continue;// dust
                  name[j++]=nodesSnapshot1.snapshotItem(i).textContent;
    }
    for (i=0 ; i < nodesSnapshot2.snapshotLength; i++ )
    {
      comment[i]=nodesSnapshot2.snapshotItem(i).textContent;
    }
    
// 空白がなくなっているので分離 //  保存したものは空白が+になっている
var s='';
    for(i=0;i<name.length;i++){
    if(name[i]==='pumpSchedule' || name[i]==='dutySchedule' || name[i]==='lampSchedule'){
        // split vat and key
        comment[i]=splitDataKey(comment[i]);
        }
        array[name[i]]=comment[i];
//console.log('cultivationProgramRead ['+i+'] name = '+name[i]+' : comment ='+comment[i]);
    } 
  
// dutySchedule
    SerialNo = array['SerialNo'];
    mejarVersion = array['mejarVersion'];
    minerVersion = array['minerVersion'];
    tempWarn = array['tempWarn'];
    waterWarn = array['waterWarn'];
    illumWarn = array['illumWarn'];
    pumpWrokTime = array['pumpWrokTime'];
    
    s += 'SerialNo: '+SerialNo+'<br>';
    s += 'mejarVersion: '+mejarVersion+'<br>';
    s += 'minerVersion: '+minerVersion+'<br>';
    s += 'tempWarn: '+tempWarn+'<br>';
    s += 'waterWarn: '+waterWarn+'<br>';
    s += 'illumWarn: '+illumWarn+'<br>';
    s += 'pumpWrokTime: '+pumpWrokTime+'<br>';
    
    var dutysc=array['dutySchedule'];
    if(dutysc){
    dutysc=dutysc.split(' ');

 console.log('cultivationProgramRead dutysc '+dutysc);
    dutyDuty=[]; dutyStartTime=[];
    for(i=0, j=0;i<dutysc.length;i++){
        if(dutysc[i]==='') continue;
        console.log('cultivationProgramRead dutysc['+i+'] |'+dutysc[i]+'|');
        if( dutysc[i] === 'Duty'){
        dutyDuty[j]=dutysc[i+1];
        console.log('cultivationProgramRead DD'+j+' '+dutyDuty[j]);
        }
        console.log('cultivationProgramRead duty00 |'+dutysc[i]+'|');
        if( dutysc[i] === 'StartTime'){
        dutyStartTime[j]=dutysc[i+1];
        console.log('cultivationProgramRead DS'+j+' '+dutyStartTime[j]);
        j++;
            }
        }
    }

//console.log('cultivationProgramRead lampsc '+lampsc);
   // lampSchedule
    var lampsc=array['lampSchedule'];
    if(lampsc){
console.log('cultivationProgramRead lampsc '+lampsc);
    lampsc=lampsc.split(' ');
    lampEndTime=[]; lampStartTime=[];
    for(i=0, j=0;i<lampsc.length;i++){
    if(lampsc[i]==='') continue;
    str=lampsc[i];
    if( str==='StartTime'){
console.log('cultivationProgramRead lampsc StartTime');
        lampStartTime[j]=lampsc[i+1];
console.log('cultivationProgramRead LS'+j+' '+lampStartTime[j]);
        }
    if(str==='ContinueTime' || str==='EndTime'){ // EndTime tagはなくすこと
console.log('cultivationProgramRead lampsc EndTime');
// BUG
// EndTimeではなくContinueTimeだった。継続時間を入れるのだから、lanmpEndTime[ij]=lanmpEndTime[j]-lampStartTime[j]に変更すること
// ContinueTimeが正しい。
//
        lampEndTime[j]=calcEndTime(lampStartTime[j], lampsc[i+1]);
        if(lampEndTime[j].split(':')[1]==='0') lampEndTime[j]+='0';
console.log('cultivationProgramRead lampsc LE['+j+'] '+lampEndTime[j]);
        j++;
            }  
        }
console.log('cultivationProgramRead lampsc lampStartTime.length '+lampStartTime.length);
    }

    var pumpsc=array['pumpSchedule'];
    if(pumpsc){
// S,t,a,r,t,.....
console.log('cultivationProgramRead pumpsc0 '+pumpsc);
    pumpsc=pumpsc.split(' ');

console.log('cultivationProgramRead pumpsc '+pumpsc);
    pumpStartTime=[];
    
    for(i=0,j=0;i<pumpsc.length;i++){
        if(pumpsc[i]==='') continue;
        str=pumpsc[i];
console.log('cultivationProgramRead str ', str);
    if( str==='StartTime'){
        pumpStartTime[j]=pumpsc[i+1];
console.log('cultivationProgramRead PS'+j+' '+pumpStartTime[j]);
        j++;
            }
        }    
        console.log('cultivationProgramRead pumpStartTime.length '+pumpStartTime.length);
        console.log('cultivationProgramRead pumpStartTime '+pumpStartTime);
    }
    
     if(f && typeof f === 'function') f();
}

function loadDataFile( req, f ) {
    $.getJSON( 
    "/app/cultivationprg/command",//url
    {"command":"cat", "arg":req},//data
    function(data) {
    //dataがサーバから受け取るjson値
    //var rdata='';
    $.each(data,
    function(key, val) {
    rdata = val;
    });
    //
//       resultmessage(rdata);
        XMLaddElement(rdata) ;
console.log('loadDataFile=',rdata);
        cultivationProgramRead();
        if(f && typeof f === 'function') f();
    });
}

function lsDataFile( f ) {
    $.getJSON( 
    "/app/cultivationprg/command",//url
    {"command":"ls", "args":['./xml']},//data
    function(data) {
    //dataがサーバから受け取るjson値
    //var rdata='';
    $.each(data,
    function(key, val) {
    rdata = val;
    }
    );
    
     var XMLlist=rdata.split('<br>');
     if(XMLlist[0].indexOf('.xml')<0) return;
        
     var ls=document.getElementById("list");
     var flist='<table>';
     for(var i=0;i<XMLlist.length-1;i+=2){
         flist += '<tr><td  >['+i+']</td>'+'<td name="tag">'+XMLlist[i]+'<td><td>['+(i+1)+']</td>'+'<td name="tag">'+XMLlist[i+1]+'<td><tr>';
     }
    flist += '</table>';
    ls.innerHTML=flist;
    addListners();
    //
    document.getElementById('input').value= XMLlist[0];
    cultivationProgramLoad();

  //  console.log(rdata);
    if(f && typeof f === 'function') f();// call back function
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
        if(it) it.value=filename;

        var ot=document.getElementById('output');
        var st=document.getElementById('save');

//        removefilename=filenameDate(filename);
        removefilename=filename;

        console.log(filename+' |'+removefilename+'|');
        if(ot) ot.value=removefilename;
        if(st) st.value=removefilename;

        if(filename.indexOf('./xml')<0 ) filename = './xml/'+filename;
        if(removefilename.indexOf('./xml')<0 ) removefilename = './xml/'+filename;
        loadDataFile( filename );
	}

/*
    // ------------------------------------------------------------
	// マウスのボタンを押すと実行される関数
	// ------------------------------------------------------------
	function MouseDownFunc(e){
		element.style.backgroundColor = "#ffffff";
		element_result.innerHTML = "マウスのボタンが押された (type:\"" + e.type + "\" button:" + e.button  + ' target '+e.target + ") " + e.target.innerHTML;
	}

	// ------------------------------------------------------------
	// マウスのボタンを離すと実行される関数
	// ------------------------------------------------------------
	function MouseUpFunc(e){
		e.target.style.backgroundColor = "#ffffff";
		element_result.innerHTML = "マウスのボタンが離された (type:\"" + e.type + "\" button:" + e.button + 'target '+e.target+") " + e.target.innerHTML;
	}
*/
	// ------------------------------------------------------------
	// クリックすると実行される関数
	// ------------------------------------------------------------
	function MouseClickFunc(e){
        var msg='マウスがクリックされた';
		element_result.innerHTML =  msg+"type: " + e.type + "\" button:" + e.button + 'target '+e.target + ") " + e.target.innerHTML;
        e.target.style.backgroundColor = "#ffffff";
        oldelm = e.target;
        document.getElementById('input').value= e.target.innerHTML;
        document.getElementById('output').value= e.target.innerHTML+'.new';
        cultivationProgramLoad();
	}

	// ------------------------------------------------------------
	// ダブルクリックすると実行される関数
	// ------------------------------------------------------------
	function MouseDoubleClickFunc(e){
		element_result.innerHTML = "マウスがダブルクリックされた (type:\"" + e.type + "\" button:" + e.button + ") " + e.target.innerHTML;
	}

    function MouseOverFunc(e){
		element_result.innerHTML = "マウスがOverされた (type:\"" + e.type + "\" button:" + e.button + ") " + e.target.innerHTML;
	}

	// ------------------------------------------------------------
	// イベントのリッスンを開始する
	// ------------------------------------------------------------
	// イベントリスナーに対応している
    for(var i=0;i<elements.length;i++){
    var element = elements[i];
    
	if(element.addEventListener){
//     element.addEventListener("onmouseover" , MouseOverFunc);
		// マウスのボタンを押すと実行されるイベント
		element.addEventListener("mousedown" , MouseDownFunc);
		// マウスのボタンを離すと実行されるイベント
		element.addEventListener("mouseup" , MouseUpFunc);
		// クリックすると実行されるイベント
	//	element.addEventListener("click" , MouseClickFunc);
		// ダブルクリックすると実行されるイベント
//		element.addEventListener("dblclick" , MouseDoubleClickFunc);
		// コンテキストメニューが表示される直前に実行されるイベント
		element.addEventListener("contextmenu" , function (e){
			// コンテキストメニューの表示を無効化
		e.preventDefault();
    });

	// アタッチイベントに対応している
	}else if(element.attachEvent){
//  element.attachEvent("onmouseover" , MouseOverFunc);
		// マウスのボタンを押すと実行されるイベント
		element.attachEvent("onmousedown" , MouseDownFunc);
		// マウスのボタンを離すと実行されるイベント
		element.attachEvent("onmouseup" , MouseUpFunc);
		// クリックすると実行されるイベント
//		element.attachEvent("onclick" , MouseClickFunc);
		// ダブルクリックすると実行されるイベント
//		element.attachEvent("ondblclick" , MouseDoubleClickFunc);
		// コンテキストメニューが表示される直前に実行されるイベント
		element.attachEvent("oncontextmenu" , function (e){
			// コンテキストメニューの表示を無効化
			return false;
		});

         }
    }
}
///////// Light Schedule ////////
    
var rdata=''; // return from command
var start=[];
var end=[];
var cont=[];

var ms='';

src="/static/datetimepicker/jquery.datetimepicker.js";
  
var addnumLamp=0;
var active=[false,false,false,false,false,false];

function addElementsLamp(no) {
var targetnum=0;

addnumLamp=0;
for(var i=0;i<=active.length;i++){
    if(active[i] === true) addnumLamp++;
}

targetnum=active.length;
if(no) targetnum=no; 
else {
        for( i=0;i<=active.length;i++){
            if(active[i] === false){
                targetnum=i;
                no=targetnum;
                break;
                }
        }
    }
    
    if(targetnum>=active.length){
    var msg=' これ以上設定できません';
        document.getElementById("Error").innerHTML='Lamp '+targetnum+msg;
        return;
        }
    
active[targetnum]=true;

console.log('---addElementsLamp--- no='+no);
console.log('---addElementsLamp--- targetnum='+targetnum);

    active[targetnum] = true;
    
//    if(!document.getElementById('base'+targetnum)){
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
    base_element.innerHTML = '<td class="No"><button name="BtnLamp" onclick="delElementsLamp('+targetnum+')">X'+targetnum+'</button></td><td><input width="100" type="text" id="'+start_id+'"/></td><td><input type="text"   width="100" id="'+end_id+'"/></td>';
    base_element.appendChild(start_element);
    base_element.appendChild(end_element);
    
    //
    // jQueryでなければならない。ソートできない。    
    // list sort ///
    
    var options = {
      valueNames: [ 'No' ]
    };
    var userList = new List('settings', options);
    console.log('userList=',userList);
    userList.sort( 'No');
    
    /////
    // jQueryでなければならない。ソートできない。
    var stable = $('#tableIDLamp');
    stable.append(base_element); 
    
    /*
    var stable = $('#tableIDLamp');
    // body要素にdivエレメントを追加
    stable.append(base_element);
        
    // renumbering button
    p=document.getElementsByName('BtnLamp');
    for(i=0;i<p.length;i++){
        p[i].innerHTML='X'+i;
        console.log('p.innerHTML='+p[i].innerHTML);
    }
    */
    addnumLamp++;
    
        var sstart=0;
        var endtime=0;
        var scont=0; 
        
        if(start[targetnum]){     
console.log('!!!!! addElementsLamp start['+targetnum+']='+start[targetnum]);
         starth=parseInt(start[targetnum] / 60);
         startm=parseInt(start[targetnum] % 60);
            if(starth<=9) starth='0'+starth;
            if(startm<=9) startm='0'+startm;
            sstart=starth+':'+startm;
            console.log('!!!!! addElementsLamp sstart='+sstart);
        } else {
            sstart='0:0';
        start[targetnum]=0;
        }
        
        if(cont[targetnum]){
            var sconth=parseInt(cont[targetnum] / 60);
            var scontm=parseInt(cont[targetnum] % 60);
            scont=sconth+':'+scontm;
            if(sconth<=9) sconth='0'+sconth;
            if(scontm<=9) scontm='0'+scontm;
            scont=sconth+':'+scontm;
            console.log('!!!!! addElementsLamp  scont='+scont);
            endtime=scont;
        } else {
            endtime='0:0';
            cont[targetnum]=0;
        }
    
console.log('addElementsLamp start='+start+' cont='+cont+' targetnum='+targetnum);
console.log('addElementsLamp start[targetnum]='+start[targetnum]+' cont[targetnum]='+cont[targetnum]);
console.log('addElementsLamp #target: '+targetnum+" addnumLamp="+addnumLamp +' i= '+targetnum+' sstart='+sstart+' scont='+scont+' endtime='+endtime);
console.log('addElementsLamp sstart='+sstart+' endtime='+endtime+' targetnum='+targetnum);

//var msg1='ライト点灯の時刻を選択';
var msg1='時刻を選択';
    var msg2='ライト消灯の時刻を選択';
    
    $('#'+start_id).datetimepicker({
            value:sstart,
            datepicker:false,
            format:'H:i',
            step:30,
            language: 'ja',            
          onShow:function( ct ){
           this.setOptions({
            value: msg1
           });
          },
          onSelectTime:function(ct,$i){
          //　設定されるたびにデータ取得する
          message('LightON '+ct.dateFormat('H:i'));
          } 
        });
     
    $('#'+end_id).datetimepicker({
            value:endtime,
            datepicker:false,
            format:'H:i',
            step:30,
            language: 'ja',
            
          onShow:function( ct ){
           this.setOptions({
            value: msg2
           });
          },
          onSelectTime:function(ct,$i){
 
            var endtime = ct.dateFormat('H:i');
            message('LightOFF '+endtime);
            }
        });

//    }// add element
}

function delElementsLamp(no) {
    addnumLamp--;
    active[no] = false;
    var st=document.getElementById('start'+no);
    if(st) st.remove();    
    var ed=document.getElementById('end'+no);
    if(ed) ed.remove();
    var bs=document.getElementById('base'+no);
    if(bs) bs.remove();
    // body要素にdivエレメントを削除
}

// sendcomをITPsetting に変更すること
function setItplanterLamp(f) {
console.log('----setItplanterLamp----');
//
    var command=[];
    command.push('-No');
    command.push('1');
    for(var i=0;i<addnumLamp;i++){
    if( active[i] === true ){
    var ids = 'start'+i;
    var ide = 'end'+i;
   
    var start_t=$('#'+ids).datetimepicker('getDate').val();
    var end_t=  $('#'+ide).datetimepicker('getDate').val();
    
    var cont_t=calcContTime(start_t, end_t);
    var contm=cont_t;

    console.log('ITPsetting start='+start_t+' end_t='+end_t+' cont_t='+cont_t);

    start_t = start_t.split(':');
    var startm = parseInt(start_t[0])*60+parseInt(start_t[1]);
     command.push('-L'+i+','+startm+','+contm);
        }
    }
        command.push('-ln');
        command.push(addnumLamp);
    
    var txt='';
    for(i=0;i<command.length;i++){
        txt += command[i]+' ';
    }
    console.log('ITPsetting.py '+txt);
    //ITPsetting( command, f);// ここでは設定しない
    return command;
}

function load_itplanterSettingsLamp(f){
  ITPsetting(['-No','1','-rl'], f);
}

////
function readElementsLamp() {
console.log('readElementsLamp='+addnumLamp);
    var results='';
    lampStartTime=[]; lampEndTime=[]; // init
    for(var i=0;i<addnumLamp;i++){
    if( active[i] === true ){
    var ids = 'start'+i;
    var ide = 'end'+i;
    lampStartTime[i]=$('#'+ids).datetimepicker('getDate').val();
    lampEndTime[i]  =$('#'+ide).datetimepicker('getDate').val();
        }
    }
}

////// pumpSchedule
var startPump=[];
var endPump=[];
var msPump='';
var addnumPump=0;
var activePump=[false,false,false,false,false,false,false];

function addElementsPump(no) {
//
//  active[i]==falseの場所に入れる    
//
var targetnumPump=0;
if(no) targetnumPump=no; else {
//message2('addElements');
    for(var i=0;i<=6;i++){
        if(activePump[i] === false){
          targetnumPump=i;
          break;
        }
    }
}
    var msg=' これ以上設定できません';
    if(targetnumPump>5){
        document.getElementById("Error").innerHTML='pump '+targetnumPump+msg;
        return;
    }
    
    activePump[targetnumPump] = true;
    
    var start_elementPump = document.createElement('div');
    var start_idPump = 'startPump'+targetnumPump;
    start_elementPump.id = start_idPump;
    start_elementPump.innerHTML =null;
    start_elementPump.visibility = 'hidden';

    var base_elementPump = document.createElement('tr');
    var base_idPump = 'basePump'+targetnumPump;
    base_elementPump.id = base_idPump;
        
    base_elementPump.innerHTML = '<td class="No"><button name="BtnPump" onclick="delElementsPump('+targetnumPump+')">X'+targetnumPump+'</button></td><td><input type="text" id="'+start_idPump+'"/></td>';
    base_elementPump.appendChild(start_elementPump);

    // list sort ///
    var options = {
      valueNames: [ 'No' ]
    };
    var userList = new List('settingsPump', options);
    //console.log('userList=',userList);
    userList.sort( 'No');
    /////
    // jQueryでなければならない。ソートできない。
    var stable = $('#tableIDPump');
    stable.append(base_elementPump); 
/*    
    // renumbering button
    p=document.getElementsByName('BtnPump');
    for(i=0;i<p.length;i++){
        p[i].innerHTML='X'+i;
        console.log('p.innerHTML='+p[i].innerHTML);
    }
*/
    addnumPump++;

//messageConsole('#target: '+targetnum+" addnum="+addnum +'i= '+i);
    var msg1='ポンプの動作時刻を選択';
    $('#'+start_idPump).datetimepicker({
            value:'07:00',
            datepicker:false,
            format:'H:i',
            step:30,
            language: 'ja',
            
          onShow:function( ct ){
           this.setOptions({
           // document.getElementById("message").textContent="ABC";
            value:msg1
           });
          },
          onSelectTime:function(ct,$i){
          //　設定されるたびにデータ取得する
          message('PumpON '+ct.dateFormat('H:i'));
          } 
        });
}

function delElementsPump(no) {
//    document.getElementById("clickedPump").innerHTML=no;
    addnumPump--;
    activePump[no] = false;
    if(addnumPump <= 0) addnumPump=0;
//    messageConsole('addnumPump0: '+addnumPump+' delID:'+no);  
//    message('deleteElementPump '+no);
    
    var e=document.getElementById('startPump'+no);
    if(e) e.remove();    
    e=document.getElementById('endPump'+no);
    if(e) e.remove();    
    e=document.getElementById('basePump'+no);
    if(e) e.remove();    

    // body要素にdivエレメントを削除
}

// sendcomをITPsetting に変更すること
function setItplanterPump(f) {
console.log('setItplanterPump');
    var command=[];
    command.push('-No');
    command.push('1');
    
    for(var i=0;i<7;i++){
    if( activePump[i] === true ){
        var idsPump = 'startPump'+i;
        var objsPump= $('#'+idsPump).datetimepicker('getDate');
        var startPump= 'Start_Pump'+i+': '+objsPump.val()+' ';
        
        var start_tPump=objsPump.val().split(':');
        var startmPump=(parseInt(start_tPump[0]))*60+parseInt(start_tPump[1]);
        console.log('i='+i+' +objsPump.val='+objsPump.val()+' startmPump='+startmPump);
         command.push('-P'+i+','+startmPump);
        }
    }
        command.push('-pn');
        command.push(addnumPump);

    console.log('setItplanterPump  command='+command);
    var txt='';
    for(i=0;i<command.length;i++){
        txt += command[i]+' ';
    }
    console.log('ITPsetting.py '+txt);
    
    //console.log('ITPsetting.py '+command);
    //ITPsetting( command, f);　// ここでは設定しない
    return command;
}

function readElementsPump() {
    pumpStartTime=[];
    for(var i=0;i<addnumPump;i++){
    if( activePump[i] === true ){
    var idsPump = 'startPump'+i;
        pumpStartTime[i]= $('#'+idsPump).datetimepicker('getDate').val();
        }
    }
    // Pump work Time
    var pw=document.getElementById("PumpWorkTime");
    if(pw){
    pumpWrokTime = pw.value;
    }
  //  messageConsole('addnum1: '+addnum);
}

////// DUTY /////
var startDuty=[];
var endDuty=[];
var msDuty='';
var addnumDuty=0;
var activeDuty=[false,false,false,false,false,false];

function addElementsDuty(no) {
var targetnumDuty=activeDuty.length;

    if(no) targetnumDuty=no; else {
        for(var i=0;i<activeDuty.length;i++){
            if(activeDuty[i] === false){
              targetnumDuty=i;
              break;
            }
        }
    }
    console.log('--addElementsDuty--targetnumDuty='+targetnumDuty);
        if(targetnumDuty >= activeDuty.length){
            var msg='これ以上設定できません';
            document.getElementById("Error").innerHTML=targetnumDuty+msg;
            return;
        }
    
    activeDuty[targetnumDuty] = true;
    var start_elementDuty = document.createElement('div');
    var start_idDuty = 'startDuty'+targetnumDuty;
    start_elementDuty.id = start_idDuty;
    start_elementDuty.innerHTML =null;
    start_elementDuty.visibility = 'hidden';

    var end_elementDuty = document.createElement('div');
    var end_idDuty = 'endDuty'+targetnumDuty;
    
    console.log('---addElementsDuty--- end_idDuty='+end_idDuty);
    end_elementDuty.id = end_idDuty;
    end_elementDuty.value = 0;
//    end_elementDuty.visibility = 'hidden';
    if( endDuty[targetnumDuty]=== undefined) endDuty[targetnumDuty]=90;
    var base_elementDuty = document.createElement('tr');
    var base_idDuty = 'baseDuty'+targetnumDuty;
    base_elementDuty.id = base_idDuty;
    
    base_elementDuty.innerHTML = '<td class="No"><button name="BtnDuty" onclick="delElementsDuty('+targetnumDuty+')">X'+targetnumDuty+'</button></td><td><input type="text" id="'+start_idDuty+'"/></td><td><input onkeydown="goDuty('+targetnumDuty+')" id="'+end_idDuty+'" type="text"  value="'+endDuty[targetnumDuty]+'"></td>';
    
    base_elementDuty.appendChild(start_elementDuty);
    base_elementDuty.appendChild(end_elementDuty);

    // list sort ///
    var options = {
      valueNames: [ 'No' ]
    };
    var userList = new List('settingsDuty', options);
    //console.log('userList=',userList);
    userList.sort( 'No');
    /////       
var stableDuty = $('#tableIDDuty');
    stableDuty.append(base_elementDuty);
/*    
    // renumbering button
    p=document.getElementsByName('BtnDuty');
    for(i=0;i<p.length;i++){
        p[i].innerHTML='X'+i;
        p[i].value='X'+i;
        console.log('p.innerHTML='+p[i].innerHTML);
    }
*/
     addnumDuty++;
    if( startDuty[targetnumDuty] === undefined ) startDuty[targetnumDuty]=0;
    
 console.log('addElementsDuty--startDuty='+startDuty+' endDuty='+endDuty);
 console.log('addElementsDuty--startDuty='+startDuty[targetnumDuty]);

    var starthDuty=parseInt(parseInt(startDuty[targetnumDuty]) / 60);
    var startmDuty=parseInt(parseInt(startDuty[targetnumDuty]) % 60);

    var msg1='デュティ変更の時刻を選択';
    $('#'+start_idDuty).datetimepicker({
            value:starthDuty+':'+startmDuty,
            datepicker:false,
            format:'H:i',
            step:30,
            language: 'ja',
          onShow:function( ct ){
           this.setOptions({
            value:msg1
           })
          },
          onSelectTime:function(ct,$i){
          //　設定されるたびにデータ取得する
          message('Duty Change '+ct.dateFormat('H:i'))
          } 
        });
 //  }  // avoid
}

function delElementsDuty(no) {
    addnumDuty--;
    activeDuty[no] = false;
    if(addnumDuty<= 0) addnumDuty=0;
    
    var st=document.getElementById('startDuty'+no);
    if(st) st.remove();    
    var ed=document.getElementById('endDuty'+no);
    if(ed) ed.remove();
    var bs=document.getElementById('baseDuty'+no);
    if(bs) bs.remove();    
}

function readElementsDuty() {
    message('readElementsDuty');
    dutyStartTime=[]; dutyDuty=[];// init
    for(var i=0;i<addnumDuty;i++){
    if( activeDuty[i] === true ){
    var idsDuty = 'startDuty'+i;
    var ideDuty = 'endDuty'+i;
    dutyStartTime[i]=$('#'+idsDuty).datetimepicker('getDate').val();
    dutyDuty[i] =  $('#'+ideDuty).val();    
        }
    }
}

function setItplanterDuty(f) {
    var command=[];
    command.push('-No');
    command.push('1');
    
    addnumDuty=0;
    for(var i=0;i<6;i++){
    if( activeDuty[i] === true ){
        var idsDuty = 'startDuty'+i;
        var objsDuty= $('#'+idsDuty).datetimepicker('getDate');
        var startDuty= 'Start_Duty'+i+': '+objsDuty.val()+' ';
        var ideDuty = 'endDuty'+i;
        var objeDuty= $('#'+ideDuty).datetimepicker('getDate');
        var endDuty= 'End_Duty'+i+': '+ objeDuty.val() +'<br>';
        
        var start_tDuty=$('#'+idsDuty).datetimepicker('getDate').val().split(':');
        var startmDuty=parseInt(start_tDuty[0])*60+parseInt(start_tDuty[1]);
        var end_tDuty= parseInt( $('#'+ideDuty).val());
         command.push('-D'+i+','+startmDuty+','+end_tDuty);
         addnumDuty += 1;
        }
    }
        command.push('-dn');
        command.push(addnumDuty);

    var txt='';
    for(i=0;i<command.length;i++){
        txt += command[i]+' ';
    }
    console.log('ITPsetting.py '+txt);
    //ITPsetting( command, f); // ここでは設定しない
    return command;
}

function writeRAM(f){
    commandSendcom('\\RAM',function(results){
        console.log('write ¥¥RAM');
        if(f && typeof f === 'function') f();
    });
}

function readElementsAll(){
    readElementsLamp() ;
    readElementsPump() ;
    readElementsDuty() ;
}

function setElementsAll(){
    //setItplanterLamp(setItplanterPump(setItplanterDuty(writeRAM()))) ;
    var commandLamp = setItplanterLamp();
    var commandDuty = setItplanterDuty();
    var commandPump = setItplanterPump();
    var command = commandLamp.concat(commandDuty).concat(commandPump);
    console.log('setElementsAll ');
    var txt='';
    for(i=0;i<command.length;i++){
    txt += command[i]+' ';
    }
    console.log("setElementsAll "+txt);
    ITPsetting(command,writeRAM);
}

// set All Data to picker 
function setAllData(){  
var i=0;
console.log('------setAllData--------');
    if(lampStartTime){
console.log('delElementsLamp='+lampStartTime.length);
    if(lampStartTime.length>0){
    var nLamp=addnumLamp;
    for(i=nLamp-1;i>=0;i--) delElementsLamp(i);
console.log('addElementsLamp='+lampStartTime.length);
    for(i=0;i<lampStartTime.length;i++){
    if(lampStartTime[i] && lampEndTime[i]){
    addElementsLamp(i);
    $('#start'+i).datetimepicker({value: lampStartTime[i], format:'H:i'});
    $('#end'+i).datetimepicker({value: lampEndTime[i], format:'H:i'});
                }
           }
        }
    }
    
    if(pumpStartTime){   
console.log('setAllData delElementsPump='+pumpStartTime.length);
    if(pumpStartTime.length>0){
    var nPump=addnumPump;
    for(i=nPump-1;i>=0;i--) delElementsPump(i);
    for(i=0;i<pumpStartTime.length;i++){
        if(pumpStartTime[i]){
        addElementsPump(i);
        $('#startPump'+i).datetimepicker({value: pumpStartTime[i], format:'H:i'});
                }
            }
        var pwhPump = document.getElementById("PumpWorkTime");
        if(pwhPump) pwhPump.value = pumpWrokTime;/////
        }
    }
    
//console.log('dutyStartTime.length '+dutyDuty.length);
    if(dutyDuty){
    console.log('setAllData delElementsDuty='+dutyDuty.length);
    if(dutyDuty.length>0){
    var nDuty=addnumDuty;
    for(i=nDuty-1;i>=0;i--) delElementsDuty(i);
//console.log('addElementsDuty='+dutyStartTime.length);
    for(i=0;i<dutyStartTime.length;i++){
        if( dutyDuty[i] && dutyStartTime[i] ){
        addElementsDuty(i);
        $('#startDuty'+i).datetimepicker({value: dutyStartTime[i], format:'H:i'});
        var ed=document.getElementById('endDuty'+i);
        if(ed) ed.value= dutyDuty[i];
//console.log('setting '+dutyStartTime[i] +' '+dutyDuty[i]);
                }
            }
        }
    }
}








