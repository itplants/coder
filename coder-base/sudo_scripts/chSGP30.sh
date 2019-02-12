#!/bin/sh
/usr/bin/sudo /bin/systemctl stop sgp30
echo  "#!/bin/sh\n/home/pi/src/SensorRec/sgp30.py -s $1" > /home/pi/src/SensorRec/sgp30.sh
/bin/cat /home/pi/src/SensorRec/sgp30.sh| /usr/bin/awk 'NR==2'
/usr/bin/sudo /bin/systemctl start sgp30
