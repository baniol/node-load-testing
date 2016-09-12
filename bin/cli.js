#!/usr/bin/env node

const minimist = require('minimist')
const fs = require('fs')
const config = require('../config').config
const load = require('../lib/load.js')

// example:
// simple-load-test -h myhost.com -p 3000 -u /path -r 20 -c 5 -n 100 -s 1

const argv = minimist(process.argv.slice(2), {
  alias: {h: 'host', p: 'port', u: 'uri', n: 'num-req', r: 'rate', c: 'concurrency', s: 'stats'}
})

if (argv.help) {
  return fs.createReadStream(__dirname + '/usage.txt').pipe(process.stdout)
}

const options = {
  host: argv.host,
  port: argv.port,
  path: argv.uri,
  numberOfRequests: argv['num-req'] || config.numberOfRequests,
  requestsPerSecond: argv.rate || config.requestsPerSecond,
  concurrentAgents: argv.concurrency || config.concurrentAgents,
  statStream: argv.stats || config.statStream
}

load.start(options)
