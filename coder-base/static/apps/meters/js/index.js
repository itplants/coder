$(document).ready( function() {

            draw_Metors();
    //This code will run after your page loads
            drawCircle();
            
            showLangage('jp');
            


});


function draw_Metors()
{
        var p = document.getElementById('meters');
        doc = '<iframe width=300  height=400 scrolling="yes" src="https://'+window.location.hostname+':8091/app/thermometer"  name="thermometer" frameborder="0" ></iframe>';
        doc +='<iframe width=300  height=400 scrolling="yes" src="https://'+window.location.hostname+':8091/app/watermeter"  name="watermeter" frameborder="0"></iframe>';
        doc += '<iframe width=300  height=400 scrolling="yes" src="https://'+window.location.hostname+':8091/app/illuminometer"  name="illuminometer" frameborder="0"></iframe>';
        p.innerHTML=doc;
}

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


function message(mes)
{
if ($(document))
  {
      document.getElementById("message").innerHTML=mes;
  }
}


function drawCircle() {
      var canvas = document.getElementById('signal');
      if ( ! canvas || ! canvas.getContext ) { return false; }
       var ctx = canvas.getContext('2d');
      ctx.beginPath();
      ctx.fillStyle = 'white'; // 白
      ctx.arc(10, 12, 10, 0, Math.PI*2, false);
      ctx.fill();
      
    $.getJSON( 
    "/app/websendcom/command",//url
    {"command":"sendcom", "arg":'C'},//data
    function(data) {
    //dataがサーバから受け取るjson値

    $.each(data, 
    function(key, val) {
    rdata = val;
    }
    );
    var s=rdata.split('<br>');
//    console.log(s[1]);

    var t=s[1].split(' ');
//    console.log(s[0],s[1]);
    var v1=t[0].split('=')[1];
    var v2=t[1].split('=')[1];
    console.log('v1='+v1,'v2='+v2);


      var color='red';
      if( v1 === '0' && v2 === '0' ) color='green';
      if( v1 === '1' && v2 === '0' ) color='blue';
      if( v1 === '0' && v2 === '1' ) color='red';

      ctx.fillStyle = color; // 赤
      ctx.arc(10, 12, 10, 0, Math.PI*2, false);
      ctx.fill();

    }
    );
}

function command( req ) {
//    $.ajaxSetup({ async: false });
    $.getJSON( 
    "/app/meters/command",//url
    {"command":"sendcom", "arg":req},//data
    function(data) {
    //dataがサーバから受け取るjson値

    $.each(data, 
    function(key, val) {
    rdata = val;
    }
    );
    return rdata;
    }
    );
}

function command2( req ){
        $.getJSON( 
    "/app/meters/command",//url
    {"command":"sendcom", "arg":'o'},//data
    function(data) {
    //dataがサーバから受け取るjson値

    $.each(data, 
    function(key, val) {
    rdata = val;
    }
    );
    command(req);
    }
    );    
}


