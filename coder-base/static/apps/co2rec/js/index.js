var chart=[];
var lawdata=[];

/**
* KalmanFilter
* @class
* @author Wouter Bulten
* @see {@link http://github.com/wouterbulten/kalmanjs}
* @version Version: 1.0.0-beta
* @copyright Copyright 2015-2018 Wouter Bulten
* @license MIT License
* @preserve
*/
class KalmanFilter {

  /**
  * Create 1-dimensional kalman filter
  * @param  {Number} options.R Process noise
  * @param  {Number} options.Q Measurement noise
  * @param  {Number} options.A State vector
  * @param  {Number} options.B Control vector
  * @param  {Number} options.C Measurement vector
  * @return {KalmanFilter}
  */
  constructor({R = 1, Q = 1, A = 1, B = 0, C = 1} = {}) {

    this.R = R; // noise power desirable
    this.Q = Q; // noise power estimated

    this.A = A;
    this.C = C;
    this.B = B;
    this.cov = NaN;
    this.x = NaN; // estimated signal without noise
  }

  /**
  * Filter a new value
  * @param  {Number} z Measurement
  * @param  {Number} u Control
  * @return {Number}
  */
  filter(z, u = 0) {

    if (isNaN(this.x)) {
      this.x = (1 / this.C) * z;
      this.cov = (1 / this.C) * this.Q * (1 / this.C);
    }
    else {

      // Compute prediction
      const predX = this.predict(u);
      const predCov = this.uncertainty();

      // Kalman gain
      const K = predCov * this.C * (1 / ((this.C * predCov * this.C) + this.Q));

      // Correction
      this.x = predX + K * (z - (this.C * predX));
      this.cov = predCov - (K * this.C * predCov);
    }

    return this.x;
  }

  /**
  * Predict next value
  * @param  {Number} [u] Control
  * @return {Number}
  */
  predict(u = 0) {
    return (this.A * this.x) + (this.B * u);
  }
  
  /**
  * Return uncertainty of filter
  * @return {Number}
  */
  uncertainty() {
    return ((this.A * this.cov) * this.A) + this.R;
  }
  
  /**
  * Return the last filtered measurement
  * @return {Number}
  */
  lastMeasurement() {
    return this.x;
  }

  /**
  * Set measurement noise Q
  * @param {Number} noise
  */
  setMeasurementNoise(noise) {
    this.Q = noise;
  }

  /**
  * Set the process noise R
  * @param {Number} noise
  */
  setProcessNoise(noise) {
    this.R = noise;
  }
}

function changeSampling(sp){
    console.log('changeSampling='+sp);
    $.getJSON(
    "/app/co2rec/command",//url
    {"command":"chCO2rec.sh", "arg":[sp]},//data
    function(data) {
        $.each(data, 
        function(key, val) {
        rdata = val.split('<br>');
        });
        console.log('changeSampling='+rdata);
        var p=document.getElementById('recog');
        p.innerHTML='サンプリング時間は、'+sp+' sec になりました。';
    });
}

function loadSampling(){
    console.log('loadSampling');
    $.getJSON(
    "/app/o2rec/command",//url
    {"command":"cat", "arg":['/home/pi/src/SensorRec/CO2rec.sh']},//data
    function(data) {
        $.each(data, 
        function(key, val) {
        rdata = val.split('<br>');
        });
        samplingTime=rdata[1].split(' ')[2];
        console.log('loadSampling='+samplingTime);
        document.getElementById('sampling').value=samplingTime;
    });
}

//const kf = new KalmanFilter();
//kf.filter(2);

function loadOneDay(){
    date=new Date();
    year = date.getFullYear();
    
    month = String(date.getMonth()+1);
    if(month.length===1) month='0'+month;
    
    day = String(date.getDate());
    if(day.length===1) day='0'+day;
    
    hour = String(date.getHours());
    if(hour.length===1) hour='0'+hour;
    
    filename=year+'-'+month+'-'+day+'_'+'*.csv';
    dirpath='./SensorsData/CO2/'+year+'/'+month+'/'+day+'/';
    console.log('loadOneDay ls '+dirpath+filename);
    
    $.getJSON(
    "/app/co2rec/command",//url
    {"command":"ls", "arg":[dirpath+filename]},//data
    function(data) {
        $.each(data, 
        function(key, val) {
        rdata = val.split('<br>');
        });
        if(rdata[rdata.length-1]==='') rdata.pop();
        console.log('loadOneDay rdata='+rdata);
        makeGraph(rdata);
    });
}

var kalmanSW=false;

