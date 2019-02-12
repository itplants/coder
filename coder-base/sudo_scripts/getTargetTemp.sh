#!/bin/sh

/usr/bin/sudo /usr/bin/tail /home/coder/coder-dist/coder-base/data/tempController.log |grep targetTemp|/usr/bin/awk '{print substr(substr($2,12),0)}'

