function go(){
//Enterキー
var req=document.getElementById("worktime").value;
if(window.event.keyCode==13){
    }
}

function cancel() {
     window.location.href="/";
}

function getTimeVal(a){
    t=a.split(':');
    return parseInt(t[0])*60+parseInt(t[1]);
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

function addElements() {
    // HTML
    var start_element = document.createElement('div');
    var start_id = 'start0';
    start_element.id = start_id;
    start_element.innerHTML =null;
    start_element.visibility = 'hidden';

    var end_element = document.createElement('div');
    var end_id = 'end0';
    end_element.id = end_id;
    end_element.innerHTML =null;
    end_element.visibility = 'hidden';

    var base_element = document.createElement('tr');
    var base_id = 'base0';
    base_element.id = base_id;
    
    // add class="No"
    base_element.innerHTML ='<td><input type="text" id="'+start_id+'"/><input style="width: 120px;" type="range" min="0" max="59" id="range0'+'" step="1" value="0" oninput="changeVal(0,this.value)" onchange="changeMin(0,this.value)"></><input style="width: 15px;" type="text" id="lv0" value="0" onchange="changeMin(0,this.value)" ></></td>';
    
    base_element.appendChild(start_element);
    base_element.appendChild(end_element);
    
    // body要素にdivエレメントを追加
    var stable = $('#tableID');
    stable.append(base_element); 

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
          changeVal(0,0);
          changeRange(0,0);
          var t=tt.split(' ')[4].split(':')[0]+':'+tt.split(' ')[4].split(':')[1];
          console.log(t);
          changeTime(0,t);
          } 
        });       
}

function getITBOXTime(f) {
    console.log('getITBOXTime');
    $.getJSON( 
    "/app/settime/command",//url
    {"command":"getITBOXTime.py", "arg":['']},//data
    function(data) {
    //dataがサーバから受け取るjson値
        $.each(data, 
        function(key, val) {
          rdata = val.split('<br>');
        });
        console.log('getITBOXTime t='+rdata);
        changeTime(0, rdata[0])
        if(f) f();
    });    
}


function getITPLANTERTime(f) {
    console.log('getITPLANTERTime');
    $.getJSON( 
    "/app/settime/command",//url
    {"command":"sendcom", "arg":['-e','G']},//data
    function(data) {
    //dataがサーバから受け取るjson値
        $.each(data, 
        function(key, val) {
          rdata = val.split('<br>');
        });
        console.log('getITPLANTERTime t='+rdata[1]);
        setITPLANTERClock(rdata)
        if(f) f();
    });    
}

var dtime='';

function setITPLANTERClock(time){
    var p=document.getElementById('setITPLANTERClock');
    if(p){
        var t = time[1].split(' ');
        dtime=t[1]+':'+t[3]+':'+t[5];
        p.innerHTML=dtime;
        console.log('setITPLANTERClock t='+dtime);
    }
}

function setITBOXTime(f) {
    t = getTime(0);
    console.log('setITBOXTime t='+t);
    $.getJSON( 
    "/app/settime/command",//url
    {"command":"setITBOXTime.py", "arg":[t]},//data
    function(data) {
    //dataがサーバから受け取るjson値
        $.each(data, 
        function(key, val) {
          rdata = val.split('<br>');
        });
        changeTime(0, rdata[0])
        if(f) f();
    });    
}

function copyTime(){
    $.getJSON( 
    "/app/settime/command",//url
    {"command":"setITBOXTime.py", "arg":[dtime]},//data
    function(data) {
    //dataがサーバから受け取るjson値
        $.each(data, 
        function(key, val) {
          rdata = val.split('<br>');
        });
        changeTime(0, rdata[0])
        if(f) f();
    }); 
}

$(document).ready( function() {

    addElements(); 
    getITBOXTime();
    getITPLANTERTime();
    setInterval( function(){
       getITBOXTime();
       getITPLANTERTime();
   },10000);
   
});