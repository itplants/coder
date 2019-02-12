//var atable=[];
var atable=new Array('17','16','15','14','13','12','11','10','9','8','7','6','5','4','3','2','1');

function readResource(){
    console.log("readResource");
    $.ajaxSetup({ async: false });
    $.getJSON( 
    "/app/mymenu/command",//url
    {"command":"cat", "arg":"resources/mymenu.res"},//data
    function(data) {
    $.each(data,
    function(key, val) {
    rdata = val;
    }
    );
    rdata=rdata.replace("<br>","");
    console.log("readResource:"+rdata);// 18,17,11,2,3,1,....  new position
//
    var no=rdata.split(',');
        no.length--;
        console.log("no.length()="+no.length);
        
        atable.length=0;
        for(i=0;i<no.length;i++){
            atable[i]=no[i];
       //     console.log("atable["+i+']='+atable[i]);
        }
    // load arrangement_data from config
        reArrange();


    }
    );
    $.ajaxSetup({ async: true });
}

function saveResource(saveData){
    console.log("saveResource");
    console.log("saveResource:"+saveData);//  1,2,4,6,7,9,....
    $.ajaxSetup({ async: false });
    $.getJSON( 
    "/app/mymenu/writeFile",//url
    {"filename":"resources/mymenu.res", "data":saveData},//data
    function(data) {
    $.each(data,
    function(key, val) {
    rdata = val;
    });
    });
    $.ajaxSetup({ async: true });
}

function saveArrange(){
 var b=document.getElementsByName('elment');
 var n=b.length;
 var data='';
    for(i=0;i<n;i++){
        var d=b[i].id;
        data += d.replace('p','')+',';
    }
    console.log('data= '+data);
    saveResource(data);
}


$(document).ready( function() {

$('.container').shapeshift({
  animated: true,
  animatedOnDrag: true,
  centerGrid: true,
  columns: null,
  draggable: true,
  objWidth: null,
  gutterX: 10,
  gutterY: 10,
  resizable: true,
  selector: "",
  minColumns: 3
});

   readResource();

});


function swap_element(ele_A, ele_B){
    var swap_ele_A = ele_A.cloneNode(true);
    var swap_ele_B = ele_B.cloneNode(true);
    ele_A.parentNode.replaceChild( swap_ele_B, ele_A );
    ele_B.parentNode.replaceChild( swap_ele_A, ele_B );
 }
 
 
function reArrange(){
var b='';
 for(i=0;i<atable.length;i++){
        b=document.getElementsByName('elment');
         console.log('1 b['+i+'].id='+ b[i].id);
     // find b[i].id in atable then swap
     var swapTarget=0;
     /*
     for(var j=i;j<atable.length;j++){
         //console.log('i='+i+' atable[j]='+atable[j]);
         if(i == atable[j]){
             swapTarget=j;
             console.log('find '+i+' in atable['+j+']'+atable[j]);
             break;
         }
     }
     */
     swapTarget=b.length-1;
     
         console.log(' b['+i+'].id='+ b[i].id);
         console.log('swap1 '+b[i].id+' <-> p'+swapTarget);
         var aElm=b[i];
         var bElm=document.getElementById('p'+swapTarget);
         if( aElm != bElm )  swap_element(aElm,bElm);
         b=document.getElementsByName('elment');

         console.log('2 b['+i+'].id='+ b[i].id);
         console.log('swap2 '+b[i].id+' <-> p'+atable[i]);
         aElm=b[i];
         bElm=document.getElementById('p'+atable[i]);
         if( aElm != bElm )  swap_element(aElm,bElm);
        // b=document.getElementsByName('elment');
        }
        
 // 18 17 .... 2 1
 $('.container').shapeshift({
  animated: true,
  animatedOnDrag: true,
  centerGrid: true,
  columns: null,
  draggable: true,
  objWidth: null,
  gutterX: 10,
  gutterY: 10,
  resizable: true,
  selector: "",
  minColumns: 3
});
 
}