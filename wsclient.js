const WebSocketClient = require('websocket').client;

const wsurl = 'localhost:8080';

createClient();

function createClient() {
  const client = new WebSocketClient();

  client.on('connect', (connection) => {
    connection.on('message', (message) => {
      if (message.type === 'utf8') {
        // console.log(`Received: ${message.utf8Data}`);
        // const data = JSON.parse(message.utf8Data);
        // if (data && data.outlet) {
        //   // authorisedCount++;
        //   subscribe(connection);
        // }
      }
    });
    connection.send('asdfasdf');
  });

  client.on('connectFailed', (error) => {
    console.log(`Connect Error: ${error.toString()}`);
  });
  client.connect(`ws://${wsurl}`, 'echo-protocol', 'http://visualisation.performgroup.com');
  return client;
}
