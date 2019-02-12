/*
$.ajax({
  timeout: 3000 //3 second timeout
});
*/

function message(mes)
{
if ($(document))
  {
      document.getElementById("message").innerHTML=mes;
  }
}

function messageHTTPD(mes)
{
if ($(document))
  {
      document.getElementById("messageHTTPD").innerHTML=mes;
  }
}

function messageTempController(mes)
{
if ($(document))
  {
      document.getElementById("messageTempController").innerHTML=mes;
  }
}

function messageLongPeriodControl(mes)
{
if ($(document))
  {
      document.getElementById("messageLongPeriodControl").innerHTML=mes;
  }
}

function messageLongPeriodSchedule(mes)
{
if ($(document))
  {
      document.getElementById("messageLongPeriodSchedule").innerHTML=mes;
  }
}

function messageShortPeriodControl(mes)
{
if ($(document))
  {
      document.getElementById("messageShortPeriodControl").innerHTML=mes;
  }
}
function messageShortPeriodControl(mes)
{
if ($(document))
  {
      document.getElementById("messageShortPeriodControl").innerHTML=mes;
  }
}

function messageMJPG(mes)
{
if ($(document))
  {
      document.getElementById("messageMJPG").innerHTML=mes;
  }
}


function messageTTYJS(mes)
{
if ($(document))
  {
      document.getElementById("messageTTYJS").innerHTML=mes;
  }
}

var rdata='';

function lsusb( f ){
    rdata='';
    $.ajaxSetup({ async: false });
    $.getJSON( 
    "/app/servercheck/command",//url
    {"command":"lsusb", "arg":['']},//data
    function(data) {
    //dataがサーバから受け取るjson値
    $.each(data, 
    function(key, val) {
    rdata += val;
    }
    );
    var sdata='';
    for(var i=0;i<rdata.length;i++) sdata += rdata[i];
    rdata=sdata;
//console.log('sdata='+sdata);
    rdata=rdata.split('<br>');

//console.log('rdata='+rdata);

    for( i=0;i<rdata.length;i++){
//console.log('rdata['+i+'}='+rdata[i]);
        if(rdata[i].indexOf('ID 250f:000a')>0){
//            console.log('Hit['+i+']='+rdata[i]);
        rdata[i] += 'itplants,ltd.  ittplanter-02'+'<br>';
        } else rdata[i] += '<br>';
    }

//    rdata=rdat.join('<br>');
    
       var list=document.getElementById('USBlist');
       if(list){
//    console.log(rdata);
            list.innerHTML=''
          //rdata=rdata.replace(',','');
           for( i=0;i<rdata.length;i++){
           list.innerHTML+=rdata[i];
           }
       }
    }
    );
    if(f) f();
}

function reboot( f ){
            // 「OK」時の処理開始 ＋ 確認ダイアログの表示
    if(window.confirm('iTelepass03.localを本当に再起動しますか？')){

    $.ajaxSetup({ async: false });
    $.getJSON( 
    "/app/servercheck/command",//url
    {"command":"reboot", "arg":['']},//data
    function(data) {
    //dataがサーバから受け取るjson値
    $.each(data, 
    function(key, val) {
    rdata = val;
    });
       psmjpgstreamer();// psdataCapture
    });
    if(f) f();
    }
}

function tempControllerCtl( cmd, f ){
    $.getJSON( 
    "/app/servercheck/command",//url
    {"command":"restartTempController", "arg":[cmd]},//data
    function(data) {
    //dataがサーバから受け取るjson値
    $.each(data, 
    function(key, val) {
    rdata = val;
    });
      messageTempController(rdata.split('<br>')[0]);
    });
    if(f) f();
}

function LongPeriodControlCtl( cmd, f ){
    $.getJSON( 
    "/app/servercheck/command",//url
    {"command":"restartLongPeriodControl", "arg":[cmd]},//data
    function(data) {
    //dataがサーバから受け取るjson値
    $.each(data, 
    function(key, val) {
    rdata = val;
    });
      messageLongPeriodControl(rdata.split('<br>')[0]);
    });
    if(f) f();
}

function ShortPeriodControlCtl( cmd, f ){
    $.getJSON( 
    "/app/servercheck/command",//url
    {"command":"restartShortPeriodControl", "arg":[cmd]},//data
    function(data) {
    //dataがサーバから受け取るjson値
    $.each(data, 
    function(key, val) {
    rdata = val;
    });
      messageShortPeriodControl(rdata.split('<br>')[0]);
    });
    if(f) f();
}

function LongPeriodScheduleCtl( cmd, f ){
    $.getJSON( 
    "/app/servercheck/command",//url
    {"command":"restartLongPeriodSchedule", "arg":[cmd]},//data
    function(data) {
    //dataがサーバから受け取るjson値
    $.each(data, 
    function(key, val) {
    rdata = val;
    });
      messageLongPeriodSchedule(rdata.split('<br>')[0]);
    });
    if(f) f();
}


function httpdCtl( cmd, f ){
    $.getJSON( 
    "/app/servercheck/command",//url
    {"command":"restartHTTPD", "arg":[cmd]},//data
    function(data) {
    //dataがサーバから受け取るjson値
    $.each(data, 
    function(key, val) {
    rdata = val;
    });
      // psttyjs('');// psdataCapture
      messageHTTPD(rdata.split('<br>')[0]);
    });
    if(f) f();
}

