
$(document).ready( function() {

    //This code will run after your page loads
    lsAppFile();
});

var rdata='';
var updatefiles=[];
var updater='';

function makeUpdater(){
    $.ajaxSetup({ async: false });
    $.getJSON( 
    "/app/mkupdater/command2",//url
    {"command":"mkupdater", "args": [updatefiles]},//data
    function(data) {
    //dataがサーバから受け取るjson値
    //var rdata='';
    $.each(data,
    function(key, val) {
    rdata = val;
    }
    );
console.log('makeUpdater:'+rdata);
    updater=rdata.split('<br>')[0];
    var n=document.getElementById('updater');
    if(n){
        n.innerHTML='<a href="http://itelepass02.local/update/'+updater+'">"'+updater+'</a>';
        }


    var m=document.getElementById('message');
    if(m){
        m.innerHTML=rdata;
        }
    }
    );
    $.ajaxSetup({ async: true });
}

function lsAppFile( ) {
 //   $.ajaxSetup({ async: false });
    $.getJSON( 
    "/app/mkupdater/command",//url
    {"command":"ls", "args":'./apps'},//data
    function(data) {
    //dataがサーバから受け取るjson値
    //var rdata='';
    $.each(data,
    function(key, val) {
    rdata = val;
    }
    );
//console.log(rdata);
    
     var XMLlist=rdata.split('<br>');
     //if(XMLlist[0].indexOf('.xml')<0) return;
        
     var ls=document.getElementById("list");
     var flist='<table>';
     for(i=1;i<XMLlist.length-1;i+=2){
         flist += '<tr><td  >['+i+']</td>'+'<td name="tag" id="tg"'+i+'">'+XMLlist[i]+'<td><td>['+(i+1)+']</td>'+'<td name="tag" id="tg"'+i+'">'+XMLlist[i+1]+'<td><tr>';
     }
    flist += '</table>';
    ls.innerHTML=flist;
    addListners();
  //  console.log(rdata);
//    if(f) f();// call back function
    }
    );
}
        
function cancelfile(updatefiles,filename){
    for(i=0;i<updatefiles.length;i++){
        if(updatefiles[i] === filename){
console.log('delete '+i+' '+updatefiles[i]);
            updatefiles.splice(i, 1); //i番目の要素を削除
        }
        
    var e=document.getElementsByName('tag');
        for(j=0;j<e.length;j++){
            if(e[j].innerHTML === filename){
                e[j].style.backgroundColor = "#ffffff";
        }
                
                
            }
        }
}

function overlapfile(updatefiles,filename){
    for(i=0;i<updatefiles.length;i++){
        if(updatefiles[i] === filename) return true;
    }
    return false;
}


function addListners(){
   // 各エレメントを取得
    var elements = document.getElementsByName("tag");
    var element_result = document.getElementById("result");

    // ------------------------------------------------------------
    // マウスのボタンを押すと実行される関数
    // ------------------------------------------------------------
    function MouseDownFunc(e){
        //    for(var i=0;i<elements.length;i++) elements[i].style.backgroundColor = "#ffffff";
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
        
//  重複している場合は、取消
        if(overlapfile(updatefiles,filename)){
            cancelfile(updatefiles,filename);
        } else {
            updatefiles.push(filename);
        }
console.log('1 |'+updatefiles+'|');
        var ls='';
        for(i=0;i<updatefiles.length;i++){
            ls += updatefiles[i]+' ';
        }
console.log('2 |'+ls+'|');        
        var ot=document.getElementById('output');
        if(ot) ot.innerHTML=ls;

      //  lsAppFile( filename );
	}

/*
    // ------------------------------------------------------------
	// マウスのボタンを押すと実行される関数
	// ------------------------------------------------------------
	function MouseDownFunc(e){
		element.style.backgroundColor = "#ffffff";
		element_result.innerHTML = "マウスのボタンが押された (type:\"" + e.type + "\" button:" + e.button  + ' target '+e.target + ") " + e.target.innerHTML;
	}

	// ------------------------------------------------------------
	// マウスのボタンを離すと実行される関数
	// ------------------------------------------------------------
	function MouseUpFunc(e){
		e.target.style.backgroundColor = "#ffffff";
		element_result.innerHTML = "マウスのボタンが離された (type:\"" + e.type + "\" button:" + e.button + 'target '+e.target+") " + e.target.innerHTML;
	}
*/
	// ------------------------------------------------------------
	// クリックすると実行される関数
	// ------------------------------------------------------------
/*
	function MouseClickFunc(e){
		element_result.innerHTML = "マウスがクリックされた (type:\"" + e.type + "\" button:" + e.button + 'target '+e.target + ") " + e.target.innerHTML;
        e.target.style.backgroundColor = "#ffffff";
        oldelm = e.target;
        document.getElementById('input').value= e.target.innerHTML;
      //  document.getElementById('output').value= e.target.innerHTML+'.new';
      //  cultivationProgramLoad();
	}
*/
	// ------------------------------------------------------------
	// ダブルクリックすると実行される関数
	// ------------------------------------------------------------
	function MouseDoubleClickFunc(e){
		element_result.innerHTML = "マウスがダブルクリックされた (type:\"" + e.type + "\" button:" + e.button + ") " + e.target.innerHTML;
	}

    function MouseOverFunc(e){
		element_result.innerHTML = "マウスがOverされた (type:\"" + e.type + "\" button:" + e.button + ") " + e.target.innerHTML;
	}

	// ------------------------------------------------------------
	// イベントのリッスンを開始する
	// ------------------------------------------------------------
	// イベントリスナーに対応している
    for(var i=0;i<elements.length;i++){
    var element = elements[i];
	if(element.addEventListener){
//    	element.addEventListener("onmouseover" , MouseOverFunc);
		// マウスのボタンを押すと実行されるイベント
		element.addEventListener("mousedown" , MouseDownFunc);
		// マウスのボタンを離すと実行されるイベント
		element.addEventListener("mouseup" , MouseUpFunc);
		// クリックすると実行されるイベント
	//	element.addEventListener("click" , MouseClickFunc);
		// ダブルクリックすると実行されるイベント
//		element.addEventListener("dblclick" , MouseDoubleClickFunc);
		// コンテキストメニューが表示される直前に実行されるイベント
		element.addEventListener("contextmenu" , function (e){
			// コンテキストメニューの表示を無効化
			e.preventDefault();
		});

	// アタッチイベントに対応している
	}else if(element.attachEvent){
//    	element.attachEvent("onmouseover" , MouseOverFunc);
		// マウスのボタンを押すと実行されるイベント
		element.attachEvent("onmousedown" , MouseDownFunc);
		// マウスのボタンを離すと実行されるイベント
		element.attachEvent("onmouseup" , MouseUpFunc);
		// クリックすると実行されるイベント
//		element.attachEvent("onclick" , MouseClickFunc);
		// ダブルクリックすると実行されるイベント
//		element.attachEvent("ondblclick" , MouseDoubleClickFunc);
		// コンテキストメニューが表示される直前に実行されるイベント
		element.attachEvent("oncontextmenu" , function (e){
			// コンテキストメニューの表示を無効化
			return false;
		});

	    }
    }
}