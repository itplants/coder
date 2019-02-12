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
];

exports.post_routes = [
];


exports.index_handler = function( req, res ) {
    var tmplvars = {};
    tmplvars['static_url'] = exports.settings.staticurl;
    tmplvars['app_name'] = exports.settings.appname;
    tmplvars['app_url'] = exports.settings.appurl;
    tmplvars['device_name'] = exports.settings.device_name;

    res.render( exports.settings.viewpath + '/index', tmplvars );
};

exports.on_destroy = function() {
};


var sudoscripts = process.cwd() + '/sudo_scripts/';

exports.command = function( req, res ) {
    var tmp = '';   
    var com = '';   
    var args = {};   

    var tmp00 = decodeURIComponent(req.url).split('?');
    var tmp01 = tmp00[1].split('&');
    var tmp02 = tmp01[0].split('=')[1];// ls
    var arg1  = tmp01[1].split('=')[1];// arg1
    var arg2  = tmp01[2].split('=')[1];// arg2

    com = tmp02;// sendcom

    //var tmp04 = tmp03[1].split(" ");
    //args[0]=decodeURIComponent(tmp04[0]);
    //args[1]=decodeURIComponent(tmp04[1]);

    
    //
    //res.json( { networks: com+' '+arg1+' '+arg2 } );
 
    //args=tmp04.split(" ");

  //  var properties=sudoscripts+com+'\n';
  //  ttmp=properties.split('\n').join('<br>')
    
   //args=String.fromCharCode(args);
//     args=decodeURIComponent(args);
//  res.json( { networks: sudoscripts+com+' '+arg1});
  
    var spawn = require('child_process').spawn;
    var scanproc = spawn(sudoscripts+com, [arg1]);
 
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