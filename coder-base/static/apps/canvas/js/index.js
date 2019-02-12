xmax=400
ymax=400;;
$(document).ready( function() {
  //描画コンテキストの取得
  var canvas = document.getElementById('canvassample');
  if (canvas.getContext) {
    var context = canvas.getContext('2d');
    //ここに具体的な描画内容を指定する
    //新しいパスを開始する
    /*context.beginPath();
    context.moveTo(0,0);
    context.lineTo(xmax,0);
    context.lineTo(xmax,400);
    context.lineTo(0,400);
    context.lineTo(0,0);*/
    //パスの開始座標を指定する
    context.moveTo(100,20);
    //座標を指定してラインを引いていく
    context.lineTo(150,100);
    context.lineTo(50,100);
    //パスを閉じる（最後の座標から開始座標に向けてラインを引く）
    context.closePath();
    //現在のパスを輪郭表示する
    context.stroke();
  }
});

xoff=24;
yoff=85;

function myFunction(e) {
  var x = e.clientX;
  var y = e.clientY;
  var coor = "Mose Move Coordinates: (" + (x-xoff) + "," + (y-yoff) + ")";
  document.getElementById("demo").innerHTML = coor;
        document.getElementById('state').innerHTML='';
}

function clearCoor() {
  document.getElementById("demo").innerHTML = "";
        document.getElementById('state').innerHTML='';
}

var par=[4];
function showCoords(event) {
  var x = event.clientX;
  var y = event.clientY;
  var coords = "Mouse Click X coords: " + (x-xoff) + ", Y coords: " + (y-yoff);
  document.getElementById("demo").innerHTML = coords;
  par[0]='-p0';
  par[1]='0.0';
  par[2]='-p1'
  par[3]=String((360.0*((x-xoff)/xmax)).toFixed(1));
  par[4]='-p2';
  par[5]='0.0';
  par[6]='-p3';
  par[7]=String((360.0*((y-yoff)/ymax)).toFixed(1));
      document.getElementById('state').innerHTML='Mouse Clicked';
  console.log(par);
  control( par );
}

function control( par, f ){
    $.getJSON( 
    "/app/canvas/command",//url
    {"command":"4chControl.py", "arg":par},//data
    function(data) {
    //dataがサーバから受け取るjson値
    $.each(data, 
    function(key, val) {
    console.log(val);
    document.getElementById('state').innerHTML=val;
        });
    });
}