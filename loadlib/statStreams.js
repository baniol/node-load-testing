const net = require('net');
const config = require('../config')

const topStream = net.connect({port: 7777, host: config.requestConfig.hostname}, () => {});
// topStream.on('data', (data) => {
//   parseTop(data.toString());
// });
// topStream.on('end', () => {
//   console.log('disconnected from server');
// });

const fdStream = net.connect({port: 7778, host: config.requestConfig.hostname}, () => {});
// fdStream.setKeepAlive(true);
fdStream.setEncoding('utf8')
fdStream.on('end', () => {
  // console.log('disconnected from server');
});
// fdStream.on('close', () => {);

exports.topStream = topStream
exports.parseTop = parseTop
exports.fdStream = fdStream

const statsKeys = ['user', 'pr', 'ni', 'virt', 'res', 'shr', 's', 'cpu', 'mem', 'time', 'command']

function parseTop(data) {
  const str = data.toString()
  const parts = str.split(' ')
  return {
    cpu: parts[0],
    mem: parts[1]
  }
}
