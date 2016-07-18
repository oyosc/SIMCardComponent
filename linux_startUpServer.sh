#!/bin/bash 
kill `lsof -t -i:3013`
export projectName=SIMCardComponent
export server=simCardComponent.js
export logFile=log.txt
export errorLogFile=err.txt
#nohup supervisor $server > $logFile 2>&1 &
pm2 start $server --name $projectName  -o $logFile -e $errorLogFile
echo "To run $projectName..... Look at the start up log, press ctrl+c close the log file!"
tail -f $logFile
