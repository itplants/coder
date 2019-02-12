

var rdata='';
var filename='';
var UpdatedFile='';

    
var updateMetaData = function( metadata ) {
    $('#date_created .value').text( metadata.created );
    $('#last_edited .value').text( metadata.modified );
    $('#app_author').val( metadata.author );
    $('#app_name').val( metadata.name );
    $("#editornav .application_name").text( metadata.name );
}

function find_latest(array,last){
//itelepass2update150212.taz
        var i=0, j=0;
        var late=[];
        for(i=0;i<array.length;i++){
//console.log('LatestUpdater 0 '+array[i]);
                late[i] = array[i].replace('.taz','').replace('itelepass2update','');
//console.log('late 0 '+late[i]); 
        }
        var max=0;
        for(i=0;i<late.length;i++){
        if( late[i]){
//console.log('late 0 '+late[i]); 
        if( late[i] > max ){
                 max = late[i];
                j = i;
//console.log('late j '+j); 
                        }    
                }
        }
console.log('LatestUpdater '+array[j]);        
        return array[j];// latest updater name                                  
}

 function loadDataFile( req, res ) {
    var dfd1=$.getJSON( 
    "/app/update/command",//url
    {"command":"ls", "arg":['/mnt/updaters']}
    );
    $.when(dfd1).done(function(data) {
    //処理
    $.each(data,
    function(key, val) {
    rdata = val;
    }
    );
    console.log('loadData:|'+rdata+'|');
    filename=rdata.split('<br>')[0];

    });
}

function loadUpdater(){
    var dfd1=$.getJSON( 
    "/app/update/command",//url
    {"command":"downloadUpdater", "arg":''}
    );
    $.when(dfd1).done(function(data) {
    //処理
    $.each(data,
    function(key, val) {
    rdata = val;
    }
    );
    console.log('loadUpdater:'+rdata);
    lsDataFile();
    });
}

function update(){
    var dfd1=$.getJSON( 
    "/app/update/command",//url
    {"command":"updateCom", "arg":[filename]}
    );
    $.when(dfd1).done(function(data) {
    //処理
    $.each(data,
    function(key, val) {
    rdata = val;
    }
    );
  console.log('loadData:|'+rdata+'|');
    var msg=document.getElementById('cong');
    var status=rdata.split('<br>')[0];
    if(status===''){
    msg.innerHTML='おめでとうございます！！　アップデートに成功しました。<br>';
    } else {
    msg.innerHTML='残念ながら、アップデートに失敗しました。<br>'+status;
    }
    
    });
}

function lsDataFile( req ) {
    
//    console.log($.get("http://download.itplants.com/dl/updaters/index.html"));
    
    $.ajaxSetup({ async: false });
    $.getJSON(
    "/app/update/command",//url
    {"command":"ls", "args":['./updaters']},//data
    function(data) {
    //dataがサーバから受け取るjson値
    //var rdata='';
    $.each(data,
    function(key, val) {
    rdata = val;
    }
    );
    //resultmessage(rdata);
    //document.getElementById("list").innerHTML=rdata;
    
     var updateList=rdata.split('<br>');

//console.log('ls1:'+updateList.length);
     
     for(i=0;i<updateList.length;i++){
         if(updateList[i].indexOf('Update')>=0){
          console.log(updateList[i]);
          updateList.splice(i, 1);// Update holderを表示しない
         }
     }
     for(i=0;i<updateList.length;i++){
         if(updateList[i].indexOf('UPDATEDATE')>=0){
          console.log(updateList[i]);
          updateList.splice(i, 1);// UPDATEDATEを表示しない
         }
     }

//console.log('ls2:'+updateList.length);

     var ls=document.getElementById("list");
     var flist='<table>';
     var gc='style.backgroundColor = "#22ff22"';
     var wc='style.backgroundColor = "white"';
     for(i=0;i<updateList.length-1;i+=2){
         flist += '<tr><td  >['+i+']</td>'+'<td name="tag" >'+updateList[i]+'<td><td>['+(i+1)+']</td>'+'<td name="tag" >'+updateList[i+1]+'<td><tr>';
     }
    flist += '</table>';
    ls.innerHTML=flist;
    addListners();
    // update済みかどうか調べる
    // /mnt/updaters/UPDATEDATE の中身を調べる
        
    $.getJSON( 
    "/app/update/command",//url
    {"command":"cat", "args":['./updaters/UPDATEDATE']},//data
    function(data) {
    //dataがサーバから受け取るjson値
    //var rdata='';
    $.each(data,
    function(key, val) {
    rdata = val;
    }
    );
    rdata = rdata.split('<br>');
  console.log(rdata);

    var updatedate = rdata[0];
    UpdatedFile = updatedate;// UPDATEATE
    
    var msg=document.getElementById('msg');
    msg.innerHTML='現在までに適用された最新アップデータ: '+UpdatedFile;
    
    // 150212
//    console.log('rdata[0]='+rdata[0]);
    updatedate = updatedate.replace('.taz','');
    updatedate = updatedate.replace('itelepass2update','');
    console.log('updatedate='+updatedate);

    
    // 最新のアップデータにフォーカスすること
    var latest=find_latest(updateList,updatedate);
    console.log('latest='+latest+' UPDATEDATE='+rdata[0]);
 //   if(rdata[0] !== latest){
    var tags=document.getElementsByName('tag');
    if(tags){
        for(i=0;i<tags.length;i++){
            if(tags[i].innerHTML===latest){
                tags[i].style.backgroundColor = "#22ff22";
                }
            }
        }
 //   }
        }
        );
    });
    $.ajaxSetup({ async: true });
}


