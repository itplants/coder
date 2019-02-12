#!/bin/sh
/usr/bin/sudo /bin/systemctl stop O2rec
echo  "#!/bin/sh\n/home/pi/src/SensorRec/O2rec.py -s $1" > /home/pi/src/SensorRec/O2rec.sh
/bin/cat /home/pi/src/SensorRec/O2rec.sh| usr/bin/awk 'NR==2'
/usr/bin/sudo /bin/systemctl start O2rec
