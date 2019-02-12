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
      if(document.getElementById("message")){
          document.getElementById("message").innerHTML=mes;
      }
  }
}

var photoNum=0;

function garallyReMake(){
    //
    resultmessage('garallyReMake');
    
    message('|'+rdata+'|');
    
    var list=rdata.split('<br>');
    //

    //message(list[0]);
    var base_element=document.getElementById('myGallery');
    
        message('list='+list[0]);
    
    // 要素が削除できていない
    for ( var i=0;i<photoNum;i++ ) {
        if(document.getElementById('itpphoto'+i))
            document.getElementById('itpphoto'+i).remove();   
    }

    var str='';
    message(str);
    photoNum=(list.length-1);
    for(var i=0;i<photoNum;i++){
     var item_element = document.createElement('li');
     str = str+ 'src="http://'+location.hostname+'/photo/'+list[i]+'" alt="'+list[i].split('.')[0]+'"'+'<br>';
     item_element.innerHTML = '<img src="http://'+location.hostname+'/photo/'+list[i]+'" alt="'+list[i].split('.')[0]+'"/>';
     item_element.id = 'itpphoto'+i;
     if(item_element && base_element)
         base_element.appendChild(item_element);
     //document.body.insertBefore(item_element, base_element);
    }
    message(str);
    
    $('#myGallery').galleryView();
    //$('#myGallery').galleryViewReload();

}

function garallyMake(){
    //
    var list=rdata.split('<br>');
    //
    var base_element=document.getElementById('myGallery');
    var str='';
    photoNum = (list.length-1);
    for(var i=0;i<photoNum;i++){
     var item_element = document.createElement('li');
     str = str+ 'src="http://'+location.hostname+'/photo/'+list[i]+'" alt="'+list[i].split('.')[0]+'"'+'<br>';
     item_element.innerHTML = '<img src="http://'+location.hostname+'/photo/'+list[i]+'" alt="'+list[i].split('.')[0]+'"/>';
     item_element.id = 'itpphoto'+i;
     base_element.appendChild(item_element);
     //document.body.insertBefore(item_element, base_element);
    }
    
   // message(str);
    
    $('#myGallery').galleryView();
    //$('#myGallery').galleryViewReload();
}

var rdata='';
function reload(){
    message('reload'); 
    
    rdata='';
    resultmessage(rdata);  
    
    $.ajaxSetup({ async: false });
//message(timeset);
    $.getJSON( 
    "/app/galleryview/command",//url
    {"command":"ls", "arg":['./photo','-aFc']},//data
    function(data) {
    //dataがサーバから受け取るjson値
    $.each(data, 
    function(key, val) {
    rdata = val;
    // space区切り
        //    resultmessage(rdata);  
            garallyReMake();
        });
    });
}



var rdata='';
function command(){
    $.ajaxSetup({ async: false });
//message(timeset);
    $.getJSON( 
    "/app/galleryview/command",//url
    {"command":"ls", "arg":['./photo','-aFc']},//data
    function(data) {
    //dataがサーバから受け取るjson値
    $.each(data, 
    function(key, val) {
    rdata = val;
    // space区切り
            //resultmessage(rdata);  
            garallyMake();
        });
    });
}


$(document).ready( function() {
    //message("start0");
    
    $(function(){
        command();
    });
    /*
    $('#myGallery').galleryView({
    //option設定　Galleryの設定をここで指定できる。指定しないとデフォルト値
    panel_width: 800,
	panel_height: 300,
	frame_width: 100,
	frame_height: 100
    });
    */


});

