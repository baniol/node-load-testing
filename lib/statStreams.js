const net = require('net')
const Transform = require('stream').Transform

// @TODO ports to config
function init(config) {
  const topStream = net.connect({port: 7777, host: config.host}, () => {})
  topStream.pipe(topTransform)

  const fdStream = net.connect({port: 7778, host: config.host}, () => {})
  fdStream.setEncoding('utf8')
  return {topStream: topTransform, fdStream}
}

const topTransform = new Transform({
  transform(chunk, encoding, callback) {
    const str = chunk.toString()
    const parts = str.split(' ')
    const obj = {
      cpu: parts[0],
      mem: parseFloat(parts[1].trim())
    }
    callback(null, JSON.stringify(obj))
  }
})

exports.init = init
