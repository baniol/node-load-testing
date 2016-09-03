const cluster = require('cluster')

const cpuNumber = require('os').cpus().length;
// const cpuNumber = 4

if (cluster.isMaster) {

  for (let i = 0;i < cpuNumber; i++) {
    cluster.fork()
  }
  console.log(`Master PID: ${process.pid}`);

  for (const w in cluster.workers) {
    console.log(`worker ${w} PID: ${cluster.workers[w].process.pid}`);
  }

  cluster.on('exit', (worker, code) => {
    if (code != 0 && !worker.suicide) {
      console.log('worker crashed')
      cluster.fork()
    }
  })
}
else {
  require('./bin/www')
}