function addListners(){
   // 各エレメントを取得
    var elements = document.getElementsByName("tag");
    var element_result = document.getElementById("result");


    // ------------------------------------------------------------
    // マウスのボタンを押すと実行される関数
    // ------------------------------------------------------------
    function MouseDownFunc(e){
            for(var i=0;i<elements.length;i++) elements[i].style.backgroundColor = "#ffffff";
		e.target.style.backgroundColor = "#22ff22";
	//	element_result.innerHTML = "マウスのボタンが押された (type:\"" + e.type + "\" button:" + e.button  + ' target '+e.target + ") " + e.target.innerHTML;
	}

	// ------------------------------------------------------------
	// マウスのボタンを離すと実行される関数
	// ------------------------------------------------------------
	function MouseUpFunc(e){
	//	e.target.style.backgroundColor = "#ffffff";
        filename = e.target.innerHTML;
        var it=document.getElementById('input');
        if(it) it.innerHTML=filename;

        var ot=document.getElementById('output');
        removefilename=filenameDate(filename);
        console.log('|'+removefilename+'|');
        if(ot) ot.innerHTML=removefilename;

		//element_result.innerHTML = "マウスのボタンが離された (type:\"" + e.type + "\" button:" + e.button + 'target '+e.target+") " + e.target.innerHTML;
	}

	// ------------------------------------------------------------
	// クリックすると実行される関数
	// ------------------------------------------------------------
    function MouseClickFunc(e){
		element_result.innerHTML = "マウスがクリックされた (type:\"" + e.type + "\" button:" + e.button + 'target '+e.target + ") " + e.target.innerHTML;
        e.target.style.backgroundColor = "#22ff22";
        oldelm = e.target;
        filename = e.target.innerHTML;
        document.getElementById('input').innerHTML= filename;
        filename = './data/'+filename;

        var dataname='';
        if(radios){
            for(i=0;i<radios.length;i++){
                if(radios[i].checked){
                    dataname=radios[i].value;
                }
            }
        }
       // console.log(dataname);
        loadDataFile(filename, dataname);
	}

	// ------------------------------------------------------------
	// ダブルクリックすると実行される関数
	// ------------------------------------------------------------
	function MouseDoubleClickFunc(e){
		element_result.innerHTML = "マウスがダブルクリックされた (type:\"" + e.type + "\" button:" + e.button + ") " + e.target.innerHTML;
	}

    function MouseOverFunc(e){
        console.log('Over');
        e.target.style.backgroundColor = "#22ff22";
		element_result.innerHTML = "マウスがOverされた (type:\"" + e.type + "\" button:" + e.button + ") " + e.target.innerHTML;
	}

    function MouseOutFunc(e){
        e.target.style.backgroundColor = "#ffffff";
        console.log('Out');
        element_result.innerHTML = "マウスがOutされた (type:\"" + e.type + "\" button:" + e.button + ") " + e.target.innerHTML;
	}


	// ------------------------------------------------------------
	// イベントのリッスンを開始する
	// ------------------------------------------------------------
	// イベントリスナーに対応している
    for(var i=0;i<elements.length;i++){
    var element = elements[i];
	if(element.addEventListener){
        //
     //   element.addEventListener("onmouseout" , MouseOutFunc);
        //
     //   element.addEventListener("onmouseover" , MouseOverFunc);
		// マウスのボタンを押すと実行されるイベント
		element.addEventListener("mousedown" , MouseDownFunc);
		// マウスのボタンを離すと実行されるイベント
		element.addEventListener("mouseup" , MouseUpFunc);
		// クリックすると実行されるイベント
//		element.addEventListener("click" , MouseClickFunc);
		// ダブルクリックすると実行されるイベント
//		element.addEventListener("dblclick" , MouseDoubleClickFunc);
		// コンテキストメニューが表示される直前に実行されるイベント
        /*
		element.addEventListener("contextmenu" , function (e){
			// コンテキストメニューの表示を無効化
        return false;
		});
        */
      //  element.preventDefault();
	// アタッチイベントに対応している for IE
	}else if(element.attachEvent){
     //   element.attachEvent("onmouseover" , MouseOverFunc);
		// マウスのボタンを押すと実行されるイベント
		element.attachEvent("onmousedown" , MouseDownFunc);
		// マウスのボタンを離すと実行されるイベント
		element.attachEvent("onmouseup" , MouseUpFunc);
		// クリックすると実行されるイベント
		//element.attachEvent("onclick" , MouseClickFunc);
		// ダブルクリックすると実行されるイベント
		//element.attachEvent("ondblclick" , MouseDoubleClickFunc);
		// コンテキストメニューが表示される直前に実行されるイベント
		element.attachEvent("oncontextmenu" , function (e){
			// コンテキストメニューの表示を無効化
		return false;
		});
	    }
    }
}




$(document).ready( function() {
/*
console.log(appurl + '/api/metadata/get/');
var update_appname='update';
    $.get( appurl + '/api/metadata/get/' + update_appname, function( data ) {
        metadata = data.metadata;
//        updateMetaData(metadata);
        
        $.get( appurl + '/api/getcode/' + update_appname, function( data ) {
        console.log( data.cssdata, data.htmldata,  data.jsdata, data.appdata );

        });
    });
    */
    lsDataFile('');
     loadDataFile();

});