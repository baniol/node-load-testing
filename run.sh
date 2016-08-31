#!/bin/bash

node testserver/bin/www &
echo $!
SERVER_PID=$!

while true; do lsof -p ${SERVER_PID} | grep ESTABLISHED | wc -l;sleep 0.3; done | nc -l 7778 -k &
echo $!
top -b -p ${SERVER_PID} | nc -l 7777 -k &
echo $!
