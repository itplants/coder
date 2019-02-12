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
    { path:'/command', handler: 'command'},
    { path:'/writeFileSync', handler: 'writeFileSync'},
    { path:'/readFileSync', handler: 'readFileSync'},
];

exports.post_routes = [
];


var sudoscripts = process.cwd() + '/sudo_scripts';

exports.writeFileSync = function( req, res ) {
    var file = req.param('file');
    var data = req.param('data');    
        var fs = require('fs');
        fs.writeFileSync(file,data);
        var ttmp='write '+file;                
        res.json( { networks: ttmp  } );
};

exports.readFileSync = function( req, res ) {
     res.json( { networks: req } );
/*
    var file = req.param('file').split(' ');
        res.json( { networks: file  } );

        var data = '';    
        var fs = require('fs');
        for(i=0;i<file.length;i++){
            data += file[i]+',';
            data += fs.readFileSync(file[i],'utf8');
        }
        res.json( { networks: data  } );
*/
};

exports.command = function( req, res ) {
   // res.json( { networks: req } );
    var tmp = '';   
    var com = sudoscripts;   

    var command = req.param('command');
    var arg = req.param('arg');   
 
    command=com+'/'+command;
//res.json( { networks: command+' '+[arg1] } );

    var spawn = require('child_process').spawn;

    var scanproc = spawn(command, [arg] );
 
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








