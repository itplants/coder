
$(document).ready( function() {

    //This code will run after your page loads
    setTemp('');
    draw_Metors();
});

function setTemp(arg) {
    $.getJSON(
    "/app/tempcontroller/command",//url
    {"command":"setTemp", "arg":[arg]},//data
    function(data) {
    //dataがサーバから受け取るjson値
    $.each(data, 
    function(key, val) {
    rdata = val.split('<br>');
    //
    //dt=new Date();
    //
    var targetT=rdata[0].split(' ')[1];
    if( !isFinite(targetT) ) setTemp(arg);
    console.log(targetT);
    //document.getElementById('curtmp').innerHTML='現在の温度 : '+targetT+'度';
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

//https://raspberrypi4.local:8091/app/bme280
//https://raspberrypi4.local:8091/app/ds18b20
//https://raspberrypi4.local:8091/app/tsl2561
function draw_Metors()
{
        var p = document.getElementById('meters');
        doc = '<center><iframe scrolling="no" width=1024 height=300 src="https://'+window.location.hostname+':8091/app/bme280"  name="thermometer" frameborder="0" ></iframe>';
        doc +='<iframe scrolling="no" width=700 height=300 src="https://'+window.location.hostname+':8091/app/ds18b20"  name="watermeter" frameborder="0"></iframe>';
        doc += '<iframe scrolling="no" width=1024  height=300 src="https://'+window.location.hostname+':8091/app/tsl2561"  name="illuminometer" frameborder="0"></iframe></center>';
        p.innerHTML=doc;
}

