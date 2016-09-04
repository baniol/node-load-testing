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
while true; do top -b -n 1 -p ${SERVER_PID} | tail -n 1 | awk "{print \$9,\$10}";sleep 0.2;done | nc -l 7777 -k &
echo $! >> pids
