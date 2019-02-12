$(document).ready( function() {
    // 60sec毎にコマンドを送る。LEDの瞬間点滅防止策
    setInterval(function(){
        commandSendcom('o');
        },60*1000);
});

function message(mes)
{
if ($(document))
  {
      document.getElementById("message").innerHTML=mes;
  }
}

function filename_message(mes)
{
if ($(document))
  {
      document.getElementById("filename").innerHTML=mes;
  }
}

/* Copyright (C) 2007 Richard Atterer, richard©atterer.net
   This program is free software; you can redistribute it and/or modify it
   under the terms of the GNU General Public License, version 2. See the file
   COPYING for details. */

var imageNr = 0; // Serial number of current image
var finished= new Array([]); // References to img objects which have finished downloading
var paused = false;

function createImageLayer() {
  var img = new Image();
  img.style.position = "absolute";
  img.style.zIndex = -1;
  img.onload  = imageOnload;
  img.onclick = imageOnclick;
  img.src = 'http://'+document.location.hostname+':8080/?action=snapshot&n=' + (++imageNr);
//  img.src = "http://itelepass02.local:8080/?action=stream";

  var webcam = document.getElementById("webcam");
  if(webcam)
  webcam.insertBefore(img, webcam.firstChild);
}

// Two layers are always present (except at the very beginning), to avoid flicker
function imageOnload() {
  this.style.zIndex = imageNr; // Image finished, bring to front!
  while (1 < finished.length) {
    var del = finished.shift(); // Delete old image(s) from document
    if(del){
        if( del.parentNode.removeChild ) 
                del.parentNode.removeChild(del);
    }
}
  finished.push(this);
  if (!paused) createImageLayer();
}

function imageOnclick() { // Clicking on the image will pause the stream
  paused = !paused;
  if (!paused) createImageLayer();
}

//////
function getTimeDate(){
        var date=new Date();
        var y=(date.getYear())+'';
        if(y.length>2) y=y.substr(y.length-2,2);
        var m=date.getMonth()+1;
        if(m<=9) m='0'+m;
        var d=date.getDate()+0;
        if(d<=9) d='0'+d;
        var H=date.getHours()+0;
        if(H<=9) H='0'+H;
        var M=date.getMinutes()+0;
        if(M<=9) M='0'+M;
        var S=date.getSeconds();
        if(S<=9) S='0'+S;
        return y+m+d+H+M+S;
}

function saveimage(){
        
//message("saveimage");
//絶対パスで指定すること
    var filename="/home/coder/coder-dist/coder-base/photo/"+getTimeDate()+".jpg";

console.log("imagefile="+filename);
    command( filename );
}

function command( req, f ) {
     filename_message(req);
    $.getJSON( 
    "/app/streamcamera/command",//url
    //  面倒なので、sudo_scripts/wgetは、ファイル名を第一引数に取る
    {"command":"wget", "arg":[req]},//data
    function(data) {
    //dataがサーバから受け取るjson値
    $.each(data, 
    function(key, val) {
    rdata = val;
    }
    );
    //  message(rdata);
       if(f) f();
    return rdata;
    }
    );
}

function commandSendcom( req ) {
//var ev = new EventEmitter();
     message("command:"+req);
    $.ajaxSetup({ async: false });
    $.getJSON( 
    "/app/streamcamera/command",//url
    {"command":"sendcom", "arg":['-e',req]},//data
    function(data) {
    //dataがサーバから受け取るjson値
    $.each(data, 
    function(key, val) {
    rdata = val;
    }
    );
       message(rdata);
        }
    );

}