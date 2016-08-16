var http = require('http');

function hrtime() { var hr = process.hrtime(); return hr[0]*1e3 + hr[1]*1e-6 }

function createAgent () {
  var keepaliveAgent = new Agent({
    maxSockets: 100,
    maxFreeSockets: 10,
    timeout: 60000,
    keepAliveTimeout: 30000 // free socket keepalive for 30 seconds
  });

  var options = {
    host: '192.168.33.13',
    port: 3000,
    path: '/users',
    method: 'GET',
    agent: keepaliveAgent
  };

  return http.request(options);

  // var req = http.request(options, function (res) {
    // console.log('STATUS: ' + res.statusCode);
    // console.log('HEADERS: ' + JSON.stringify(res.headers));
    // res.setEncoding('utf8');
    // res.on('data', function (chunk) {
    //   console.log('BODY: ' + chunk);
    // });
  // });
}

module.exports = createAgent;

// req.on('error', function (e) {
//   console.log('problem with request: ' + e.message);
// });
// req.end();

// setTimeout(function () {
//   console.log('keep alive sockets:');
//   console.log(keepaliveAgent.unusedSockets);
// }, 2000);
