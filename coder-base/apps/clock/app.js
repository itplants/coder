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
var sudoscripts = process.cwd() + '/sudo_scripts';
console.log('sudoscripts: ' + sudoscripts);


var options = {
    cachePassword: true,
    prompt: 'Password, you? ',
    spawnOptions: { /* other options for spawn */ }
};


exports.get_routes = [
    { path:'/', handler:'index_handler' },
    { path:'/command', handler: 'command'},
];

exports.post_routes = [
];


exports.index_handler = function( req, res ) {
  console.log("index_handler.");
    var tmplvars = {};
    tmplvars['static_url'] = exports.settings.staticurl;
    tmplvars['app_name'] = exports.settings.appname;
    tmplvars['app_url'] = exports.settings.appurl;
    tmplvars['device_name'] = exports.settings.device_name;

    res.render( exports.settings.viewpath + '/index', tmplvars );
};


var sudoscripts = process.cwd() + '/sudo_scripts/';

exports.command = function( req, res ) {

    var com = req.param('command');
    var args = req.param('arg');    
    // if args dose not have -e option then add to [1]
    var flag=false;
    for(i=0;i<args.length;i++){
        if(args[i]==='-e') flag=true;
    }
    
    var args2=[];
    if(flag===false && args.length===1){
        args2[0]='-e';
        args2[1]=args;
    }
    
    if(flag===false && args.length===2){
        args2[0]=args[0];
        args2[1]='-e';
        args2[2]=args[1];
    }
    
    if(flag===true){// copy
    for(i=0;i<args.length;i++)  args2[i]=args[i];
    }


    //res.json( { networks: flag+' '+args+' '+args2  });

        var spawn = require('child_process').spawn;
        var scanproc = spawn(sudoscripts+com, args2);
            
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

