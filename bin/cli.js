#!/usr/bin/env node

var minimist = require('minimist');
var fs = require('fs');

var load = require('../lib/load.js');

var argv = minimist(process.argv.slice(2), {
  alias: {h: 'help', n: 'num-req', r: 'rate', c: 'concurrency'}
});

if (argv.help) {
  return fs.createReadStream(__dirname + '/usage.txt').pipe(process.stdout);
}

const options = {
  numberOfRequests: argv['num-req'],
  requestsPerSecond: argv.rate,
  concurrentAgents: argv.concurrency
}

load.start(options)
