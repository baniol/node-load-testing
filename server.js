const net = require('net');
const StatStream = require('./libs/getStats');

const statstream = new StatStream({objectMode: true})

const server = net.createServer((socket) => {
  console.log('client connected');
  statstream.on('readable', function() {
    var chunk;
    while((chunk = statstream.read()) !== null) {
      socket.write(JSON.stringify(chunk));
    }
  });
});
server.on('error', (err) => {
  throw err;
});
server.listen(1337, () => {
  console.log('server bound');
});
