
src="/static/datetimepicker/jquery.datetimepicker.js";

var addnum=0;// 要素数
var targetnum=0;// 次の要素番号

var active=[];
var MaxScN=1440;

//CArray.prototype = new EventEmitter();

// 読み込んだ情報が入っている。
// filename,ファイルの中身の設定情報
// save時に利用すること。
var loadCultiData=[];  // 栽培プログラムの記憶
var loadTempData=[];   // 温度プログラムの記憶

var controlXMLlist=[]; // コントロールプログラムファイルのリスト
var tempXMLlist = [];  // 温度プログラムファイルのリスト

var cultiXMLlist= [];  // 栽培プログラムファイルのリスト
var listt=[], listc=[];// コントロールプログラム内の温度プログラム、栽培プログラムのリスト
var control=[];// コントロールプログラムの中身
var state=false;

// 開始時の待ち時間を設定しなくても良いようにしたい。
$(document).ready( function() {
    lsAllList(loadAllFile());
    
    setTimeout(function() {
      console.log("loadControlFile");
      loadControlFile(setupInfo());
      console.log('loadCultiData ready=',loadCultiData);
    }, 1500);// 1秒くらい待たないといけない
    
});

function setupInfo(f){
    setTimeout(function() {
        var p= document.getElementById('DISPLAY0');
          if(p){
              p.checked=true;
              setInfo(0);
          } else {
              setupInfo(f);
          }
          if(f) f();
    }, 2200);// 2秒くらい待たないといけない
}

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
        if(active[i] !== true ){
            emptyNo=i;
            break;
        }
    }
    return emptyNo;
}

function lsAllList(f){
// ls  ./LongPeriodControl ./config schedule ./xml
    $.getJSON( 
    "/app/longperiodcontrol/command",//url
    {"command":'ls',  "arg":['./LongPeriodControl ./schedule ./xml']},//data
    function(data) {
    //dataがサーバから受け取るjson値
    console.log('lsAllList');
    $.each(data, 
    function(key, val) {
    rdata = val.replace(/<br>/g,'\n');
    });
    
    tempXMLlist=[];
    controlXMLlist=[]; // コントロールプログラムファイルのリスト
    tempXMLlist = [];  // 温度プログラムファイルのリスト
    
    rdata = rdata.replace(/\n\n/g,':');
    list=rdata.split(':');
    console.log('lsAllList \n'+list);
    console.log('lsAllList '+list[1].split('\n'));
    
     for(i=0;i<list.length;i+=2){
         if(list[i].indexOf('./LongPeriodControl') >=0 ){
             controlXMLlist=list[i+1].split('\n');
         }
         if(list[i].indexOf('./schedule') >=0 ){
             tempXMLlist=list[i+1].split('\n');
         }
         if(list[i].indexOf('./xml') >=0 ){
             cultiXMLlist=list[i+1].split('\n');
         }
     }
     // make control list
     controlXMLlist.shift();// 不要な先頭を削除
     
     var ls=document.getElementById("controllist");
     var flist='<table>';
     if(controlXMLlist.length % 2 == 1 ) controlXMLlist.push('');
     for(i=0;i<controlXMLlist.length-1;i+=2){
         flist += '<tr><td  >['+i+']</td>'+'<td name="tag" >'+controlXMLlist[i]+'<td><td>['+(i+1)+']</td>'+'<td name="tag" >'+controlXMLlist[i+1]+'<td><tr>';
     }
    flist += '</table>';
    ls.innerHTML=flist;
    addListners();
    
    console.log('lsAllList controlXMLlist='+controlXMLlist);
    tempXMLlist.shift();// 不要な先頭を削除
    console.log('lsAllList tempXMLlist.length='+tempXMLlist.length);
    console.log('lsAllList tempXMLlist=|'+tempXMLlist+'|');
    cultiXMLlist.shift();// 不要な先頭を削除
    cultiXMLlist.pop();// 不要な後備を削除
    console.log('lsAllList cultiXMLlist.length='+cultiXMLlist.length);
    console.log('lsAllList cultiXMLlist='+cultiXMLlist);
     
     if(f) f();
    });    
}

