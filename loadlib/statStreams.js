const net = require('net');
const config = require('../config')
const Transform = require('stream').Transform

const topTransform = new Transform({
  transform(chunk, encoding, callback) {
    const str = chunk.toString()
    const parts = str.split(' ')
    const obj = {
      cpu: parts[0],
      mem: parts[1]
    }
    callback(null, JSON.stringify(obj))
  }
});

const topStream = net.connect({port: 7777, host: config.requestConfig.hostname}, () => {});
topStream.pipe(topTransform)

const fdStream = net.connect({port: 7778, host: config.requestConfig.hostname}, () => {});
fdStream.setEncoding('utf8')

exports.topStream = topTransform
exports.fdStream = fdStream
