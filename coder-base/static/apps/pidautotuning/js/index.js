function doAutoTuning(){
    if(window.confirm('本当に実行しますか？')){
    //
    $.getJSON( 
    "/app/pidautotuning/command",//url
    {"command":"stepResponse.py", "arg":[]},//data
    function(data) {
    $.each(data, 
       function(key, val) {
        p=document.getElementById('result');
        result.innerHTML=val;
        });
    });
    }
}

$(document).ready( function() {

    //This code will run after your page loads

});