function splitDataKey(d){
console.log('splitDataKey');    
console.log('d='+d);
 var s='';
 s = d.split(' '); // itpManager's file
if(s) console.log('[1]s.length='+s.length);  
if(s.length===1) s=d.split('+'); // this app file
if(s) console.log('[2]s.length='+s.length);  
    if(s){
     for(var i=0;i<s.length;i++){
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
         for( i=0;i<s.length;i++){
             v += s[i]+' ';
         }
//console.log('v='+v);
    return v;
}

function calcEndTime(start, cont){
    // start    12:30
    // cont     01:30
    // end      14:00
    if(cont.indexOf(':')<=0){
    console.log('calcEndTime  cont '+cont);
        cont = String(cont/60)+':'+String(cont % 60)
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
    ehm[0]=parseInt(te) / 60;
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

function cultivationProgramRead(filename,f){
//
// cultivationPrg arrays
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

    var j=0, i=0;
    console.log('cultivationProgramRead');
    var nodesSnapshot3 = document.evaluate('//p//Plant//Name',    document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null );
    var nodesSnapshot4 = document.evaluate('//p//Plant//Comment', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null );
    var name0=[];
    var comment0=[];
    var array0=[];
    var str0='';
    
    for ( i=0 ; i < nodesSnapshot3.snapshotLength; i++ ) name0[i]=nodesSnapshot3.snapshotItem(i).textContent;
    for ( i=0 ; i < nodesSnapshot4.snapshotLength; i++ ) comment0[i]=nodesSnapshot4.snapshotItem(i).textContent;
    
    var comstr='';
    for(i=0;i<comment0.length;i++){
    array0[name0[i]]=comment0[i];
    console.log('cultivationProgramRead ---comment0---['+i+'] name='+name0[i]+' comment='+comment0[i]);
    } 
    
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

// console.log('dutysc '+dutysc);
    dutyDuty=[]; dutyStartTime=[];
    for(i=0, j=0;i<dutysc.length;i++){
        if(dutysc[i]==='') continue;
//console.log('dutysc['+i+'] |'+dutysc[i]+'|');
        if( dutysc[i] === 'Duty'){
        dutyDuty[j]=dutysc[i+1];
//console.log('DD'+j+' '+dutyDuty[j]);
        }
//console.log('duty00 |'+dutysc[i]+'|');
        if( dutysc[i] === 'StartTime'){
        dutyStartTime[j]=dutysc[i+1];
//console.log('DS'+j+' '+dutyStartTime[j]);
        j++;
            }
        }
    }

 //console.log('lampsc '+lampsc);
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
//console.log('StartTime');
        lampStartTime[j]=lampsc[i+1];
console.log('cultivationProgramRead LS'+j+' '+lampStartTime[j]);
        }
    if(str==='ContinueTime' || str==='EndTime'){ // EndTime tagはなくすこと
//console.log('EndTime');
// BUG
// EndTimeではなくContinueTimeだった。継続時間を入れるのだから、lanmpEndTime[ij]=lanmpEndTime[j]-lampStartTime[j]に変更すること
// ContinueTimeが正しい。
//
        lampEndTime[j]=calcEndTime(lampStartTime, lampsc[i+1]);
console.log('cultivationProgramRead LE'+j+' '+lampEndTime[j]);
        j++;
            }  
        }
console.log('cultivationProgramRead lampStartTime.length '+lampStartTime.length);
    }

    var pumpsc=array['pumpSchedule'];
    if(pumpsc){
// S,t,a,r,t,.....
//console.log('pumpsc0 '+pumpsc);
    pumpsc=pumpsc.split(' ');
//console.log('pumpsc '+pumpsc);
    pumpStartTime=[];
    for(i=0, j=0;i<pumpsc.length;i++){
        if(pumpsc[i]==='') continue;
        str=pumpsc[i];
    if( str==='StartTime'){
//console.log('StartTime');
        pumpStartTime[j]=pumpsc[i+1];
//console.log('PS'+j+' '+pumpStartTime[j]);
        j++;
            }
        }
//console.log('pumpStartTime.length '+pumpStartTime.length);
    }
//
    var txt='';
        txt = '---Lamp--- ';
    for( i=0;i<lampStartTime.length;i++){
        txt += lampStartTime[i]+' '+lampEndTime[i]+'\n';
        }
        txt += '---Duty--- '
    for( i=0;i<dutyStartTime.length;i++){
        txt += dutyStartTime[i]+' '+dutyDuty[i]+'\n';
        }
        txt += '---Pump--- '
    for( i=0;i<pumpStartTime.length;i++){
        txt += pumpStartTime[i]+' ';
        }
        txt += '\n';
        txt += 'pumpWrokTime '+pumpWrokTime
        
    var p=document.getElementById('comment');
    if(p){
        p.value=txt;
    }
    //  読み込んだ情報は記憶する。
    txt = filename.replace('./xml/','')+','+txt;
    loadCultiData.push(txt);
    //console.log('cultivationProgramRead loadCultiData filename='+filename);
    console.log('cultivationProgramRead loadCultiData\n'+loadCultiData);
    
    if(f) f();
}

function XMLaddElement(rdata) {
    document.getElementById("hide").innerHTML=rdata;
    document.getElementById("hide").visibility='hidden';
}

