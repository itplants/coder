
$(document).ready( function() {

    lsDataFile(makePhotoTable);

});

function ajax_download(ac_type){
    $.ajax({
        type: "GET",
        async: true,
        cache: false,
        url: "http://"+location.hostname,
        data: {ac:ac_type},
        success: function(data, text_status, xhr){
            var res = evil('('+data+')');
            if (res.err_msg !== undefined ){
                alert( res.err_msg );
                return;
            }
            location.href = res.redirect_url;
        },
        error: function(xhr, text_status, err_thrown){
            alert(err_thrown + ' ファイルダウンロードに失敗しました');
        }
    });
}

function photoDownload(obj){
    var fn=document.getElementById('input').innerHTML;
    // 「OK」時の処理開始 ＋ 確認ダイアログの表示
    var f=fn.split('/');
    var fm='';
    for(i=0;i<f.length;i++){
        if(f[i].indexOf('.jpg')>0){
            fm=f[i];
        }
    }
    console.log('fm='+fm);
    //    var msg='本当に'+'"http://itelepass03.local/photo/'+fm+'"'+'をDownloadしますか？';
    //if(window.confirm(msg)){
        $(obj).attr({
            download: fm,
            href:  'http://'+location.hostname+'/photo/'+fm
        });
    //}
}

function photoRemove(){
    var fn=document.getElementById('delete').innerHTML;
    // 「OK」時の処理開始 ＋ 確認ダイアログの表示
    var f=fn.split('/');
    var fm='';
    for(i=0;i<f.length;i++){
        if(f[i].indexOf('.jpg')>0){
            fm=f[i];
        }
    }
    var msg='本当に'+fm+'を削除しますか？';
    if(window.confirm(msg)){
        // save datas
    if(fm.indexOf('./photo/')<0) fm = './photo/'+fm;
    var dfd1=$.getJSON( 
    "/app/photoindex/command",//url
    {"command":"rmXML", "arg":fm});//data
     $.when(dfd1).done(function(data) {
   //処理
      var sdata='';
           $.each(data,
           function(key, val) {
           sdata = val;
           });
//  何故か、空白が＋になって返ってくる
        lsDataFile(makePhotoTable);
console.log(sdata);
     });
    }
}

function loadDataFile( req, f ) {
    $.ajaxSetup({ async: false });
    $.getJSON( 
    "/app/photoindex/command",//url
    {"command":"cat", "arg":req},//data
    function(data) {
    //dataがサーバから受け取るjson値
    //var rdata='';
    $.each(data,
    function(key, val) {
    rdata = val;
    }
    );
    //
    console.log('rdata '+rdata);
//       resultmessage(rdata);
 //       XMLaddElement(rdata) ;
console.log(rdata);
 //       cultivationProgramRead();
        if(f) f();
    }
    );
    $.ajaxSetup({ async: true });
}



/*
screen.width   画面幅 ： 2048
screen.height   画面高 ： 1152
screen.availWidth   有効画面幅 ： 2048
screen.availHeight   有効画面高 ： 1076
window.innerWidth   表示領域幅 ： 1223 （IE非対応）
window.innerHeight   表示領域高 ： 905 （IE非対応）
window.outerWidth   ウィンドウ幅 ： 1223 （IE非対応）
window.outerHeight   ウィンドウ高 ： 999 （IE非対応）
$(window).width()   表示領域幅 ： 1223
$(window).height()   表示領域高 ： 905
document.documentElement.clientWidth   表示領域幅 ： 1223
document.documentElement.clientHeight   表示領域高 ： 905
document.width   ドキュメント幅 表示領域幅 ： 1223 （IE非対応）
document.height   ドキュメント高 表示領域高 ： 905 （IE非対応）
$(document).width()   ドキュメント幅 ： 1223
$(document).height()   ドキュメント高 ： 905
*/
var width=160;
var height=120;
var XMLlist='';
function lsDataFile( f ) {
    $.ajaxSetup({ async: false });

console.log('lsDataFile');

    $.getJSON( 
    "/app/photoindex/command",//url
    {"command":"ls", "arg":['./photo/']},//data
    function(data) {
    //dataがサーバから受け取るjson値
    //var rdata='';
    $.each(data,
    function(key, val) {
    rdata = val;
    }
    );
 
// console.log(rdata);
     XMLlist=rdata.split('<br>');
//     if(XMLlist[0].indexOf('.jpg')<0) return;


   console.log(rdata);
    if(f) f();// call back function
    }
    );
    $.ajaxSetup({ async: true });
}

///
///     popUpMenu
///
var timeout         = 500;
var closetimer      = 0;
var ddmenuitem      = 0;

function obj_dump(obj) {
    var txt = '';
    for (var one in obj){
    	txt += one + "=" + obj[one] + "\n";
	}
	console.log(txt);
}

