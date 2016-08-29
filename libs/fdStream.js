const stream = require('stream')
const util = require('util')
const spawn = require('child_process').spawn

module.exports = (pid) => {
  // return new StatsStream({objectMode: true}, pid)
  return getProcessFdNumber(pid)
}

function StatsStream(options, pid) {
  this.pid = pid
  stream.Readable.call(this, options)
  this.fd = getProcessFdNumber(this.pid)
}
util.inherits(StatsStream, stream.Readable)

StatsStream.prototype._read = function(size) {
  // setInterval(() => {
    this.fd.stdout.on('data', (data) => {
      this.push(JSON.stringify({type: 'fd', data: data.toString().replace(/\s/,'')}))
    })
  // }, 500)
}

function getProcessFdNumber(pid) {
  const watch = spawn('lsof', ['-p', pid])
  const grep = spawn('grep', ['ESTABLISHED'])
  const count = spawn('wc', ['-l'])
  grep.on('error', (e) => console.log(e))
  watch.stdout.pipe(grep.stdin)
  grep.stdout.pipe(count.stdin)
  // return JSON.stringify({type: 'fd', data: count.stdout})
  return count
}
