#!/bin/bash

if [ "$1" == "cluster" ]
then
  echo "cluster"
  node ../testserver/cluster.js &
else
  echo "single process"
  node ../testserver/bin/www &
fi

echo $! > pids
SERVER_PID=$!

while true; do lsof -p ${SERVER_PID} | grep ESTABLISHED | wc -l;sleep 0.1; done | nc -l 7778 -k &
echo $! >> pids
top -b -p ${SERVER_PID} | nc -l 7777 -k &
echo $! >> pids
