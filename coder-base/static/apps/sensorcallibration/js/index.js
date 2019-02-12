var tempCoeff=[1];
var illumCoeff=[1];
var cSerial=['XXXX'];
var cTemp=[0];
var cIllum=[0];
var cWater=[0];
var cWaterEmpty=[0];
var cWaterFull=[0];
var itpNo=1;
var citpNo=0;
var configFile='config/calibration.txt';

$(document).ready( function() {

    loadData(loadInfor(setITPRadioBtn()));
    
    document.getElementById('mm').innerHTML='<a href="https://'+location.hostname+':8091/app/meters">メーターを表示</a>';
    document.getElementById('m1').innerHTML='<a href="https://'+location.hostname+':8091/app/highchartgraph">グラフを表示</a>';
    document.getElementById('m2').innerHTML='<a href="https://'+location.hostname+':8091/app/highchartscatter">散布図を表示</a>';
 /*
    setInterval(function(){
        loadInfor(display_value());
    },5000);
    */
  //  setTimeout(loadInfor(display_value()), 1000);

});

///

function changePlanterNo(p){
    console.log('p='+p.id);
    console.log('p='+p.value);
    citpNo=p.id;
}


function setITPRadioBtn(f){

console.log('nitp0='+itpNo);
    
    var parentITP=document.getElementById('Planter');
for(var i=0; i<itpNo; i++){
var labelelement = document.createElement('label'); 
    labelelement.for="planter";
    labelelement.id="searchtitle";
    labelelement.innerHTML=' '+(i+1); 
        var element = document.createElement('input'); 
        element.type = 'checkbox'; 
        element.id = 'itp'+i; 
        element.name = 'planter'; 
        element.value = i;
        element.onChange='changePlanterNo(this);';// ????? //
        if(i===0) element.checked='checked';
 
        labelelement.appendChild(element);
        parentITP.appendChild(labelelement);
    }
    if(f) f();
    return itpNo;
}


function selectFirstPlanter(){
    for(var i=1; i<itpNo; i++){
     var radio=document.getElementById('itp'+i);
    radio.checked=false;
    }
}

function selectAllPlanter(){

    for(var i=0; i<itpNo; i++){
     var radio=document.getElementById('itp'+i);
     radio.checked='checked';
    }
}
/////
/*
function loadInfor(f){
         getTemp(getIllum(getWater(getSerial(getPlanterNo(display_value(f))))));
}
*/
function loadInfor(callback){
    $.getJSON( 
    "/app/sensorcallibration/command",//url
    {"command":"getITPSensors", "arg":['']},//data
    function(data) {
    //dataがサーバから受け取るjson値
    $.each(data, 
    function(key, val) {
    rdata = val;
    });
    var w=rdata.split('<br>');
        
    //console.log('loadInfor w=|'+w+'|'); 
    var arg=w[0].split(' ');
    for(var i=0;i<arg.length;i+=2){
    if(arg[i].indexOf('serial')>=0){
        cSerial[citpNo]=arg[i+1];
        document.getElementById('Serial').innerHTML=cSerial[citpNo];
    //console.log('argZ='+cSerial);
    }
    if(arg[i].indexOf('Temp')>=0){
    //console.log('argA='+arg[i+1]);
        cTemp[citpNo]=arg[i+1];
        document.getElementById('curr_temp').innerHTML=cTemp[citpNo];
        settemp(13);
    //console.log('argA='+cTemp[citpNo]);
    }
    if(arg[i].indexOf('Water')>=0){
    //console.log('argB='+rdata);
        cWater[citpNo]=arg[i+1];
        document.getElementById('curr_waterfull').innerHTML=cWater[citpNo];
        document.getElementById('curr_waterempty').innerHTML=cWater[citpNo];
        setempty(13);
        setfull(13);
    //console.log('argB='+cWater[citpNo]);
    }
    if(arg[i].indexOf('illum')>=0){
    //console.log('argF='+w[1]);
    cIllum[citpNo]=arg[i+1];
    document.getElementById('curr_illum').innerHTML=cIllum[citpNo];
    setillum(13);
    //console.log('argF='+cIllum[citpNo]);
    }
    if(arg[i].indexOf('ndevices')>=0){
    itpNo=arg[i+1];
    //console.log('itpNo='+itpNo);
    }

    }
//    display_value();
    if(callback) callback();
    });
}

var tempSet=0;
var waterFullSet=0;
var waterEmptySet=0;
var waterCoeff1=0;
var waterCoeff2=0;
var illumSet=0;

function settemp(code){
    if(13 === code){
    tempSet=document.getElementById("correcttemp").value;
    console.log(tempSet);
    tempCoeff[citpNo]=tempSet/cTemp[citpNo];
    var t = Math.round(tempCoeff[citpNo]*100) / 100;
    document.getElementById("tempcoeff").innerHTML=t;
    setSensor();
    }
}

function setillum(code){
    if(13 === code){
    illumSet=document.getElementById("correctillum").value;
    console.log(illumSet);
    illumCoeff[citpNo]=illumSet/cIllum[citpNo];
    var i = Math.round(illumCoeff[citpNo]*100) / 100;
    document.getElementById("illumcoeff").innerHTML=i;
    setSensor();
    }
}

function setempty(code){
    if(13 === code){
    waterEmptySet=document.getElementById("correctwaterempty").value;
    console.log(waterEmptySet);
    waterCoeff1=waterEmptySet-cWater[citpNo];
    var e = Math.round(waterCoeff1*100) / 100;
    document.getElementById("waterempty").innerHTML=e;
    setSensor();
    }
}

