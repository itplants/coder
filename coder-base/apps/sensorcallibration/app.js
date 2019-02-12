exports.settings={};
//These are dynamically updated by the runtime
//settings.appname - the app id (folder) where your app is installed
//settings.viewpath - prefix to where your view html files are located
//settings.staticurl - base url path to static assets /static/apps/appname
//settings.appurl - base url path to this app /app/appname
//settings.device_name - name given to this coder by the user, Ie."Billy's Coder"
//settings.coder_owner - name of the user, Ie. "Suzie Q."
//settings.coder_color - hex css color given to this coder.
var sudo = require('sudo');
var EventEmitter = require('events').EventEmitter;
var sudoscripts = process.cwd() + '/sudo_scripts/';

var options = {
    cachePassword: true,
    prompt: 'Password, you? ',
    spawnOptions: { /* other options for spawn */ }
};

exports.get_routes = [
    { path:'/', handler:'index_handler' },
    { path:'/command', handler: 'command'},
    { path:'/commandSync', handler: 'commandSync'},
    { path:'/writeFileSync', handler: 'writeFileSync'},
];

exports.post_routes = [
//    { path:'/', handler:'post_handler' },
];

exports.index_handler = function( req, res ) {
//  console.log("index_handler.");
    var tmplvars = {};
    tmplvars['static_url'] = exports.settings.staticurl;
    tmplvars['app_name'] = exports.settings.appname;
    tmplvars['app_url'] = exports.settings.appurl;
    tmplvars['device_name'] = exports.settings.device_name;
    res.render( exports.settings.viewpath + '/index', tmplvars );
};

exports.command = function( req, res ) {
    var com = req.param('command');
    var args = req.param('arg');    

    //res.json( { networks: flag+' '+args+' '+args2  });

        var spawn = require('child_process').spawn;
        var scanproc = spawn(sudoscripts+com, args);
            
        scanproc.stdoutStr = "";     
        scanproc.stdout.setEncoding("utf8");
        scanproc.stdout.addListener('data', function (data) {
            scanproc.stdoutStr += data;
        });
        
        scanproc.addListener( 'exit', function( code, signal ) {
        var tmp = scanproc.stdoutStr;
        var ttmp=tmp.split('\n').join('<br>');        
        res.json( { networks: ttmp  } );//
        });
};

exports.commandSync = function( req, res ) {
    var com = req.param('command');
    var args = req.param('arg');    

    //res.json( { networks: flag+' '+args+' '+args2  });

        var execSync = require('child_process').execSync;
        var scanproc = execSync(sudoscripts+com, args);
            
        scanproc.stdoutStr = "";     
        scanproc.stdout.setEncoding("utf8");
        scanproc.stdout.addListener('data', function (data) {
            scanproc.stdoutStr += data;
        });
        
        scanproc.addListener( 'exit', function( code, signal ) {
        var tmp = scanproc.stdoutStr;
        var ttmp=tmp.split('\n').join('<br>');        
        res.json( { networks: ttmp  } );//
        });
};

exports.writeFileSync = function( req, res ) {
    var file = req.param('file');
    var data = req.param('data');    
        var fs = require('fs');
        fs.writeFileSync(file,data);
        var ttmp='write '+file;                
        res.json( { networks: ttmp  } );
};