function mupProperty(obj){
    console.log('mupProperty');
    //console.log('obj.parentNode.parentNode='+obj.parentNode.parentNode);
    //obj_dump(obj.parentNode.parentNode);
    var html=obj.parentNode.parentNode.innerHTML + '';
   // console.log('html='+html);
    var src=html.split('>');
    for(i=0;i<src.length;i++){
    // console.log('src['+i+']='+src[i]);
    if(src[i].indexOf('img')>0){
    // console.log('!!!!src['+i+']='+src[i]);
        var img=src[i].replace('<img src="','').replace('"','').split(' ')[0];
            console.log('img='+img);
            var image = new Image();
            image.src = img; 
            var width  = image.width;  // 幅
            var height = image.height; // 高さ
            alert('width='+width+' height='+height);
        }
    }
}

function mupDelete(obj){
    console.log('mupDelete');
    console.log('obj.parentNode.parentNode='+obj.parentNode.parentNode);
    //obj_dump(obj.parentNode.parentNode);
    var html=obj.parentNode.parentNode.innerHTML + '';
    console.log('html='+html);
    var src=html.split('>');
    for(i=0;i<src.length;i++){
    console.log('src['+i+']='+src[i]);
    if(src[i].indexOf('img')>0){
    console.log('!!!!src['+i+']='+src[i]);
        var img=src[i].replace('<img src="','').replace('"','').split(' ')[0];
            console.log('img='+img);
        var del=document.getElementById("delete");
        if(del) del.innerHTML=img;
        photoRemove();
        }
    }
}

function mupDownload(obj){
    console.log('mupDownload');
    //console.log('obj.parentNode.parentNode='+obj.parentNode.parentNode);
    //obj_dump(obj.parentNode.parentNode);
    var html=obj.parentNode.parentNode.innerHTML + '';
    //console.log('html='+html);
    var src=html.split('>');
    for(i=0;i<src.length;i++){
    console.log('src['+i+']='+src[i]);
    if(src[i].indexOf('img')>0){
    //console.log('!!!!src['+i+']='+src[i]);
        var img=src[i].replace('<img src="','').replace('"','').split(' ')[0];
        //    console.log('img='+img);
        var down=document.getElementById("input");
        if(down) down.innerHTML=img;
        photoDownload(obj);
        }
    }
}


function mup(obj){
    console.log('up: '+obj.innerHTML+' id='+obj.id);
}

function mdown(){
    console.log('down');
}

// open hidden layer
function mopen(id)
{	
    
    console.log('mopen');
	// cancel close timer
	mcancelclosetime();

	// close old layer
	if(ddmenuitem){
        if(ddmenuitem.style)
            ddmenuitem.style.visibility = 'hidden';
	}
	// get new layer and show it
	ddmenuitem = document.getElementById(id);
    if(ddmenuitem){
        if(ddmenuitem.style)
            ddmenuitem.style.visibility = 'visible';
    }
}
// close showed layer
function mclose()
{
	if(ddmenuitem){
        if(ddmenuitem.style)
            ddmenuitem.style.visibility = 'hidden';
	}
}

// go close timer
function mclosetime()
{
	closetimer = window.setTimeout(mclose, timeout);
}

// cancel close timer
function mcancelclosetime()
{
	if(closetimer)
	{
		window.clearTimeout(closetimer);
		closetimer = null;
	}
}

function makePhotoTable(){
    ////
     var ls=document.getElementById("list");
     var flist='<table>';
     //
     // n column にする。
     var n = parseInt( $(window).width() / width )-1;
     if(n===0) n=1;
//     console.log('n='+n+' '+ $(window).width());

    var h=0, i=0, j=0, k=0, l=0, m=0;
    
    m=parseInt( XMLlist.length / n );
    var m1='';
    for(j=0;j<m;j++){
         flist += '<tr>';
    for(i=0;i<n;i++){
        k=j*n+i;
        m1='m'+k;
 //       console.log('j='+j+' k='+k+' i='+i);
        if(XMLlist[k])
        flist += '<td><ul id="sddm"><li><a href="#" onmouseover="mopen(\''+m1+'\')" onmouseout="mclosetime()"><img src="http://'+location.hostname+'/photo/'+XMLlist[k]+'" width="'+width+'" height="'+height+'"></src></a><div id="'+m1+'" onmouseover="mcancelclosetime()" onmouseout="mclosetime()"><a href="#" id="'+m1+'" onmouseup="mupProperty(this)">'+XMLlist[k]+'</a><a href="#" id="'+m1+'" onmouseup="mupDelete(this)">Delete</a><a href="#" id="'+m1+'" onmouseup="mupDownload(this)">Download</a></div></li></ul></td>';
        }
        flist += '</tr>';
    }

    flist += '</table>';
    ls.innerHTML=flist;
///
}

// close layer when click-out
document.onclick = mclose; 
        
