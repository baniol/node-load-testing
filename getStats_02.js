const fs = require('fs')
const Transform = require('stream').Transform;

function hrtime() { var hr = process.hrtime(); return hr[0]*1e3 + hr[1]*1e-6 }

var pidStats = {}
var pagesize = 4096

const pid = 5092

let streamFile

// 1)
const file = `/proc/${+pid}/stat`
streamFile = fs.createReadStream(file)

// 2)
const statsObject = new Transform({

  writableObjectMode: true,
  readableObjectMode: true,

  transform(chunk, encoding, callback) {
    // if (!res || err) return
    const stats = chunk.toString().split(" ").map(Number)
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
        // @TODO object mode?
    // this.push(JSON.stringify(ret))
    callback(null, JSON.stringify(ret))
  }
});

streamFile.pipe(statsObject)

// streamFile.on('end', () => {
//   streamFile = fs.createReadStream(file)
//   streamFile.pipe(statsObject)
// })

module.exports = statsObject
