var selectedFile='';
var chart=[];
var lawdata=[];
var pathdir='./SensorsData/';

$(document).ready( function() {
   makeTree();
       $('#tree1').on("changed.jstree", function (e, data) {
        var p=document.getElementById(data.node.parent);
        var selectDir='';
        if(p) selectDir=p.innerText.split('\n')[0];
        var selectFile=data.node.text;
        if(selectDir) selectedFile=selectDir+'/'+selectFile;
        else selectedFile=selectFile;
        console.log(selectedFile);
    });
    
    makeGraph([selectedFile]);  
    setInterval(function() {
        makeGraph([selectedFile]);
    }, 60000);
});

function makeGraph(file, f) {
    console.log('makeGraph1 type of file=|'+(typeof  file)+'|');
    console.log('makeGraph1 file=|'+file+'|');
    //console.log('makeGraph1 file.length='+file.length);
    console.log('makeGraph1 selectedFile=|'+selectedFile+'|');
    if( file === undefined && selectedFile === ''){
        file=['./SensorsData/TVOC/saveSGP30data.csv'];
    } else {
        if(selectedFile[selectedFile.length-1] !== 'v') file=[pathdir+selectedFile+'/*'];
    if( file.length <= 1 && selectedFile === ''){
        file=['./SensorsData/TVOC/saveSGP30data.csv'];
        }
    }
    console.log('makeGraph2 file='+file);
    $.getJSON(
    "/app/sgp30/command",//url
    {"command":"cat", "arg":file},//data
    function(data) {
        $.each(data, 
        function(key, val) {
        rdata = val.split('<br>');
        });
    if(rdata[rdata.length-1]==='') rdata.pop();
    
    var i=0;
    lawdata=new Array([]);
    for(i=0;i<6;i++) lawdata[i]=new Array([]);
    for(i=0;i<rdata.length;i++){
    var t=rdata[i].split(',');
    //2018-09-16 10:02:30,CO2,400,TVOC,0,CO2EQ_BASELINE,35187,TVOC_BASELINE,35516
    //console.log('makeGraph t='+t);
    date  = Date.parse(t[0]);
    CO2   = parseFloat(t[2]);
    TVOC  = parseFloat(t[4]);
    CO2EQ_BASELINE = parseFloat(t[6]);
    TVOC_BASELINE  = parseFloat(t[8]);
    
    //console.log('makeGraph date='+date+'CO2='+CO2);

    lawdata[0][i]=[date,CO2];
    lawdata[1][i]=[date,TVOC];
    lawdata[2][i]=[date,CO2EQ_BASELINE];
    lawdata[3][i]=[date,TVOC_BASELINE];
    }

    // 日本時間表示設定
    Highcharts.setOptions({
        global: {
            useUTC: false
        }
    });

   //////
        chart[0]=Highcharts.chart('container1', {
            chart: {
                zoomType: 'xy'
            },
            title: {
                text: 'CO2EQ Log'
            },
            subtitle: {
                text: document.ontouchstart === undefined ?
                        'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
            },
            xAxis: {
                type: 'datetime'
            },
            yAxis:[{
                min: 400,
                max: 1200,
                title: {
                    text: 'CO2EQ'
                },            
                labels: {
                format: '{value} ppm',
                style: {
                    color: Highcharts.getOptions().colors[0]
                }
            }
            }, {
                min: 0,
                max: 50000,
                title: {
                    text: 'CO2EQ_BASELINE'
                },
            labels: {
                format: '{value}',
                style: {
                    color: Highcharts.getOptions().colors[1]
                }
            },
                opposite: true
            }],
            legend: {
                enabled: true
            },
            plotOptions: {
                area: {
                    fillColor: {
                        linearGradient: {
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: 1
                        },
                        stops: [
                            [0, Highcharts.getOptions().colors[0]],
                            [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                        ]
                    },
                    marker: {
                        radius: 2
                    },
                    lineWidth: 1,
                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    },
                    threshold: null
                }
            },

            series: [{
                type: 'line',
                name: 'CO2EQ',
                data: lawdata[0],
                tooltip: {
                valueSuffix: ' pgm'
                },
                yAxis: 0
                },{
                type: 'line',
                name: 'CO2EQ_BASELINE',
                data: lawdata[2],
                tooltip: {
                valueSuffix: ''
                },
                yAxis: 1
                }]
            });    
    //////
        chart[1]=Highcharts.chart('container2', {
            chart: {
                zoomType: 'xy'
            },
            title: {
                text: 'TVOC Log'
            },
            subtitle: {
                text: document.ontouchstart === undefined ?
                        'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
            },
            xAxis: {
                type: 'datetime'
            },
            yAxis:[{
                min: 0,
                max: 500,
                title: {
                    text: 'TVOC'
                },            
                labels: {
                format: '{value} pgm',
                style: {
                    color: Highcharts.getOptions().colors[0]
                }
            }
            }, {
                min: 0,
                max: 50000,
                title: {
                    text: 'TVOC_BASELINE'
                },
            labels: {
                format: '{value}',
                style: {
                    color: Highcharts.getOptions().colors[1]
                }
            },
                opposite: true
            }],
            legend: {
                enabled: true
            },
            plotOptions: {
                area: {
                    fillColor: {
                        linearGradient: {
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: 1
                        },
                        stops: [
                            [0, Highcharts.getOptions().colors[0]],
                            [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                        ]
                    },
                    marker: {
                        radius: 2
                    },
                    lineWidth: 1,
                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    },
                    threshold: null
                }
            },

            series: [{
                type: 'line',
                name: 'TVOC',
                data: lawdata[1],
                tooltip: {
                valueSuffix: ' pgm'
                },
                yAxis: 0
                },{
                type: 'line',
                name: 'TVOC_BASELINE',
                data: lawdata[3],
                tooltip: {
                valueSuffix: ''
                },
                yAxis: 1
                }]
            });    
    //
    /*
        chart[2]=Highcharts.chart('container3', {
            chart: {
                zoomType: 'xy'
            },
            title: {
                text: 'TempController Log（絶対湿度、露点）'
            },
            subtitle: {
                text: document.ontouchstart === undefined ?
                        'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
            },
            xAxis: {
                type: 'datetime'
            },
            yAxis:[{
                min: 0,
                max: 20,
                title: {
                    text: '絶対湿度'
                },            
                labels: {
                format: '{value} kg/m3',
                style: {
                    color: Highcharts.getOptions().colors[0]
                }
            }
            }, {
                min: -20,
                max: 100,
                title: {
                    text: '露点'
                },
            labels: {
                format: '{value} ℃',
                style: {
                    color: Highcharts.getOptions().colors[1]
                }
            },
                opposite: true
            }],
            legend: {
                enabled: false
            },
            plotOptions: {
                area: {
                    fillColor: {
                        linearGradient: {
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: 1
                        },
                        stops: [
                            [0, Highcharts.getOptions().colors[0]],
                            [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                        ]
                    },
                    marker: {
                        radius: 2
                    },
                    lineWidth: 1,
                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    },
                    threshold: null
                }
            },

            series: [{
                type: 'line',
                name: '絶対湿度',
                data: lawdata[4],
                tooltip: {
                valueSuffix: ' kg/m3'
                },
                yAxis: 0
                },{
                type: 'line',
                name: '露点',
                data: lawdata[5],
                tooltip: {
                valueSuffix: ' ℃'
                },
                yAxis: 1
                }]
            });  
            */
    /*
        chart[3]=Highcharts.chart('container4', {
            chart: {
                zoomType: 'xy'
            },
            title: {
                text: 'TempController Log（ペルチェ温度、露点）'
            },
            subtitle: {
                text: document.ontouchstart === undefined ?
                        'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
            },
            xAxis: {
                type: 'datetime'
            },
            yAxis:[{
                min: -20,
                max: 100,
                title: {
                    text: 'ペルチェ湿度'
                },            
                labels: {
                format: '{value} ℃',
                style: {
                    color: Highcharts.getOptions().colors[0]
                }
            }
            }, {
                min: -20,
                max: 80,
                title: {
                    text: '露点'
                },
            labels: {
                format: '{value} ℃',
                style: {
                    color: Highcharts.getOptions().colors[1]
                }
            },
                opposite: true
            }],
            legend: {
                enabled: false
            },
            plotOptions: {
                area: {
                    fillColor: {
                        linearGradient: {
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: 1
                        },
                        stops: [
                            [0, Highcharts.getOptions().colors[0]],
                            [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                        ]
                    },
                    marker: {
                        radius: 2
                    },
                    lineWidth: 1,
                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    },
                    //threshold: null
                }
            },

            series: [{
                type: 'line',
                name: 'ペルチェ温度',
                data: lawdata[3],
                tooltip: {
                valueSuffix: ' ℃'
                },
                yAxis: 0
                },{
                type: 'line',
                name: '露点',
                data: lawdata[5],
                tooltip: {
                valueSuffix: ' ℃'
                },
                yAxis: 1
                }]
            });
            */
                        
        });
        document.getElementById("msg").innerHTML='';
        if(f) f();
}

