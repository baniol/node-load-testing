const Transform = require('stream').Transform;

var pidStats = {};
var pagesize = 4096;

function hrtime() { var hr = process.hrtime(); return hr[0]*1e3 + hr[1]*1e-6 }

function transformStats(pid, content) {
  const stats = content.toString().split(" ").map(Number)
  const procTime = stats[13] + stats[14]
  var wallTime = hrtime()
  var cpuPerc = 0
  if (pidStats[pid]) {
    var last = pidStats[pid]
    cpuPerc = (procTime-last.procTime)*1000/(wallTime-last.wallTime)
  }
  pidStats[pid] = {procTime: procTime, wallTime: wallTime}
  // @TODO handle errors
  const ret = {
    pid: pid,
    cpuPercent: cpuPerc,          // Percent CPU taken
    cpuTime: procTime / 100,      // CPU time taken (sec)
    vmem: stats[22],              // Virtual memory (bytes)
    rss: stats[23] * pagesize,    // Resident mem (bytes)
    threads: stats[19],           // Threads count
  }
  return ret;
}

module.exports = transformStats