function kalmanSwitch(){
    kalmanSW = !kalmanSW;
    console.log('kalmanSwitch ='+kalmanSW);
    var p=document.getElementById('kalmansw1');
    if(p) p.checked=kalmanSW;
    console.log('kalmanSwitch ='+p.checked);
}

function filterdData(data){
if(kalmanSW===true){
    var noisyDataConstant = data;

    //Apply kalman filter
    var kalmanFilter = new KalmanFilter({R: 0.01, Q: 3});
    
    var dataConstantKalman = noisyDataConstant.map(function(v) {
      return kalmanFilter.filter(v);
    });

    return dataConstantKalman;
    } else {
    sd = standard_deviation(data);
    //console.log('filterdData SD='+sd);
    sd=3.0*sd;
    //console.log('data.length='+data.length);
    for(i=1;i<data.length-1;i++){
        //console.log('data='+data[i]);
        if(data[i] > data[i-1]+sd || data[i] < data[i-1]-sd){
            //console.log('illdata '+data[i]);
            data[i]=(data[i-1]+data[i+1])/2.0;
            }
        // remove illegral data
        if(data[i] < 10 ) data[i]=data[i-1];
            }
        return data;
    } 
}

function makeGraph(file, f) {
    if( file === undefined ) file=['./SensorsData/CO2/saveCO2data.csv'];
    console.log('makeGraph file='+file);
    getKalmanSW();
    
    $.getJSON(
    "/app/co2rec/command",//url
    {"command":"cat", "arg":file},//data
    function(data) {
        $.each(data, 
        function(key, val) {
        rdata = val.split('<br>');
        });
    if(rdata[rdata.length-1]==='') rdata.pop();
    console.log('makeGraph data='+rdata);
    var i=0;
    var date=[], CO2=[], co2=[];
    lawdata=new Array([]);
    for(i=0;i<6;i++) lawdata[i]=new Array([]);
    for(i=0;i<rdata.length;i++){
        
    var t=rdata[i].replace(/'Z,80'/g,'Z00').split(',');
    //2018-09-29 07:39:00,Z,00565,z,00562
    //console.log('makeGraph t='+t);
    date[i]  = Date.parse(t[0]);
    CO2[i]   = parseFloat(t[2]);
    co2[i]   = parseFloat(t[4]);
    
    console.log('makeGraph date='+date[i]+' CO2='+CO2[i]+' co2='+co2[i]+' kalmanSW='+kalmanSW);
    }

    if( kalmanSW===true ){
        CO2 = filterdData(CO2);
        co2 = filterdData(co2);
    }

    for(i=0;i<rdata.length;i++){
    // 10000 ppm以上の異常値を除去する
    //if(i > 0 && CO2 > 10000 ) CO2=lawdata[0][i-1][1];
    lawdata[0][i]=[date[i],CO2[i]];
    //if(i > 0 && co2 > 10000 ) co2=lawdata[1][i-1][1];
    lawdata[1][i]=[date[i],co2[i]];
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
                text: 'CO2 Log'
            },
            subtitle: {
                text: document.ontouchstart === undefined ?
                        'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
            },
            xAxis: {
                type: 'datetime'
            },
            yAxis:[{
                //min: 400,
                //max: 1000,
                title: {
                    text: 'CO2'
                },            
                labels: {
                format: '{value} ppm',
                style: {
                    color: Highcharts.getOptions().colors[0]
                }
            }
            }
            , 
            /*{
                //min: 400,
                //max: 1000,
                title: {
                    text: 'CO2 %'
                },
            labels: {
                format: '{value} %',
                style: {
                    color: Highcharts.getOptions().colors[1]
                }
            },
                opposite: true
            }*/
            
            ],
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
                name: 'CO2',
                data: lawdata[0],
                tooltip: {
                valueSuffix: ' ppm'
                },
                yAxis: 0
                },{
                type: 'line',
                name: 'real time CO2',
                data: lawdata[1],
                tooltip: {
                valueSuffix: ''
                },
                yAxis: 0
                }]
            });                         
        });
        document.getElementById("msg").innerHTML='';
        if(f) f();
}

function getKalmanSW(){
    //console.log('kalmanSwitch ='+kalmanSW);
    var p=document.getElementById('kalmansw1');
    if(p) kalmanSW=p.checked;
    console.log('getKalmanSW p='+p.checked);
}

$(document).ready( function() {
    loadSampling();
    getKalmanSW();
    makeGraph(['./SensorsData/CO2/saveCO2data.csv']);  
  setInterval(function() {
    getKalmanSW();
    makeGraph();
    }, 60000);

});