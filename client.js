const net = require('net');
// require('buffer').Buffer
const client = net.connect({port: 7777, host: '192.168.33.13'}, () => {
  // console.log('connected to server!');
});
client.on('data', (data) => {
  parseTop(data.toString());
});
client.on('end', () => {
  console.log('disconnected from server');
});

exports.topStream = client
exports.parseTop = parseTop

const statsKeys = ['user', 'pr', 'ni', 'virt', 'res', 'shr', 's', 'cpu', 'mem', 'time', 'command']

function parseTop(data) {
  const lines = data.toString().split('\n')
  const processLine = lines[lines.length - 1]
  const pp = processLine.split(/\s+/)
  const len = statsKeys.length
  const statsObject = {}
  for (let i=0; i<len; i++) {
    statsObject[statsKeys[i]] = pp[i+2]
  }
  // return JSON.stringify(statsObject)
  return statsObject
}