function replaceAll(str, beforeStr, afterStr){
  var reg = new RegExp(beforeStr, "g");
  return str.replace(reg, afterStr);
}

function lsData(f){
    console.log(pathdir+selectedFile);
    $.getJSON(
    "/app/treetest/command",//url
    {"command":'ls', "arg":[pathdir+selectedFile]},//data
    function(data) {
    //dataがサーバから受け取るjson値
    $.each(data, 
    function(key, val) {
        rdata=val;
        //rdata = replaceAll(val,'<br>','\n');
        var p=document.getElementById('list');
        if(p) p.innerHTML=rdata;
    })
    })
}

function loadData(f){
    console.log(pathdir+selectedFile);
    if(selectedFile[selectedFile.length-1] !== 'v') selectedFile=selectedFile+'/*';
    console.log(pathdir+selectedFile);
    $.getJSON(
    "/app/treetest/command",//url
    {"command":'cat', "arg":[pathdir+selectedFile]},//data
    function(data) {
    //dataがサーバから受け取るjson値
    $.each(data, 
    function(key, val) {
        rdata=val;
        var p=document.getElementById('data');
        if(p) p.innerHTML=rdata;
    })
    })
}

function makeTree(f) {
    $.getJSON(
    "/app/treetest/command",//url
    {"command":'ls', "arg":[pathdir+'*/*/*/*']},//data
    function(data) {
    //dataがサーバから受け取るjson値
    $.each(data, 
    function(key, val) {
    //rdata = val.replace(/<br>/g,'\n');
    rdata = replaceAll(val,'<br>','\n');
    if( rdata[rdata.length-1]==='' ) rdata.pop();
    //rdata = rdata.split(',');
    rdata = rdata.split('\n');
    for(i=0;i<rdata.length;i++){
        if(rdata[i].indexOf(pathdir)>=0){
            rdata[i]=rdata[i].replace(':','');
            rdata[i]=rdata[i].replace(pathdir,'');
            rdata[i]='<ul><li name="tag">'+rdata[i]+'<ul>';
        } else
        if(rdata[i].indexOf('20')>=0){
            rdata[i]='<li name="tag">'+rdata[i]+'</li>';
        }
        if(rdata[i]===''){
            rdata[i]='</ul></li></ul>';
        }
            //console.log(rdata[i]);
    }
    var p=document.getElementById('tree1');
    p.innerHTML=rdata.join('\n');
    $(function(){$('#tree1').jstree();});
    $.jstree.defaults.core.expand_selected_onload=true;
        })
        if(f) f();
    })
}

function filenameDate(filename){
/*
 var now = new Date();
 filename=filename.replace('./data/','');
 console.log('filename='+filename);
 var month=now.getMonth()+1;
 if(month.length==1) month='0'+month;
 var day=now.getDate();
 if(day.length==1) day='0'+day;
 var hour=now.getHours();
 if(hour.length==1) hour='0'+hour;
 var min=now.getMinutes();
 if(min.length==1) min='0'+min;

 timedate =  (now.getYear()+1900)+''+month +''+day+''+hour+''+min;
 var f=filename.split('.');
 return f[0]+timedate+'.'+f[1];
 */
 return filename;
}