function setfull(code){
    if(13 === code){
    waterFullSet=document.getElementById("correctwaterfull").value;
    console.log(waterFullSet);
    waterCoeff2=waterFullSet-cWater[citpNo];
    var w = Math.round(waterCoeff2*100) / 100;
    document.getElementById("waterfull").innerHTML=w;
    setSensor();
    }
}

function setSensor(){
    var t=(cTemp[citpNo]*tempCoeff[citpNo])*100;
    t = Math.round(t) / 100;
    document.getElementById("T").innerHTML=t;
    //(v-Offset)*Coefficient
    // waterEmptySet
    // waterFullSet
    var w=(cWater[citpNo]-waterEmptySet)/(waterFullSet-waterEmptySet)*100;
    w = Math.round(w);
    document.getElementById("W").innerHTML=w;
    var i=cIllum[citpNo]*illumCoeff[citpNo];
    i = Math.round(i) ;
    document.getElementById("I").innerHTML=i;
    
  //  saveData();
}


function delData(){
       $.getJSON( 
    "/app/sensorcallibration/command",//url
    {"command":"rmXML", "arg":['config/calibration.txt']},//data
    function(data) {
    $.each(data, 
    function(key, val) {
    rdata = val;
    }
    );
    console.log(rdata);
    }
    );
}

function display_value(f){
    //cTemp=30;
    //cWater=40;

    console.log('----display_value----');
    console.log('cSerial:'+cSerial[citpNo]);
    console.log('cTemp:'+cTemp[citpNo]);
    console.log('cWaterEmpty:'+cWaterEmpty[citpNo]);
    console.log('cWaterFull:'+cWaterFull[citpNo]);
    console.log('cWater:'+cWater[citpNo]);
    console.log('cIllum:'+cIllum[citpNo]);
    console.log('itpNo:'+itpNo);

//
    document.getElementById('Serial').innerHTML=cSerial[citpNo];
    document.getElementById('curr_temp').innerHTML=cTemp[citpNo];
    document.getElementById('curr_waterempty').innerHTML=cWater[citpNo];
    document.getElementById('curr_waterfull').innerHTML=cWater[citpNo];
    document.getElementById('curr_illum').innerHTML=cIllum[citpNo];
    //if(f) f();
}

function saveData(){
    console.log('saveData');
    tempSet=document.getElementById('correcttemp').value;
    waterEmptySet=document.getElementById('correctwaterempty').value;
    waterFullSet=document.getElementById('correctwaterfull').value;
    illumSet=document.getElementById('correctillum').value;
    //
    var arg=[cSerial[citpNo],tempSet,waterEmptySet,waterFullSet,illumSet,tempSet/cTemp[citpNo],illumSet/cIllum[citpNo]];
    console.log(arg);
    writeFileSync(configFile,arg);
}

//writeFileSync
function writeFileSync( file, data, f ) {
 //   $.ajaxSetup({ async: false });
    $.getJSON( 
    "/app/sensorcallibration/writeFileSync",//url
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

function loadData(f){
    //
    var arg=[];
    
    $.getJSON( 
    "/app/sensorcallibration/command",//url
    {"command":"cat", "arg":[configFile]},//data
    function(data) {
    //dataがサーバから受け取るjson値

    $.each(data, 
    function(key, val) {
    rdata = val;
    }
    );
    console.log(rdata);
    data=rdata.split('<br>');
// itpNo  
    var d=data[0].split(',');
    cSerial[citpNo]=d[0];
    tempSet=d[1];
    waterEmptySet=d[2];
    waterFullSet=d[3];
    illumSet=d[4];
    
    document.getElementById('correcttemp').value=tempSet;
    document.getElementById('correctwaterempty').value=waterEmptySet;
    document.getElementById('correctwaterfull').value=waterFullSet;
    document.getElementById('correctillum').value=illumSet;

    console.log('loadData:',rdata);
    

    if(f) f();
    }
    );
}

function getPlanterNo(callback){
    console.log('getPlanterNo');
    itpNo=sendcom(['1','-e','D'],callback);
}

function getSerial(callback){
    cSerial[citpNo]=sendcom(['1','-e','Z'],callback);
}

function getTemp(callback){
    cTemp[citpNo]=sendcom(['1','-e','A'],callback);
}

function getIllum(callback){
    cIllum[citpNo]=sendcom(['1','-e','F'],callback);
}
function getWater(callback){
    cWater[citpNo]=sendcom(['1','-e','B'],callback);
}

function sendcom(arg,callback){
    console.log('sendcom:',arg);
    $.getJSON( 
    "/app/sensorcallibration/command",//url
    {"command":"sendcom", "arg":arg},//data
    function(data) {
    //dataがサーバから受け取るjson値
    $.each(data, 
    function(key, val) {
    rdata = val;
    });
    console.log('sendcom rdata='+rdata);
    var w=rdata.split('<br>');
    
    //console.log('w='+w);
    //
    if(arg[2]==='Z'){
    cSerial[citpNo]=w[1];
    //console.log('argZ='+cSerial);
    }
    if(arg[2]==='A'){
    //console.log('argA='+w[1]);
    cTemp[citpNo]=w[1].split(' ')[1];
    //console.log('argA='+cTemp);
    }
    if(arg[2]==='B'){
    //console.log('argB='+rdata);
    cWater[citpNo]=w[1].split(' ')[1];
    console.log('argB='+cWater[citpNo]);
    }
    if(arg[2]==='F'){
    //console.log('argF='+w[1]);
    cIllum[citpNo]=w[1].split(' ')[1];
    //console.log('argF='+cIllum);
    }
    if(arg[2]==='D'){
    console.log('argD='+w[1]);
    itpNo=w[1].split('  ')[1];
    console.log('itpNo='+itpNo);
    }
    
//    display_value();
    if(callback) callback();
    
    if(arg[2]==='Z') return w[1];
    else return w[1].split('  ')[1];
    });


}