function ttyjsCtl( cmd,f ){
    $.getJSON( 
    "/app/servercheck/command",//url
    {"command":"restartTTYJS", "arg":[cmd]},//data
    function(data) {
    //dataがサーバから受け取るjson値
    $.each(data, 
    function(key, val) {
    rdata = val;
    });
    console.log(rdata);
    messageTTYJS(rdata.split('<br>')[0]);
     //  psttyjs('');// psdataCapture
    });
    if(f) f();
}


function psttyjs( f ) {
    $.getJSON( 
    "/app/servercheck/command",//url
    {"command":"psttyjs", "arg":['']},//data
    function(data) {
    //dataがサーバから受け取るjson値
    $.each(data, 
    function(key, val) {
    rdata = val;
    });
    messageTTYJS(rdata.split('<br>')[0]);
    });
    if(f) f();
}

function pstempController( f ) {
    $.getJSON( 
    "/app/servercheck/command",//url
    {"command":"psTempController", "arg":['']},//data
    function(data) {
    //dataがサーバから受け取るjson値
    $.each(data, 
    function(key, val) {
    rdata = val;
    });
    console.log('pstempController '+rdata);
    messageTempController(rdata.split('<br>')[0]);
    });
    if(f) f();
}

function psLongPeriodControl( f ) {
    $.getJSON( 
    "/app/servercheck/command",//url
    {"command":"psLongPeriodControl", "arg":['']},//data
    function(data) {
    //dataがサーバから受け取るjson値
    $.each(data, 
    function(key, val) {
    rdata = val;
    });
    console.log('psLongPeriodControl '+rdata);
    messageLongPeriodControl(rdata.split('<br>')[0]);
    });
    if(f) f();
}

function psShortPeriodControl( f ) {
    $.getJSON( 
    "/app/servercheck/command",//url
    {"command":"psShortPeriodControl", "arg":['']},//data
    function(data) {
    //dataがサーバから受け取るjson値
    $.each(data, 
    function(key, val) {
    rdata = val;
    });
    console.log('psShortPeriodControl '+rdata);
    messageShortPeriodControl(rdata.split('<br>')[0]);
    });
    if(f) f();
}

function psLongPeriodSchedule( f ) {
    $.getJSON( 
    "/app/servercheck/command",//url
    {"command":"psLongPeriodSchedule", "arg":['']},//data
    function(data) {
    //dataがサーバから受け取るjson値
    $.each(data, 
    function(key, val) {
    rdata = val;
    });
    console.log('psLongPeriodSchedule '+rdata);
    messageLongPeriodSchedule(rdata.split('<br>')[0]);
    });
    if(f) f();
}

function mjpgStreamerCtl(cmd, f ){
    $.getJSON( 
    "/app/servercheck/command",//url
    {"command":"restartMjpgStreamer", "arg":[cmd]},//data
    function(data) {
    //dataがサーバから受け取るjson値
    $.each(data, 
    function(key, val) {
    rdata = val;
    }
    );
       psmjpgstreamer();// psdataCapture
    }
    );
    if(f) f();
}

function dataCaptureCtl( cmd,f ){
    $.getJSON( 
    "/app/servercheck/command",//url
    {"command":"restartDataCapture", "arg":[cmd]},//data
    function(data) {
    //dataがサーバから受け取るjson値
    $.each(data, 
    function(key, val) {
    rdata = val;
    }
    );
       psdataCapture('');// psdataCapture
    }
    );
    if(f) f();
}

// psHTTPD
function psHTTPD( f ) {
    $.getJSON( 
    "/app/servercheck/command",//url
    {"command":"psHTTPD", "arg":['']},//data
    function(data) {
    //dataがサーバから受け取るjson値
    $.each(data, 
    function(key, val) {
    rdata = val;
    });
    messageHTTPD(rdata.split('<br>')[0]);
    });
    if(f) f();
}

// psmjpgstreamer
function psmjpgstreamer( f ) {
    $.getJSON( 
    "/app/servercheck/command",//url
    {"command":"psmjpgstreamer", "arg":['']},//data
    function(data) {
    //dataがサーバから受け取るjson値
    $.each(data, 
    function(key, val) {
    rdata = val;
    }
    );
    console.log("mpjg "+rdata);
    messageMJPG(rdata.split('<br>')[0]);
    });
    if(f) f();
}

function psdataCapture( f ) {
    $.getJSON( 
    "/app/servercheck/command",//url
    {"command":"psdataCapture", "arg":['']},//data
    function(data) {
    //dataがサーバから受け取るjson値
    $.each(data, 
    function(key, val) {
    rdata = val;
    });
    message(rdata);
    });
    if(f) f();
}

function addfile( f1, f2 ) {
    $.ajaxSetup({ async: false });
    $.getJSON( 
    "/app/servercheck/filePutContents",//url
    {"command":"addfile", "arg":[f1,f2]},//data
    function(data) {
    //dataがサーバから受け取るjson値

    $.each(data, 
    function(key, val) {
    rdata = val;
    });
       resultmessage(rdata);
    });
}

function scan(){
console.log('Scan');
   psHTTPD();
console.log('Scan1');
   psdataCapture();
console.log('Scan2');
   psLongPeriodControl();
console.log('Scan3');
   psShortPeriodControl();
console.log('Scan4');
   psLongPeriodSchedule();
console.log('Scan5');
   psmjpgstreamer();
console.log('Scan6');
   psttyjs();
console.log('Scan7');
   pstempController();
console.log('Scan8');
   lsusb();
console.log('Scan9');
}

function reload(){
    console.log('reload');
    location.reload();
}

$(document).ready( function() {
    scan();
    // get state every 3sec  
    setInterval(function() {
    scan();
    }, 3000);
  
});