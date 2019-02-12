function message(mes)
{
if ($(document))
  {
      document.getElementById("message").innerHTML=mes;
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

function lsusb( cmd ){
    rdata='';
    $.ajaxSetup({ async: false });
    $.getJSON( 
    "/app/servercheck/command",//url
    {"command":"lsusb", "arg":''},//data
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

for(i=0;i<rdata.length;i++){
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
          //rdata=rdata.replace(',','');
           for(var i=0;i<rdata.length;i++){
           list.innerHTML+=rdata[i];
           }
       }
    }
    );
    $.ajaxSetup({ async: true });
}

function reboot( cmd ){
            // 「OK」時の処理開始 ＋ 確認ダイアログの表示
    if(window.confirm('iTelepass2を本当に再起動しますか？')){

    $.ajaxSetup({ async: false });
    $.getJSON( 
    "/app/servercheck/command",//url
    {"command":"reboot", "arg":''},//data
    function(data) {
    //dataがサーバから受け取るjson値
    $.each(data, 
    function(key, val) {
    rdata = val;
    }
    );
       psmjpgstreamer('');// psdataCapture
    }
    );
    $.ajaxSetup({ async: true });
    }
}

function ttyjsCtl( cmd ){
    $.ajaxSetup({ async: false });
    $.getJSON( 
    "/app/servercheck/command",//url
    {"command":"restartTTYJS", "arg":cmd},//data
    function(data) {
    //dataがサーバから受け取るjson値
    $.each(data, 
    function(key, val) {
    rdata = val;
    }
    );
       psttyjs('');// psdataCapture
    }
    );
    $.ajaxSetup({ async: true });
}


function psttyjs( req ) {
    // message("command:"+req);
    $.ajaxSetup({ async: false });
    $.getJSON( 
    "/app/servercheck/command",//url
    {"command":"psttyjs", "arg":req},//data
    function(data) {
    //dataがサーバから受け取るjson値
    $.each(data, 
    function(key, val) {
    rdata = val;
    }
    );
    messageTTYJS(rdata.split('<br>')[0]);
    return rdata;
    }
    );
    $.ajaxSetup({ async: true });
}




function mjpgStreamerCtl( cmd ){
    $.ajaxSetup({ async: false });
    $.getJSON( 
    "/app/servercheck/command",//url
    {"command":"restartMjpgStreamer", "arg":cmd},//data
    function(data) {
    //dataがサーバから受け取るjson値
    $.each(data, 
    function(key, val) {
    rdata = val;
    }
    );
       psmjpgstreamer('');// psdataCapture
    }
    );
    $.ajaxSetup({ async: true });
}



function dataCaptureCtl( cmd ){
    $.ajaxSetup({ async: false });
    $.getJSON( 
    "/app/servercheck/command",//url
    {"command":"restartDataCapture", "arg":cmd},//data
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
    $.ajaxSetup({ async: true });
}

// psmjpgstreamer
function psmjpgstreamer( req ) {
    // message("command:"+req);
    $.ajaxSetup({ async: false });
    $.getJSON( 
    "/app/servercheck/command",//url
    {"command":"psmjpgstreamer", "arg":req},//data
    function(data) {
    //dataがサーバから受け取るjson値
    $.each(data, 
    function(key, val) {
    rdata = val;
    }
    );
    messageMJPG(rdata.split('<br>')[0]);
    return rdata;
    }
    );
    $.ajaxSetup({ async: true });
}

function psdataCapture( req ) {
    // message("command:"+req);
    $.ajaxSetup({ async: false });
    $.getJSON( 
    "/app/servercheck/command",//url
    {"command":"psdataCapture", "arg":req},//data
    function(data) {
    //dataがサーバから受け取るjson値
    $.each(data, 
    function(key, val) {
    rdata = val;
    }
    );
    message(rdata);
    return rdata;
    }
    );
    $.ajaxSetup({ async: true });
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
    }
    );
       resultmessage(rdata);
    }
    );
    return rdata;
}



$(document).ready( function() {

   psdataCapture('');
   psmjpgstreamer('');
   psttyjs('');
   lsusb('');

});