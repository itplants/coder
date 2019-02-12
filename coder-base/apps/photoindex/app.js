exports.settings={};
//These are dynamically updated by the runtime
//settings.appname - the app id (folder) where your app is installed
//settings.viewpath - prefix to where your view html files are located
//settings.staticurl - base url path to static assets /static/apps/appname
//settings.appurl - base url path to this app /app/appname
//settings.device_name - name given to this coder by the user, Ie."Billy's Coder"
//settings.coder_owner - name of the user, Ie. "Suzie Q."
//settings.coder_color - hex css color given to this coder.

exports.get_routes = [
    { path:'/', handler:'index_handler' },
    { path:'/newfile', handler: 'newfile'},
    { path:'/filePutContents', handler: 'filePutContents'},
    { path:'/command', handler: 'command'},
    { path:'/command2', handler: 'command2'},
    { path:'/commandSendcom', handler: 'commandSendcom'},
    { path:'/commandExe', handler: 'commandExe'},
];

exports.post_routes = [
];


var sudoscripts = process.cwd() + '/sudo_scripts';


exports.command = function( req, res ) {
   // res.json( { networks: req } );
    var tmp = '';   
    var com = sudoscripts;   
    /*
    var args = {}; 
    var tmp00 = req.url.split('?');
    // app/setwifi/command,command=wifiset&SSID=A&PASSWD=B
    var tmp01   = tmp00[1].split('&');
    var command = tmp01[0].split('=')[1];// command
    command=decodeURIComponent(command);
    var arg1    = tmp01[1].split('=')[1];// arg1
    arg1=decodeURIComponent(arg1);
    */
    
    var command = req.param('command');
    var arg1 = req.param('arg');   
 
    command=com+'/'+command;
//res.json( { networks: command+' '+[arg1] } );

    var spawn = require('child_process').spawn;

    var scanproc = spawn(command, [arg1] );
 
        scanproc.stdoutStr = "";
     
        scanproc.stdout.setEncoding("utf8");
        scanproc.stdout.addListener('data', function (data) {
            scanproc.stdoutStr += data;
        });
        
        scanproc.addListener( 'exit', function( code, signal ) {
        tmp = scanproc.stdoutStr;

        var ttmp=tmp.split('\n').join('<br>');
        res.json( { networks: ttmp } );//
        });
        
};


exports.index_handler = function( req, res ) {
  console.log("index_handler.");
    var tmplvars = {};
    tmplvars['static_url'] = exports.settings.staticurl;
    tmplvars['app_name'] = exports.settings.appname;
    tmplvars['app_url'] = exports.settings.appurl;
    tmplvars['device_name'] = exports.settings.device_name;

    res.render( exports.settings.viewpath + '/index', tmplvars );
};



exports.filePutContents = function( req, res ){
  // res.json( { networks: req } );
    var tmp = '';   
    var com = sudoscripts;   
    var args = {}; 
    var tmp00 = req.url.split('?');
    // app/setwifi/command,command=wifiset&SSID=A&PASSWD=B
    var tmp01   = tmp00[1].split('&');
    var command = tmp01[0].split('=')[1];// command
 //  res.json( { networks: 'from command2 com='+command } );
         
    var file1    = tmp01[1].split('=')[1];// arg1
    var strdata  = tmp01[2].split('=')[1];// arg2
    file1=decodeURIComponent(file1);
    strdata=decodeURIComponent(strdata);

    command=com+'/'+command;
    
//    res.json( { networks: 'file saved0:'+file1 } );
      
    var fs = require("fs");

    var fd = fs.openSync(file1, 'a');
    fs.writeSync(fd, strdata, 0, "ascii");
    fs.closeSync(fd);
    
    res.json( { networks: 'file saved:'+file1 } );
    
 //   res.value='saved to '+filename;
}








