const stream = require('stream')
const util = require('util')
const spawn = require('child_process').spawn

const statsKeys = ['user', 'pr', 'ni', 'virt', 'res', 'shr', 's', 'cpu', 'mem', 'time', 'command']

module.exports = (pid) => {
  return new TopStream({objectMode: true}, pid)
}

function TopStream(options, pid) {
  this.pid = pid
  stream.Readable.call(this, options)
}
util.inherits(TopStream, stream.Readable)

TopStream.prototype._read = function(size) {
  const fd = getTop(this.pid)
  fd.stdout.on('data', (data) => {
    this.push(parseTop(data))
  })
}

function getTop(pid) {
  const top = spawn('top', ['-b', '-p', pid])
  return top
}

const parseTop = (topLine) => {
  const lines = topLine.toString().split('\n')
  const processLine = lines[lines.length - 1]
  const pp = processLine.split(/\s+/)
  const len = statsKeys.length
  const statsObject = {}
  for (let i=0; i<len; i++) {
    statsObject[statsKeys[i]] = pp[i+2]
  }
  return JSON.stringify(statsObject)
}
