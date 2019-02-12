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


//var date=require("date-utils");
exports.command2 = function( req, res ) {
//res.json( { networks: 'from command2 com='+req } );
    var tmp = '';
    var args = {}; 
    var tmp00 = req.url.split('?');
    // app/setwifi/command,command=wifiset&SSID=A&PASSWD=B
    var tmp01   = tmp00[1].split('&');
    var command = decodeURIComponent(tmp01[0].split('=')[1]);// command
//  res.json( { networks: 'from command2 |'+decodeURIComponent(tmp01[1])+'|' } );
// args[0][]=net_itpmanager|
//tmp00 command=mkupdater&args[0][]=mkupdater&args[0][]=runspectrum&args[0][]=streamcamera|
// tmp01[1]  args[0][]=mkupdater
    for(var i=1;i<tmp01.length;i++){
    args[i-1]=decodeURIComponent(tmp01[i].split('=')[1]);
    }
    command=sudoscripts+'/'+command;
    
//    res.json( { networks: 'from command2 |'+args[0]+' '+args[1]+' '+args[2]+'|' } );
//    res.json( { networks: 'from command2 com='+command+' | '+args+' | ' } );
    
    var spawn = require('child_process').spawn;

    var scanproc = spawn(command, [args[0],args[1],args[2]] );
 
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


exports.newfile = function( req, res ) {
 // res.json( { networks: req } );
    var com = sudoscripts;   
     
    var tmp00 = req.url.split('?');
    // app/setwifi/command,command=wifiset&SSID=A&PASSWD=B
    var tmp01   = tmp00[1].split('&');
    var command = tmp01[0].split('=')[1];// command
 //  res.json( { networks: 'from command2 com='+command } );
         
    var srcfile       = tmp01[1].split('=')[1];// arg1
    var distfile      = tmp01[2].split('=')[1];// arg2
    srcfile=decodeURIComponent(srcfile);
    distfile=decodeURIComponent(distfile);

    command=com+'/'+command;

    var spawn = require('child_process').spawn;

    var scanproc = spawn(command, [srcfile,distfile] );
 
        scanproc.stdoutStr = "";
     
        scanproc.stdout.setEncoding("utf8");
        scanproc.stdout.addListener('data', function (data) {
            scanproc.stdoutStr += data;
        });
        
        scanproc.addListener( 'exit', function( code, signal ) {
        tmp = scanproc.stdoutStr;

        var ttmp=tmp.split('\n').join('<br>');
        
        res.json( { networks: 'newfile: file moved from '+srcfile +' to '+distfile } );
        });

};


// sendcom
exports.commandSendcom = function( req, res ) {
    var tmp = '';   
    var com = '';   
    var args = [];   
// sendcom=/app/websendcom/command?command=sendcom&arg[]=1&arg[]=-e&arg[]=A
    var tmp00 = decodeURI(req.url).split('?');
//    res.json( { networks: 'tmp00 '+tmp00});
// tmp00[0]                       , temp00[1]
// sendcom=/app/websendcom/command, command=sendcom&arg[]=1&arg[]=-e&arg[]=A
    var tmp01 = tmp00[1].split('=');
    // tmp01 command,sendcom&arg[],1&arg[],-e&arg[],A
//    res.json( { networks: 'tmp01 '+tmp01});
 var tmp02 = tmp01[1].split('&');
     com = tmp02[0];
     if(tmp01[2])
     args[0] = tmp01[2].split('&')[0];
     if(tmp01[3])     
     args[1] = tmp01[3].split('&')[0];
     if(tmp01[4])
     args[2] = tmp01[4].split('&')[0];
//    res.json( { networks: 'args '+args});
//res.json( { networks: sudoscripts+com+' '+args.length});

    var spawn = require('child_process').spawn;
    var scanproc = '';
    
    if(args.length==3) scanproc = spawn(sudoscripts+com, [args[0],args[1],args[2]]);
    else if(args.length==2 && args[1] != '-e') scanproc = spawn(sudoscripts+com, [args[0],'-e '+args[1]]);
    else if(args.length==1 ) scanproc = spawn(sudoscripts+com, ['-e '+args[0]]);

        scanproc.stdoutStr = "";
        scanproc.stdout.setEncoding("utf8");
        scanproc.stdout.addListener('data', function (data) {
        scanproc.stdoutStr += data;
        });
        
        scanproc.addListener( 'exit', function( code, signal ) {
        tmp = scanproc.stdoutStr;
        var ttmp=tmp.split('\n').join('<br>');
                
        res.json( { networks: ttmp  } );//
        });
};


exports.command = function( req, res ) {
   // res.json( { networks: req } );
    var tmp = '';   
    var com = sudoscripts;   
    var args = {}; 
    var tmp00 = req.url.split('?');
    // app/setwifi/command,command=wifiset&SSID=A&PASSWD=B
    var tmp01   = tmp00[1].split('&');
    var command = tmp01[0].split('=')[1];// command
    command=decodeURIComponent(command);
    var arg1    = tmp01[1].split('=')[1];// arg1
    arg1=decodeURIComponent(arg1);
 
    command=com+'/'+command;
//res.json( { networks: command+' '+arg1 } );

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


exports.commandExe = function( req, res ) {
   // res.json( { networks: req } );
    var tmp = '';   
    var com = sudoscripts;   
    var args = {}; 
    var tmp00 = req.url.split('?');
    // app/setwifi/command,command=wifiset&SSID=A&PASSWD=B
    var tmp01   = tmp00[1].split('&');
    var command = tmp01[0].split('=')[1];// command
    command=decodeURIComponent(command);
    var arg1    = tmp01[1].split('=')[1];// arg1
    arg1=decodeURIComponent(arg1);
 
    command=com+'/'+command;
//res.json( { networks: command+' '+arg1 } );

    var spawn = require('child_process').spawn;

    var scanproc = spawn(command, ['-e '+arg1] );
 
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








