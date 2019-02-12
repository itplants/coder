#!/bin/sh
/usr/bin/sudo /bin/systemctl stop CO2rec
echo  "#!/bin/sh\n/home/pi/src/SensorRec/CO2rec.py -s $1" > /home/pi/src/SensorRec/CO2rec.sh
/bin/cat /home/pi/src/SensorRec/CO2rec.sh| usr/bin/awk 'NR==2'
/usr/bin/sudo /bin/systemctl start CO2rec
