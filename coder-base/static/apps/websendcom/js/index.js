var items = [];

function message(mes)
{
if ($(document))
  {
      document.getElementById("message").innerHTML=mes;
  }
}

function resultmessage(mes)
{
if ($(document))
  {
      document.getElementById("result").innerHTML=mes;
  }
}

$(document).ready( function() {
    
       
    $.ajaxSetup({ async: false });
    $.getJSON( 
    "/app/websendcom/command",//url
    {"command":"sendcom", "arg":'D'},//data
    function(data) {
    //dataがサーバから受け取るjson値
    var rdata='';
    $.each(data, 
    function(key, val) {
//    items.push('<li id="' + key + '">' + val + '</li>');
//    console.log("key="+key+" val="+val);// key 'networks'   val 'result text'
    var res = val;
    if(res){
        var tmp=res.split('<br>');
         //           console.log('tmp='+tmp);
        if(tmp[1]){
                    console.log('tmp[1]='+tmp[1]);
            var ndev=tmp[1].split('  ');
            if(ndev[1]){
            console.log('ndev='+ndev[1]);

                if(ndev[1]=='0'){
                    message('アイティプランターが見つかりません ');
                    document.js.txtb.disabled='disabled';
                }
            }
        }
    }
    }
    )});
/*
       console.log("ready : Add Item clicked.");
    $("#command").click(function () {
        console.log("Command clicked1.");
        command(); 
        console.log("Command clicked2.");
   });  
       $("#cancel").click(function () {
        console.log("cancel clicked1.");
        cancel(); 
        console.log("cancel clicked2.");
   });
   */
   
    $(window).on('resize', function() {
        setTimeout( buildAnimation, 1 );
    });
    
    var hideTextLabel = function() {
    $(this).parent().find('.label').hide();
};
var focusTextInput = function() {
    $(this).parent().find('input').focus();
};
var onBlurTextInput = function() {
    if ( $(this).val() === "" ) {
        $(this).parent().find('.label').show();
    }
};

});

var setupCommandFiles = function() {
    $('#command_form .cancel').click( function() {
        window.location.href="/";
    });

    $('#command_form .submit').click( command );
};

function cancel() {
     window.location.href="/";
}


function command( req ) {
    var req2=req.split(' ');
     message("command:"+req2);
     //dispTxt(req2);
    $.ajaxSetup({ async: false });
    $.getJSON( 
    "/app/websendcom/command",//url
    {"command":"sendcom", "arg":req2},//data
    function(data) {
    //dataがサーバから受け取るjson値
    var rdata='';
    $.each(data, 
    function(key, val) {
    items.push('<li id="' + key + '">' + val + '</li>');
    console.log("key="+key+" val="+val);// key 'networks'   val 'result text'
    rdata = val;
    return rdata;
    }
    );
       message(rdata);
    }
    );
    $.ajaxSetup({ async: true });
}

function dispTxt( req ){

if ($(document))
  {
 var txt=document.getElementById("defaultKeypad");
 if(txt){
     txt.value=req;
         console.log(req);
        }
  }
}

function dispTxtAppend(req){
         console.log('dispTxtAppend:'+req);
if ($(document))
  {
 var txt=document.getElementById("defaultKeypad");
 if(txt){
    var t=txt.value;
    if(req==="Back"){
     txt.value=t.slice(0, -1);
     console.log("Back");
    } else {
     txt.value=t+req;
     console.log('txt.value='+req);
            }
        }
  }
}