function saveDataMake(){
        ///////////////////////   
    // parse elements
    //
    var saveFile='';
    var filetxt='';

    activeList=getActiveElements();
    
    for(i=0;i<activeList.length;i++){
        no=activeList[i];
        console.log('saveDataMake no=',no);
    
        // get STARTDAY
        var startday=getCalenderDate('STARTDAY',no);
        if(!startday){
            console.log('saveDataMake Error startday=',startday);
            break;
        }

        console.log('saveDataMake startday=',startday);
        filetxt+='No.'+(no)+',';
        filetxt+=startday+',';
        //
        // 栽培プログラム（開始時）
        var cform = document.forms['cformSTART'+no];
        if( !cform ){
        console.log('saveDataMake cform not found '+no);
            continue;
        }
        console.log('saveDataMake form.list.value '+no);
        console.log('saveDataMake cform '+cform);
        console.log('saveDataMake form.list.value |',cform.list.value+'|');
        
        // Start
        for(j=0;j<loadCultiData.length;j++){
            // 不要な　./xml/を削除する
            loadCultiData[j]=loadCultiData[j].replace(/.\/xml\//g,''); 
            d=loadCultiData[j].split(',')[0];
            if(d.indexOf(cform.list.value)>=0){// ファイル名の一致を検出
        console.log('saveDataMake d cform.list.value ',d,cform.list.value);            
                if(d===(cform.list.value)){// ファイル名の一致を検出
                var tmp = loadCultiData[j];
                // LampとDutyは、要素（開始時間、終了時間）（開始時間、PWM）毎に|で区切る
                    var a0=tmp.split('---Duty--- ')[0];           
                     a0=a0.replace(/\n/g,'|');// Lamp に | 区切りを入れる
         console.log('saveDataMake a0=',a0);
                    var a1=tmp.split('---Duty--- ')[1].split('---Pump--- ')[0]; 
                    a1=a1.replace(/\n/g,'|');// Pump に | 区切りを入れる
         console.log('saveDataMake a1=',a1);
                    var a2=tmp.split('---Pump--- ')[1]; 
         console.log('saveDataMake a2=',a2);
                    tmp=a0+',---Duty--- '+a1+',---Pump--- '+a2;
                filetxt += tmp;
                filetxt=filetxt.replace(/\n/g,'+');
         console.log('saveDataMake filetxt=',filetxt);
                break;
                    }
                }
        }// next j
        
        if(filetxt[filetxt.length-1] !== ',' ) filetxt+=',';
        
        // get selected tempPrg 
        // tformSTART
        var tform = document.forms['tformSTART'+no];
        for(j=0;j<loadTempData.length;j++){
            // 不要な　./config/を削除する
            loadCultiData[j]=loadCultiData[j].replace(/.\/config\//g,''); 
            d=loadTempData[j].split(',')[0];
            if(d===tform.list.value){// ファイル名の一致
         console.log('saveDataMake Hit  d=', d,' tform.list.value=', tform.list.value);
                filetxt += loadTempData[j];
                filetxt=filetxt.replace(/\n/g,'+');
                break;
            }
        }// next j
        if(filetxt[filetxt.length-1] !== ',' ) filetxt+=',';

        // get ENDDAY
        var endday=getCalenderDate('ENDDAY',no);
         console.log('saveDataMake endday=', endday);
        filetxt+=endday+',';

        cform = document.forms['cformEND'+no]; 
        for(j=0;j<loadCultiData.length;j++){
           // 不要な　./xml/を削除する
            loadCultiData[j]=loadCultiData[j].replace(/.\/xml\//g,''); 
            d=loadCultiData[j].split(',')[0];
            if(d.indexOf(cform.list.value)>=0){// ファイル名の一致を検出
        console.log('saveDataMake d cform.list.value ',d,cform.list.value);            
                if(d===(cform.list.value)){// ファイル名の一致を検出
                 tmp = loadCultiData[j];
                // LampとDutyは、要素（開始時間、終了時間）（開始時間、PWM）毎に|で区切る
                 a0=tmp.split('---Duty--- ')[0];           
                     a0=a0.replace(/\n/g,'|');// Lamp に | 区切りを入れる
         console.log('saveDataMake a0=',a0);
                 a1=tmp.split('---Duty--- ')[1].split('---Pump--- ')[0]; 
                    a1=a1.replace(/\n/g,'|');// Pump に | 区切りを入れる
         console.log('saveDataMake a1=',a1);
                 a2=tmp.split('---Pump--- ')[1]; 
         console.log('saveDataMake a2=',a2);
                    tmp=a0+',---Duty--- '+a1+',---Pump--- '+a2;
                filetxt += tmp;
                filetxt=filetxt.replace(/\n/g,'+');
         console.log('saveDataMake filetxt=',filetxt);
                break;
                    }
                }
        }// next j
        if(filetxt[filetxt.length-1] !== ',' ) filetxt+=',';
         console.log('saveDataMake filetxt1=', filetxt);

        // tformEND
        tform = document.forms['tformEND'+no];
        for(j=0;j<loadTempData.length;j++){
            d=loadTempData[j].split(',')[0];
            if(d===tform.list.value){// ファイル名の一致
                filetxt += loadTempData[j];
                filetxt=filetxt.replace(/\n/g,'+');
                break;
            }
        }// next j
        if(filetxt[filetxt.length-1] !== ',' ) filetxt+=',';
        filetxt +='EOL';
         console.log('saveDataMake filetxt2=', filetxt);
        //
        no++;
    }// next i
    ////////////////////////////
    return filetxt;
}

function saveFile(saveFileName, filetxt, f){
        // saveFile
    $.getJSON( 
    "/app/longperiodcontrol/writeFileSync",//url
    {"file":saveFileName, "data":filetxt},//data
    function(data) {
    //dataがサーバから受け取るjson値
    $.each(data, 
    function(key, val) {
    rdata = val.replace(/<br>/g,'\n');
    });
     console.log('saveFile: |'+rdata+'|');
     
     if(f) f();
    }); 
}

function saveControlFile(f ){
    var filetxt='';
    var pd=document.getElementById('listinput');
    var saveFileName=pd.value;
    // .txt拡張子を付ける
    if(saveFileName.indexOf('.txt')<=0){
        saveFileName=saveFileName+'.txt';
    }
    if(saveFileName.indexOf('./LongPeriodControl/')<=0){
        saveFileName='./LongPeriodControl/'+saveFileName;
    }
       console.log('saveControlFile saveFileName='+saveFileName);
       
    filetxt=saveDataMake();
    console.log('saveControlFile filetxt  \n',filetxt);
    saveFile(saveFileName, filetxt/*, lsAllList(loadAllFile())*/);
    
    var ls=document.getElementById("controllist");
         if(ls) ls.innerHTML='';
         
    lsAllList(loadAllFile());
    
    setTimeout(function() {
      console.log("loadControlFile");
      loadControlFile(setupInfo());
      console.log('loadCultiData ready=',loadCultiData);
    }, 1500);// 1秒くらい待たないといけない
    
}

// saveFileName以外は、saveControlFileと同じ。
// longPeriodControl.jsが監視しているファイルに書き込む。
function saveControlFileStart(f ){
    var filetxt='';
    saveFileName='./LongPeriodControl/saveLongPeriodControl.txt';
    
    filetxt=saveDataMake();
        
    console.log('saveControlFileStart filetxt  \n',filetxt);
    
    saveFile(saveFileName, filetxt);
}

function loadControlFile(f){
    //
    // 現在のリストを消す。
    // delElements
    var STARTID='', ENDID='';

    //console.log('loadControlFile control=',control);
    
    var p=document.getElementById('listinput');
    var controlFile=p.value;
    if(controlFile==='') controlFile='saveLongPeriodControl.txt';
    
    //console.log('loadControlFile controlFile=',controlFile);
    // load controlFile
    if(controlFile==='undefined') return;
    
    loadFileName='./LongPeriodControl/'+controlFile;
    console.log('loadControlFile loadFileName |'+loadFileName+'|');
    // loadFile  LongPeriodControl file
    $.getJSON( 
    "/app/longperiodcontrol/command",//url
    {"command":'cat', "arg":[loadFileName]},//data
    function(data) {
    //dataがサーバから受け取るjson値
    $.each(data, 
    function(key, val) {
    rdata = val.replace(/<br>/g,'\n');
    //console.log('loadControlFile rdata: |',rdata+'|');
    });
    
    var contents=rdata.replace(/\+/g,'\n');
    if( !contents ) return;
    console.log('loadControlFile contents ',contents);
    // parse elements
    control=contents.split('EOL');
    //console.log('loadControlFile contents ',contents);
    while( control[control.length-1]==='' ) control.pop();
    //console.log('loadControlFile  control !!!!=',control);
    //console.log('loadControlFile 0');

    //      データチェック
    // Error Data
    if(control[0].indexOf('No')<0){
        console.log('loadControlFile  control[0]=',control[0]);
        console.log('loadControlFile  contents=',contents);
        console.log('loadControlFile  Error');
        return;
        }
        
    //console.log('loadControlFile 1');
    if( getActiveElements.length > 0 ) deleteAllElements();

    // file listの中から該当するファイル番号を探す
    var cselectedIndexSTART=[];
    var cselectedIndexEND=[];
    var tselectedIndexSTART=[];
    var tselectedIndexEND=[];
    
    // 温度設定ファイル
    for( i = 0; i < control.length; i++){
        cp=control[i].split(',');
  //      console.log('loadControlFile cp=',cp );
        if(cp[cp.length-1]==='') cp.pop();
        STARTID='', ENDID='';
        for(j=0;j<cp.length;j++){
            if(STARTID==='' && cp[j].indexOf('.txt')>=0){ STARTID=j; continue;}
            if(ENDID===''   && cp[j].indexOf('.txt')>=0){ ENDID=j; break;}
        }
        console.log('loadControlFile STARTID=',STARTID,' ENDID=',ENDID  );        
        cn=control[i].split(',')[STARTID].replace('./schedule/','');
        
        for( j = 0; j < tempXMLlist.length; j++){
        // 完全一致
            if(tempXMLlist[j]===cn){
        console.log('loadControlFile Hit STARTID tempXMLlist['+j+']='+tempXMLlist[j]+' cn='+cn);
                tselectedIndexSTART[i] = j;
                break;
              }
            }

        cn=control[i].split(',')[ENDID].replace('./schedule/','');
        for( j = 0; j < tempXMLlist.length; j++){
        // 完全一致
            if(tempXMLlist[j]===cn){
        console.log('loadControlFile Hit ENDID tempXMLlist['+j+']='+tempXMLlist[j]+' cn='+cn);
                tselectedIndexEND[i]=j;
                break;
                }
             }
    console.log('loadControlFile tselectedIndexSTART=',tselectedIndexSTART[i]);
    console.log('loadControlFile END tselectedIndexEND='+tselectedIndexEND[i]);
        }// next i

    // control[i].split(',')[1]   CULTIVATIONPRG
    for( i = 0; i < control.length; i++){
        cp=control[i].split(',');
        while( cp[cp.length-1]==='' ) cp.pop();
    
    //console.log('loadControlFile XML cp=',cp );
        STARTID='', ENDID='';  
        for(j=0;j<cp.length;j++){
            if(STARTID==='' && cp[j].indexOf('.xml')>=0){ STARTID=j; continue;} 
            if(ENDID  ==='' && cp[j].indexOf('.xml')>=0){ ENDID=j; break;}
        }// next j
        if(STARTID==='' || ENDID==='') continue;
    console.log('loadControlFile XML STARTID=',STARTID,' ENDID=',ENDID );
    // 栽培プログラム（開始）のファイルを探す
    cn=cp[STARTID].replace('./config/','');
    for( j = 0; j < cultiXMLlist.length; j++){
        // 完全一致
            if(cultiXMLlist[j]===cn){
            cselectedIndexSTART[i] = j;
            console.log('loadControlFile XML Hit cultiXMLlist['+j+']='+cultiXMLlist[j]+' cn='+cn);
            break;
              }
          }// next j
        console.log('loadControlFile cselectedIndexSTART=',cselectedIndexSTART[i]);

    // 栽培プログラム（終了）のファイルを探す
    cn=cp[ENDID].replace('./config/','');
    for( j = 0; j < cultiXMLlist.length; j++){
        // 完全一致
            if(cultiXMLlist[j]===cn){
            cselectedIndexEND[i] = j;
            console.log('loadControlFile XML Hit cultiXMLlist['+j+']='+cultiXMLlist[j]+' cn='+cn);
            break;
              }
          }// next j
        console.log('loadControlFile cselectedIndexEND=',cselectedIndexEND[i]);
    }// next i
    
    console.log('loadControlFile tselectedIndexSTART=',tselectedIndexSTART);
    console.log('loadControlFile tselectedIndexEND=',tselectedIndexEND);
    console.log('loadControlFile cselectedIndexSTART=',cselectedIndexSTART);
    console.log('loadControlFile cselectedIndexEND=',cselectedIndexEND);
    
    for(i=0;i<control.length;i++){
          var No=parseInt(control[i].split(',')[0].replace('No.',''));
    // オプションの要素を追加する
        delElements(No);
        addElements(No);
        
        var tform = document.forms['tformSTART'+No];             
        tform.list.selectedIndex=tselectedIndexSTART[No];
        
        tform = document.forms['tformEND'+No];     
        tform.list.selectedIndex=tselectedIndexEND[No];
        
        var cform = document.forms['cformSTART'+No];
        cform.list.selectedIndex=cselectedIndexSTART[No];

        cform = document.forms['cformEND'+No];
        cform.list.selectedIndex=cselectedIndexEND[No];
    }// next i
    
    
    // set calender
    //console.log('loadControlFile control =',control);
    //
    // STARTDAYとENDDAYの位置を探す
    No=0;
    for( i = 0; i < control.length; i++){
    console.log('loadControlFile contril[i]=',control[i] );
    cp=control[i].split(',');
    if(cp[cp.length-1]==='') cp.pop();
    // cp[0]=No.1
    No=parseInt(cp[0].replace('No.',''));
    STARTID='', ENDID='';
    for(j=0;j<cp.length;j++){
        console.log('loadControlFile STARTID cp[k]=',cp[j]);
        if(STARTID==='' && cp[j].indexOf('.xml')>=0){ STARTID=j-1; continue; }
        if(ENDID==='' && cp[j].indexOf('.xml')>=0){ ENDID=j-1; break;}
        }// next j
    console.log('loadControlFile STARTID=',STARTID,' ENDID=',ENDID );
    
    // set STARTDAY
    console.log('loadControlFile setCalenderDate No='+No+' STARTDAY['+STARTID+']='+cp[STARTID]);
    
    //    setCalenderDate(key,n, data)
    // set STARTDAY
    setCalenderDate('STARTDAY',No,cp[STARTID]);
    
    //console.log('loadControlFile getCalenderDate1 STARTDAY[',i,']=',getCalenderDate('STARTDAY',i));
    // set ENDDAY
    console.log('loadControlFile ENDDAY[',ENDID,']='+cp[ENDID]);
    setCalenderDate('ENDDAY',No,cp[ENDID]);
    No++;
    }// next i

/*
    No=parseInt(control[0].split(',')[0].replace('No.',''));
    if(tempXMLlist){
        dc=document.getElementById("nameTemp");
        if(dc) dc.innerHTML=tempXMLlist[tselectedIndexSTART[No]];
    }
    if(cultiXMLlist){
        dc=document.getElementById("name");
        if(dc) dc.innerHTML=cultiXMLlist[cselectedIndexSTART[No]];
    }
    if(loadTempData){
        dc=document.getElementById("commentTemp");
        if(dc) dc.innerHTML=loadTempData[tselectedIndexSTART[No]];  
        }
    if(loadCultiData){
        dc=document.getElementById("comment");
        if(dc) dc.innerHTML=loadCultiData[cselectedIndexSTART[No]];
        cp=control[0].split(',');
    }
    No=parseInt(cp[0].replace('No.',''));
    setInfo(No);//default
 */  
    state=true;
    
    if(f) f();
    });
}
    
function loadAllFile(f ){
    var filetxt='';
    control=[];
    loadCultiData=[];  // 栽培プログラムの記憶
    loadTempData=[];   // 温度プログラムの記憶

    var loadFileName=controlXMLlist[0];
    console.log('loadAllFile controlXMLlist '+controlXMLlist);
    if(isNaN(loadFileName)) loadFileName='saveLongPeriodControl.txt';
    loadFileName='./LongPeriodControl/'+loadFileName;
    console.log('loadAllFile loadFileName |'+loadFileName+'|');
    
    // loadFile  LongPeriodControl file
    $.getJSON(
    "/app/longperiodcontrol/command",//url
    {"command":'cat', "arg":[loadFileName]},//data
    function(data) {
    //dataがサーバから受け取るjson値
    $.each(data, 
    function(key, val) {
    rdata = val.replace(/<br>/g,'\n');
    console.log('loadAllFile rdata: |',rdata+'|');
    });
    
    var contents=rdata.replace(/\+/g,'\n');
    console.log('loadAllFile contents=',contents);
    // parse elements
    control=contents.split('EOL');
    control.pop();
    console.log('loadAllFile control=',control);

        listt=[];
        // 先ず、読み込みファイルリストを作成する
         for(var k=0;k<tempXMLlist.length;k++){
            listt.push('./schedule/'+tempXMLlist[k]);
         }
         
        listc=[];
         for(k=0;k<cultiXMLlist.length;k++){
            listc.push('./xml/'+cultiXMLlist[k]);
         }
         
         //console.log('loadAllFile listt='+listt);
         console.log('loadAllFile listt='+listt);
         console.log('loadAllFile listt.join='+listt.join(' '));
         console.log('loadAllFile listc='+listc);
         console.log('loadAllFile listc.join='+listc.join(' '));
         
        // 温度プログラム　読み込みファイルリストlisttの全内容を読み出す
            $.getJSON( 
            "/app/longperiodcontrol/command",//url
            {"command":'readFiles',"arg":[listt.join(' ')]},//data
            function(data) {
            //dataがサーバから受け取るjson値
            $.each(data,
            function(key, val) {
            rdata = val;
            });
            console.log('loadAllFile rdataORG='+rdata);
            rdata = rdata.replace(/<br>/g,',');
            rdata=rdata.split('FILE:');
            rlen=rdata.length;
            console.log('loadAllFile rdata0=',rdata);
            console.log('loadAllFile rdata0.length=',rdata.length);
            // 先頭要素を削除
            rdata=rdata.slice(1);
            console.log('loadAllFile rdata1=',rdata);
            console.log('loadAllFile rdata1.length=',rdata.length);
            // 末尾の,を削除
            for(i=0;i<rdata.length;i++){
                if(rdata[i][rdata[i].length-1]===',') rdata[i]=rdata[i].slice(0,-1);
            }
            console.log('loadAllFile rdata2=',rdata);
            console.log('loadAllFile rdata2.length=',rdata.length);
            // data size check
            if(listt.length !== rdata.length){
                console.log('loadAllFile rdata listt.length=',listt.length);// 17
                console.log('loadAllFile rdata rdata.length=',rdata.length);// 17
                console.log('Error');
                return;
            }
            loadTempData=[];            
            for(i=0;i<rdata.length;i++){
                var contents=rdata[i].replace(/<br>/g,'\n');
                console.log('loadAllFile contents='+contents);
                contents=contents.replace('./schedule/','');
                loadTempData.push(contents);// add loadTempData
            }// next i
                loadTempData=resortData(tempXMLlist, loadTempData);
                ////
                console.log('loadAllFile loadTempData='+loadTempData);
                console.log('loadAllFile loadTempData.length='+loadTempData.length);
                ////
            
            // 栽培プログラム　読み込みファイルリストlistcの全内容を読み出す
            $.getJSON(
            "/app/longperiodcontrol/command",//url
            {"command":"readFiles", "arg":[listc.join(' ')]},//data
            function(data) {
            //dataがサーバから受け取るjson値
            $.each(data,
            function(key, val) {
            rdata = val.replace(/<br>/g,',');
            });
            console.log('loadAllFile rdata=',rdata);  
            rdata=rdata.split('<!--?xml+version="1.0"+encoding="UTF-8"?-->');
            rlen=rdata.length;
            rdata=rdata.slice(1,rlen);
            console.log('loadAllFile listc rdata=',rdata);
            console.log('loadAllFile listc rdata.length=',rdata.length);
            console.log('loadAllFile listc listc.length=',listc.length);
            
            loadCultiData=[];
            for(i=0;i<rdata.length;i++){
                rdata[i]='<!--?xml+version="1.0"+encoding="UTF-8"?-->,'+rdata[i];
                document.getElementById("hide").innerHTML=rdata[i];
                document.getElementById("hide").visibility='hidden';
                //
                    var filename=listc[i].replace('./xml/','');
                    cultivationProgramRead( filename );
                    var txt=loadCultiData[i];
        
                    //rlen=txt.length;
                    //txt=txt.slice(1,rlen);
                    console.log('loadAllFile loadCultiData txt=',txt);
                    
                    loadCultiData.push(txt);
                        }
                     console.log('loadAllFile loadCultiData='+loadCultiData);
                     // resort loadCultiData as cultiXMLlist
                     loadCultiData=resortData(cultiXMLlist, loadCultiData);
                     
                    });// read CultiData files
            }); // read tempData files
         if(f) f();
    });   // read Control files
}

function resortData(list, data){
    var retdata=[];
    for(i=0;i<list.length;i++){
        var filenamel=list[i].split(',')[0];
        for(j=0;j<data.length;j++){
        var filenamed=data[j].split(',')[0];
        if( filenamel === filenamed ){
           // console.log('resortData Hit data['+i+']='+filenamed+' comp '+filenamel);
            retdata[i]=data[j];
            }
        }
    }
    console.log('resortData retdata=',retdata);
    return retdata;
}

function display1(){
    var cform = document.forms['cformSTART0'];
    if(!cform) return;
    var pd=cform.list.value;
    
    //アラート画面に表示
    var i=0, filename='', txt='';
    
    for(i=0;i<cultiXMLlist.length;i++){
        filename=cultiXMLlist[i].replace('./xml/','');
        if(filename.indexOf(pd)>=0){
            txt=loadCultiData[i].split(',');
            txt.shift();
            txt=txt.join(',');
            break;
        }
    }
    
    dc=document.getElementById("name");
    if(dc) dc.innerHTML=filename;
    
    dc=document.getElementById("comment");
    if(dc) dc.innerHTML=txt;
    console.log('display1 comment=',txt);
    
}

function display2(){
    var tform = document.forms['tformEND0']; 
    if(!tform) return;
    var pd=tform.list.value;
    //アラート画面に表示
    var i=0, filename='';
    for(i=0;i<tempXMLlist.length;i++){
    filename=tempXMLlist[i].replace('./schedule/','');
    if(filename.indexOf(pd)>=0){
        break;
        }
    }
    dc=document.getElementById("nameTemp");
    if(dc) dc.innerHTML=filename;
    //
    var txt=loadTempData[i].split(',');
    txt.shift();
    txt=txt.join(',');
    
    dc=document.getElementById("commentTemp");
    if(dc) dc.innerHTML=txt;
    console.log('display2 comment=',txt);
    
}

function lsControlDataFile( f ) {
    $.getJSON( 
    "/app/longperiodcontrol/command",//url
    {"command":"ls", "arg":['./LongPeriodControl/*.txt']},//data
    function(data) {
    $.each(data,
    function(key, val) {
    rdata = val;
    }
    );
    console.log('lsControlDataFile rdata='+rdata);
     rdata=rdata.replace(/.\/LongPeriodControl\//g,'');
     controlXMLlist=rdata.split('<br>');
     console.log('controlXMLlist='+controlXMLlist);
     
     // control list make
     var ls=document.getElementById("controllist");
     var flist='<table>';
     console.log('lsControlDataFile controlXMLlist.length='+controlXMLlist.length);
     if(controlXMLlist.length % 2 == 1) controlXMLlist.push('');
     for(i=0;i<controlXMLlist.length-1;i+=2){
         flist += '<tr><td  >['+i+']</td>'+'<td name="tag" >'+controlXMLlist[i]+'<td><td>['+(i+1)+']</td>'+'<td name="tag" >'+controlXMLlist[i+1]+'<td><tr>';
     }
    flist += '</table>';
    
    ls.innerHTML=flist;
    addListners();
    
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
        console.log("MouseDownFunc マウスがクリックされた (type:\"" + e.type + "\" button:" + e.button + 'target '+e.target + ") " + e.target.innerHTML);
            for(var i=0;i<elements.length;i++) elements[i].style.backgroundColor = "#ffffff";
        e.target.style.backgroundColor = "#22ff22";
    //    element_result.innerHTML = "マウスのボタンが押された (type:\"" + e.type + "\" button:" + e.button  + ' target '+e.target + ") " + e.target.innerHTML;
    }

    // ------------------------------------------------------------
    // マウスのボタンを離すと実行される関数
    // ------------------------------------------------------------
    function MouseUpFunc(e){
        console.log("MouseUpFunc マウスがクリックされた (type:\"" + e.type + "\" button:" + e.button + 'target '+e.target + ") " + e.target.innerHTML);
    //    e.target.style.backgroundColor = "#ffffff";
        filename = e.target.innerHTML;
        var it=document.getElementById('listinput');
        if(it) it.value=filename;
        //loadControlFile();
        //var ot=document.getElementById('output');
        //removefilename=filenameDate(filename);
        //console.log('|'+removefilename+'|');
        //if(ot) ot.innerHTML=removefilename;
    	//element_result.innerHTML = "マウスのボタンが離された (type:\"" + e.type + "\" button:" + e.button + 'target '+e.target+") " + e.target.innerHTML;
	}

	// ------------------------------------------------------------
	// クリックすると実行される関数
	// ------------------------------------------------------------
    function MouseClickFunc(e){
		console.log("MouseClickFunc マウスがクリックされた (type:\"" + e.type + "\" button:" + e.button + 'target '+e.target + ") " + e.target.innerHTML);
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
       //var series=0;
       // loadControlDataFile(filename, dataname, series);
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

function setInfo(id){
   console.log("setInfo ",id);
   InfoChangeSTART(id);
   InfoChangeEND(id);
}

// チェックボックスで指定されたファイルの内容を表示する
function InfoChangeSTART(id){
// culti
console.log('InfoChange id='+id);
var cform = document.forms['cformSTART'+id]; 
if(!cform) return;

var pd=cform.list.value
    var i=0, filename='', contents='';
    /*
    console.log('InfoChange cultiXMLlist='+cultiXMLlist);
    for(i=0;i<loadCultiData.length;i++){
    console.log('InfoChange loadCultiData['+i+']='+loadCultiData[i]);
    }
    */
    for(i=0;i<cultiXMLlist.length;i++){
    console.log('InfoChange cultiXMLlist='+cultiXMLlist[i]+' pd='+pd);
        if(cultiXMLlist[i]===pd){ 
            filename=pd;//.split(',')[0];
            contents=loadCultiData[i];
            break;
        }
    }

    console.log('InfoChange contents='+contents);

    if(contents===undefined){
        console.log('InfoChange contents is not found');
        return;
    }
  
  /* ここではない */
    console.log('InfoChange filename='+filename);
    console.log('InfoChange contents='+contents);
    var txt=contents.split(',');
    txt.shift();
    contents=txt.join(',');
    var dc=document.getElementById("comment");
        if(dc) dc.value=contents;
    dc=document.getElementById("name");
        if(dc) dc.value=filename;

// temp
    var tform = document.forms['tformSTART'+id]; 
    pd=tform.list.value   
    for(i=0;i<tempXMLlist.length;i++){
    console.log('InfoChange tempXMLlist='+tempXMLlist[i]);
        if(tempXMLlist[i]===pd){ 
            filename=tempXMLlist[i];//.split(',')[0];
            contents=loadTempData[i];
            break;
        }
    }

    filename = filename.replace('./schedule/','');
    //contents=contents.replace(filename+',','');
    console.log('InfoChange filename='+filename);
    console.log('InfoChange contents='+contents);
    //contents=contents.replace(filename+',','');
    dc=document.getElementById("commentTemp");
    txt=contents.split(',');
    txt.shift();
    contents=txt.join(',');
    
    if(dc) dc.value=contents;
    dc=document.getElementById("nameTemp");
    if(dc) dc.value=filename;

}

function InfoChangeEND(id){
// culti
    console.log('InfoChange id='+id);
var cform = document.forms['cformEND'+id]; 
 //       console.log('InfoChange  cform='+cform);
 
var pd=cform.list.value
    var i=0, filename='', contents='';
    console.log('InfoChangeEND cultiXMLlist='+cultiXMLlist);
    for(i=0;i<loadCultiData.length;i++){
    console.log('InfoChangeEND loadCultiData['+i+']='+loadCultiData[i]);
    }
    
    for(i=0;i<cultiXMLlist.length;i++){
    console.log('InfoChangeEND cultiXMLlist='+cultiXMLlist[i]+' pd='+pd);
        if(cultiXMLlist[i]===pd){ 
            filename=pd;//.split(',')[0];
            contents=loadCultiData[i];
            break;
        }
    }
    
    /* ここでもない */
    //console.log('InfoChange listc='+listc);
    console.log('InfoChangeEND filename='+filename);
    console.log('InfoChangeEND contents='+contents);
    //contents=contents.replace(filename+',','');
    var dc=document.getElementById("comment");
    if(dc) dc.value=contents;
    dc=document.getElementById("name");
    if(dc) dc.value=filename;
    
// temp
    var tform = document.forms['tformEND'+id]; 
    pd=tform.list.value   
    //アラート画面に表示
    //console.log('InfoChange pd='+pd);
    for(i=0;i<tempXMLlist.length;i++){
    console.log('InfoChangeEND tempXMLlist='+tempXMLlist[i]);
        if(tempXMLlist[i]===pd){ 
            filename=tempXMLlist[i];//.split(',')[0];
            contents=loadTempData[i];
            break;
        }
    }
    
    filename = filename.replace('./schedule/','');
    //contents=contents.replace(filename+',','');
    console.log('InfoChangeEND filename='+filename);
    console.log('InfoChangeEND contents='+contents);
    //contents=contents.replace(filename+',','');
    dc=document.getElementById("commentTemp");
    if(dc) dc.value=contents;
    dc=document.getElementById("nameTemp");
    if(dc) dc.value=filename;
}

function addElements(n) {
    if(!n){
    var activeList=getActiveElements();
    console.log('addElements activeList=',activeList);
    if(activeList.length > MaxScN-1){
        document.getElementById("Error").innerHTML=targetnum+'これ以上設定できません';
        return;
    }
        console.log('addElements active=',active);

        console.log('addElements targetnum0=',targetnum);
    // 空の番号
    targetnum=getEmptyElement();
        console.log('addElements targetnum1=',targetnum);

    addnum=activeList.length;
    
    } else targetnum=n;
    
    console.log('addElements targetnum2='+targetnum);
    // 予約
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
    // LABEL
    base_element.innerHTML = '<td class="No"><button name="Btn" onclick="delElements('+targetnum+')">X'+targetnum+'</button></td>';
    // start day
    base_element.innerHTML +='<td><input type="text" id="STARTDAY'+targetnum+'" value="2018:01:01"/></td>';
    // CultivationPrg
    var txt = '<td><form id="cformSTART'+targetnum+'"><select name="list" onChange="InfoChangeSTART('+targetnum+')">';
    for(k=0;k<cultiXMLlist.length;k++){
    txt +='<option value="'+cultiXMLlist[k]+'">'+cultiXMLlist[k]+'</option>';
    }
    txt += '</select></form></td>'
    base_element.innerHTML += txt;
    
    //  TempChedule
    txt = '<td><form id="tformSTART'+targetnum+'"><select name="list" onChange="InfoChangeSTART('+targetnum+')">';
    for(k=0;k<tempXMLlist.length;k++){
    txt +='<option value="'+tempXMLlist[k]+'">'+tempXMLlist[k]+'</option>';
    }
    txt += '</select></form></td>'    
    base_element.innerHTML += txt;

    base_element.innerHTML +='<td><input type="text" id="ENDDAY'+targetnum+'"   value="2018:01:02"/></td>';
    // CultivationPrg
    txt = '<td><form id="cformEND'+targetnum+'"><select name="list" onChange="InfoChangeEND('+targetnum+')">';
    for(k=0;k<cultiXMLlist.length;k++){
    txt +='<option value="'+cultiXMLlist[k]+'">'+cultiXMLlist[k]+'</option>';
    }
    txt += '</select></form></td>'
    base_element.innerHTML += txt;

    //  TempChedule
    txt = '<td><form id="tformEND'+targetnum+'"><select name="list" onChange="InfoChangeEND('+targetnum+')">';
    for(k=0;k<tempXMLlist.length;k++){
    txt +='<option value="'+tempXMLlist[k]+'">'+tempXMLlist[k]+'</option>';
    }
    txt += '</select></form></td>'    
    base_element.innerHTML += txt;

    base_element.innerHTML +='<td><input type="checkbox" id="DISPLAY'+targetnum+'"  onclick="setInfo('+targetnum+')"/></td>';

    base_element.appendChild(start_element);
    base_element.appendChild(end_element);

     if( state ){
    // list sort ///
    var options = {
      valueNames: [ 'No' ]
    };
    var userList = new List('settings', options);
    console.log('userList=',userList);
    userList.sort( 'No');
    /////
     }
    
var stable = $('#tableID');
    stable.append(base_element);
        

  
    //console.log('state='+state);
    // renumbering button
    //  完全に読み込むまで　リナンバリングはできない。
    /*
    if( state ){
    var p=document.getElementsByName('Btn');
    if(p){
    for(i=0;i<p.length;i++){
        p[i].innerHTML='X'+i;
        p[i].value='X'+i;
        //console.log('p.innerHTML='+p[i].innerHTML);
            }
        }
    }
    */
 addnum++;
 
  // 択一的なチェックボックスにする
  $('input[type=checkbox]').change(function() {
    $('input[type=checkbox]').prop('checked', false);
    $(this).prop('checked', true);
    console.log('check');
  });
     
    $('#STARTDAY'+targetnum).datetimepicker({
            format: 'Y-m-d',
            lang: 'ja',
            datepicker:true,
            timepicker:false,
            language: 'ja',
            closeOnDateSelect:true,
            
          onShow:function( ct ){
           this.setOptions({
            value:'設定時刻を選択'
           })
          },
          onSelect:function(date){
          //　設定されるたびにデータ取得する
            var d = date.getFullYear()+"/"+(date.getMonth()+1)+"/"+date.getDate();
            this.setOptions({
                    value:d
                });
            } 
        });
        
    $('#ENDDAY'+targetnum).datetimepicker({
            format: 'Y-m-d',
            datepicker:true,
            timepicker:false,
            language: 'ja',
            closeOnDateSelect:true,
            
          onShow:function( ct ){
           this.setOptions({
            value:'設定時刻を選択'
           });
          },
          onSelect:function(date){
          //　設定されるたびにデータ取得する
            var d = date.getFullYear()+"/"+(date.getMonth()+1)+"/"+date.getDate();
            this.setOptions({
                    value:d
                });
            }
        });

}

function getCalenderDate(key,n){
    // key 'STARTDAY' or 'ENDDAY'
    // id [0,1,2,3,..]
    var ids = key+n;
    var objs= $('#'+ids).datetimepicker('getDate');
    return objs.val();
}

function setCalenderDate(key,n, data){
    // key 'STARTDAY' or 'ENDDAY'
    // id [0,1,2,3,..]
    var ids = key+n;
    $('#'+ids).datetimepicker({value: data, format:'Y-m-d'});
}

function delElements(no) {
console.log('delElements no='+no);
    addnum--;
    active[no] = false;
    if(addnum <= 0) addnum=0;
    
    var p=document.getElementById('start'+no);
    if(p) p.remove();    
    p=document.getElementById('end'+no);
    if(p) p.remove();
    p=document.getElementById('base'+no);
    if(p) p.remove();
    
}

function fileRemove(){
    // 「OK」時の処理開始 ＋ 確認ダイアログの表示
    filename=document.getElementById('listinput').value;
    if(window.confirm(filename+'を本当に削除しますか？')){
    if(filename.indexOf('./LongPeriodControl/')<0) filename = './LongPeriodControl/'+filename;
    var dfd1=$.getJSON( 
    "/app/longperiodcontrol/command",//url
    {"command":"rmXML", "arg":[filename]});//data
     $.when(dfd1).done(function(data) {
//  処理
      var sdata='';
           $.each(data,
           function(key, val) {
           sdata = val;
    console.log("fileRemove sdata="+sdata);
           });
     });
    }
    console.log("fileRemove "+filename);
    var ls=document.getElementById("controllist");
         if(ls) ls.innerHTML='';
         
    lsAllList(loadAllFile());
    
    setTimeout(function() {
      console.log("loadControlFile");
      loadControlFile(setupInfo());
      console.log('loadCultiData ready=',loadCultiData);
    }, 1500);// 1秒くらい待たないといけない
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
