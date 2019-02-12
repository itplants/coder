var mycron = require('cron').CronJob;
var moment = require("moment");
var fs = require('fs');
var mustache = require('mustache');
var util = require('util');
var fs = require('fs');
var http = require('http');
var EventEmitter = require('events').EventEmitter;

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


var sudoscripts = process.cwd() + '/sudo_scripts';
console.log('sudoscripts: ' + sudoscripts);

var tempv="";
var count=0;
var portno=9001;

function command( com ) {
    var ev = new EventEmitter();

    var spawn = require('child_process').spawn;
    var scanproc = spawn( sudoscripts + '/sendcom',['-e '+com]);

            scanproc.stdout.setEncoding("utf8");

            scanproc.stdout.addListener('data', function (data) {
               scanproc.stdoutStr += data;
    });
      
           scanproc.stdout.on('data', function (data) {
          // console.log('stdout: ' + data);
    var temp=data.split("\n");
           //console.log('stdout: ' + temp[1]);
           ev.emit('done', temp[1]);
    });
    return ev; 
}

function oncom(req){
    req.on('done',function(arg1) {
    arg1=arg1.replace("?%","");
    str=str+arg1+"\n";
    // console.log(str);
	});
}

var str="itplanter status\n";
console.log('Server running at http://esison.local:'+portno+'/');

function writeITPLANTER(datas){

var ev = new EventEmitter();

var cline=datas.split('\n');

console.log("command No:"+cline.length);
for(i=0;i<cline.length;i++){
var compar=cline[i].split(' ');
	switch (compar[0]){
		case 'PWM':
console.log("command:"+'PWM'+'H'+compar[1]);
		var comH=command('H'+compar[1]);
            oncom(comH);
            break;

		case 'PumpWorkTime':
console.log("command:"+'PumpWorkTime'+'U'+compar[1]);
		var comU=command('U'+compar[1]);
            oncom(comU);
		break;

		case 'nLamp':
console.log("command:"+'nLamp'+'f'+compar[1]);
		var comf=command('f'+compar[1]);
            oncom(comf);
		break;

		case 'nPump':
console.log("command:"+'nPump'+'g'+compar[1]);
		var comg=command('g'+compar[1]);
            oncom(comg);
		break;

		case 'nDuty':
console.log("command:"+'nDuty'+'n'+compar[1]);
		var comn=command('n'+compar[1]);
            oncom(comn);
		break;

		case 'Time':// time set
		var time=compar[1]
console.log("command:"+'G'+time);

		var comG=command('G'+time);
            oncom(comG);
		break;

		case 'Lamp':
		// Light
console.log("command:"+'Lamp'+'f'+compar[1]);
        var coml=command('f');
		var fn= oncomXW(coml,'W',compar);
		break;

		// Pump
		case 'Pump':
console.log("command:"+'Pump'+'g'+compar[1]);
    var comp=command('g');
		var gn= oncomXW(comp,'X',compar);
		break;

		// Duty
		case 'Duty':
console.log("command:"+'Duty'+'n'+compar[1]);
		var comd=command('n');
		var nn= oncomXW(comd,'Y',compar);
		break;
		}// switch end
	}// next i

    ev.emit('done', str);
    return ev;

	function oncomXW(req, com, compar){
    req.on('done',function(arg1) {
    str=str+arg1+"\n";

	var fn=arg1.split(" ")[1];
    var comX={};
    for(var i=0;i<fn;i++){
        // * Schedule * * *
        var comoars=compar[2];
        for(j=3;j<compar.length;j++){
        comoars = compars+','+compar[j];
        }
console.log("command:"+com+i+','+compars);
		comX[i]=command(com+i+','+compars);
        oncom(comX[i]);
        }
        return fn;
	});
	}
}

function readITPLANTER(){
var ev = new EventEmitter();

var res="";
var comA=command('A');
    oncom(comA);
var comB=command('B');
    oncom(comB);
var comC=command('C');
    oncom(comC);
var comH=command('H');
    oncom(comH);
var comU=command('U');
    oncom(comU);

function oncomX(req, com){
    req.on('done',function(arg1) {
    str=str+arg1+"\n";

	var fn=arg1.split(" ")[1];
	//  console.log("---------fn="+fn);
    var comX={};
    for(var i=0;i<fn;i++){
		comX[i]=command(com+i);
        oncom(comX[i]);
    }
    return fn;
	});

// reformat str 
// 1. gather same program
// 2. rearrange as number
//
var data=str;
var fs = require('fs');
fs.writeFile('itp_sensor_record.txt', data , function (err) {
        console.log(err);
    });
}

// Light
var comf=command('f');
var fn= oncomX(comf,'W');

// Pump
var comg=command('g');
var gn= oncomX(comg,'X');

// Duty
var comn=command('n');
var nn= oncomX(comn,'Y');

var comG=command('G');
    oncom(comG);

    ev.emit('done', str);
    return ev;
}

var itp=readITPLANTER();

function onRequest(request, response) {
//
	console.log("request.method:"+request.method);

	switch (request.method){
	case 'POST':
	var data='';
	request.setEncoding('utf8');
	request.on('data', function(dataChunk) {
		dataChunk = dataChunk.replace(/undefined/g,'');
		dataChunk = dataChunk.replace(/&submit=Send/g,'');
		dataChunk = dataChunk.replace(/\+/g,'');
        dataChunk = dataChunk.replace(/\=/g,' ');
		dataChunk = dataChunk.replace(/&/g,'\n');
		data += dataChunk;  
	});

	request.on('end', function() {
		// undefinedG=123456&submit=Send
//
		data += '\n';
console.log('getdata:|'+data+'|');
		response.end('finished');

// write data
    writeITPLANTER(data);
	});
	break;

	case 'GET':
	console.log("Get Request received.:");
	var itplanter=readITPLANTER();
	itplanter.on('done',function(arg1) {
	console.log("ITPLANTER.done:"+arg1);
	});
	console.log("Request received.:"+str+" count:"+(count++));
        response.writeHead(200, {"Content-Type": "text/plain"});
        response.write(str);
        response.end();
	break;
	}
}

/*
itp.on('done',function(arg1) {
	console.log("ITPLANTER.done:"+arg1);
});
*/

http.createServer(onRequest).listen(portno);

console.log("Server has started.");

// moment().format(); // 2014-07-16T09:00:00+09:00 (default)
// moment().format("YYYY-MM-DD"),           // 2014-07-17
// moment().format("YYYY-MM-DD HH:mm:ssZ"), // 2014-07-17 10:00:00+09:00
var job = new mycron({
   cronTime: '*/9 * * * *',
         onTick: function() {

	itp.on('done',function(arg1) {
	console.log("ITPLANTER.done:"+arg1);
	//
	var data = moment().format()+"\n"+str;
	fs.writeFile('writetest.txt', data , function (err) {
           console.log(data);
	});
	});

                   console.log("onTick!! write data !!");
                             console.log(moment().format());
                                                 },
                              start: false
                //      start: false,
                //      timeZone: 'Japan/Tokyo'
		//
});

job.start();
