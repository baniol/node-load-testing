#!/bin/bash

while read line
do
    kill -9 ${line}
done <pids
echo "" > pids
