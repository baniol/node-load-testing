const net = require('net');
require('buffer').Buffer
const client = net.connect({port: 1337, host: '192.168.33.13'}, () => {
  console.log('connected to server!');
});
client.on('data', (data) => {
  parseData(data.toString());
});
client.on('end', () => {
  console.log('disconnected from server');
});

function parseData(data) {
  const d = JSON.parse(data);
  console.log(d.cpuPercent);
  // try{
  //   const d = JSON.parse(data)
  //   // console.log(d);
  //   if (d.type === 'fd') {
  //     // console.log(d.data);
  //     // var b = Buffer.from(d.data.data.toString, 'utf8')
  //     console.log(d.data);
  //   }
  // }
  // catch(e) {
  //   console.log(e);
  // }
}
