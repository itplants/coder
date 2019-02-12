if (String.prototype.format === undefined) {
  String.prototype.format = function(arg)
  {
    var rep_fn;
    
    if (typeof arg == "object") {
      rep_fn = function(m, k) { return arg[k]; }
    }
    else {
      var args = arguments;
      rep_fn = function(m, k) { return args[ parseInt(k) ]; }
    }
    return this.replace( /\{(\w+)\}/g, rep_fn );
  }
}

function tempControllerCtl( cmd ){
    $.ajaxSetup({ async: false });
    $.getJSON( 
    "/app/servercheck/command",//url
    {"command":"restartTempController", "arg":[cmd]},//data
    function(data) {
    //dataがサーバから受け取るjson値
    $.each(data, 
    function(key, val) {
    rdata = val;
    }
    );
      messageTempController(rdata.split('<br>')[0]);
    }
    );
    $.ajaxSetup({ async: true });
}


function makeTable() {
    $.getJSON(
    "/app/boxstatus/command",//url
    {"command":"cat", "arg":['./config/statusTempController.txt']},//data
    function(data) {
    //dataがサーバから受け取るjson値
    $.each(data, 
    function(key, val) {
    rdata = val.split('<br>');
    //console.log(rdata);
    document.getElementById('timedate').innerHTML=rdata[0];
    //
    timeDate=new Date();
    timeDate2=Date.parse(rdata[0]);
    timeDate3=Date.parse(timeDate);
    console.log(timeDate);
    console.log(timeDate2);
    console.log(timeDate3);
    
    if(Math.abs(timeDate2-timeDate3)>10000){
    //document.getElementById('warn').innerHTML='tempController dose not work!!'; 
    //tempControllerCtl('restart');
    }
    for(i=1;i<rdata.length;i++){
    var keyword = rdata[i].split(' ')[0];
    var value = rdata[i].split(' ')[1];
    if(rdata[i].indexOf('EOF')===0) continue;
    
    if(rdata[i].indexOf('currentTemp')===0){
        if(value === 0) return;    
        }
    console.log('key '+keyword+' '+value);
    if(rdata[i].indexOf(keyword)===0){
        document.getElementById(keyword).innerHTML=value;    
        }
    if(rdata[i].indexOf('pwm')===0){
         str = parseFloat(parseInt(value)/10.0);
        document.getElementById(keyword).innerHTML= str;    
        }
        
        }
    });
    });
}

function updateStatus(){
    $.getJSON(
    "/app/boxstatus/command",//url
    {"command":"touch", "arg":['./config/queryTempController.txt']},//data
    function(data) {
    //dataがサーバから受け取るjson値
    $.each(data, 
    function(key, val) {
    rdata = val.split('<br>');
/*    
    var sleep = require('sleep-async')();
    console.log("before");
        sleep.sleep(3000, function(){
        makeTable();
    console.log("after");
    });
*/
    });
    });
}
    
$(document).ready( function() {
    makeTable();
    /*
    //This code will run after your page loads
    setInterval(function() {
        updateStatus();
    }, 10000);
    */
    setInterval(function() {
        makeTable();
    }, 30000);
});