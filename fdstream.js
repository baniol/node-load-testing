const net = require('net');
// require('buffer').Buffer

// con();
// function con() {
  const client = net.connect({port: 7778, host: '192.168.33.13'}, () => {
    // console.log('connected to server!');
  });
  // client.setKeepAlive(true);
  client.setEncoding('utf8')
  // client.on('data', (data) => {
  //   parseFd(data);
  //   // client.write(data)
  // });
  client.on('end', () => {
    // console.log('disconnected from server');
  });

  client.on('close', () => {
    // setTimeout(con, 200);
    // net.connect({port: 7778, host: '192.168.33.13'});
  });
// }

function parseFd(data) {
  console.log(data);
}

module.exports = client
// exports.parseTop = parseTop
//
// const statsKeys = ['user', 'pr', 'ni', 'virt', 'res', 'shr', 's', 'cpu', 'mem', 'time', 'command']
//
// function parseTop(data) {
//   const lines = data.toString().split('\n')
//   const processLine = lines[lines.length - 1]
//   const pp = processLine.split(/\s+/)
//   const len = statsKeys.length
//   const statsObject = {}
//   for (let i=0; i<len; i++) {
//     statsObject[statsKeys[i]] = pp[i+2]
//   }
//   // return JSON.stringify(statsObject)
//   return statsObject
// }
