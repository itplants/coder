
$(document).ready( function() {

    //This code will run after your page loads

});


function shutdown(f) {
    console.log('shutdown');
    $.getJSON(
    "/app/shutdown/command",//url
    {"command":"shutdown", "arg":['']},//data
    function(data) {
    $.each(data, 
    function(key, val) {
        })
    });
    if(f) f();
}