#!/bin/bash

if [ -z "$*" ]; then echo "No args"; exit; fi

while true; do lsof  -p $1 | grep ESTABLISHED | wc -l;sleep 0.3; done | nc -l 7778 -k
top -b -p $1 | nc -l 7777 -k
