'use strict'

const cluster = require('cluster')

const cpuNumber = require('os').cpus().length
// const cpuNumber = 4

if (cluster.isMaster) {

  for (let i = 0;i < cpuNumber; i++) {
    cluster.fork()
  }
  console.log(`Master PID: ${process.pid}`)

  // 1)
  for (const w in cluster.workers) {
    console.log(`worker ${w} PID: ${cluster.workers[w].process.pid}`)
  }
  // OR better?
  // 2)
  cluster.on('online', function(worker) {
      console.log('Worker ' + worker.process.pid + ' is online');
  });

  cluster.on('exit', (worker, code) => {
    if (code != 0 && !worker.suicide) {
      console.log('worker crashed')
      cluster.fork()
      console.log(`worker started with  PID: ${worker.process.pid}`) //? not correct (PID of the crashed worker)
    }
  })
}
else {
  require('./bin/www')
}
