    var Org_today  = '';
    var Org_hour   = '';
    var Org_minute = '';
    var Org_second = '';
    src="/static/datetimepicker/jquery.datetimepicker.js";
    
function analog_clock(){
    Org_today = new Date();
    Org_hour   = Org_today.getHours();
	Org_minute = Org_today.getMinutes();
	Org_second = Org_today.getSeconds();
	$('#clock_hours_hand').rotate(Org_hour*30+Org_minute/2);
	$('#clock_minutes_hand').rotate(Org_minute*6+Org_second/10);
	$('#clock_seconds_hand').rotate(Org_second*6);
    //
	setTimeout('analog_clock()',1000);
}

function key_press(){
    //message('key_press');
    if(window.event.keyCode==13){
     //   message('Enter');
     adjustClock();
    }
}

function adjustClock(){
    //    $.ajaxSetup({ async: false });
    var timeset='G';
    var clockinput=document.getElementById('clockinput');
    if(clockinput.value==''){
    //clockinput.value='no input';
    if( Org_hour   < 10 ) timeset+='0'+ Org_hour;   else timeset+= Org_hour; 
    if( Org_minute < 10 ) timeset+='0'+ Org_minute; else timeset+= Org_minute; 
    if( Org_second < 10 ) timeset+='0'+ Org_second; else timeset+= Org_second; 
    } else {
    timeset += clockinput.value;
    }
//message(timeset);
    $.getJSON( 
    "/app/clock/command",//url
        {"command":"sendcom", "arg":['*','-e',timeset]},//data
    function(data) {
    //dataがサーバから受け取るjson値
    var rdata='';
    $.each(data, 
    function(key, val) {
    rdata = val;
            resultmessage(rdata);  
        });
    });
}

function resultmessage(mes)
{
if ($(document))
  {
      document.getElementById("resultmessage").innerHTML=mes;
  }
}

function message(mes)
{
if ($(document))
  {
      document.getElementById("message").innerHTML=mes;
  }
}

var rdata='';
var itp_time   = '';
var itp_hour   = '';
var itp_minute = '';
var itp_second = '';

function analog_clock_itplanter() {
    $.ajaxSetup({ async: false });
    $.getJSON( 
    "/app/clock/command",//url
    {"command":"sendcom", "arg":"G"},//data
    function(data) {
    //dataがサーバから受け取るjson値
    var rdata='';
    $.each(data, 
    function(key, val) {
    rdata = val;
    itp_time=rdata.split('<br>')[1].split(' ');
    itp_hour   = itp_time[1];
    itp_minute = itp_time[3];
    itp_second = itp_time[5];
    $('#clock_hours_hand2').rotate(itp_hour*30+itp_minute/2);
    $('#clock_minutes_hand2').rotate(itp_minute*6+itp_second/10);
    $('#clock_seconds_hand2').rotate(itp_second*6);

            resultmessage(rdata);  
        });
    });
    setTimeout('analog_clock_itplanter()',1000);
}

function diffReport(){
            message('difference:'+(Org_hour-itp_hour)+':'+(Org_minute-itp_minute)+':'+(Org_second-itp_second));  
}



        
$(document).ready(function(){
	analog_clock();
    analog_clock_itplanter();
    
       $('#'+clockinput).datetimepicker({
            value:'07:00',
            datepicker:false,
            format:'H:i',
            step:30,
            language: 'ja',
            
          onShow:function( ct ){
           this.setOptions({
           // document.getElementById("message").textContent="ABC";
            value:'nnn'
           })
          },
          onSelectTime:function(ct,$i){
          //　設定されるたびにデータ取得する
          message2('setTime '+ct.dateFormat('H:i'))
          } 
        });
        
});


