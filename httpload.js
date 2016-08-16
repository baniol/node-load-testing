var http = require('http');

function hrtime() { var hr = process.hrtime(); return hr[0]*1e3 + hr[1]*1e-6 }

const iterations = 100;

for (let i=0;i<iterations;i++) {
  createAgent();
}

let success = 0;
let errors = 0;

function createAgent () {
  var options = {
    keepAlive:true,
    maxSockets:10
  };

  var agent = new http.Agent(options);

  options = {
    hostname: '192.168.33.13',
    port: 3000,
    path: '/users',
    method: 'GET',
    agent: agent
  };
  const hrstart = process.hrtime();
  var request = http.request(options, (res) => {

    // console.log(res.statusCode);
    if (res.statusCode === 200) {
      const hrend = process.hrtime(hrstart);
      console.info("%ds %dms", hrend[0], Math.ceil(hrend[1]/1000000));
      success++;
    }
    // res.setEncoding('utf8');
    // res.on('data', function (chunk) {
    //   console.log('BODY: ' + chunk);
    // });
  });
  request.end();
  // request.destroy();
  request.on('error', (err) => {
    errors++;
    // console.log('Error: ', err);
  });
  // request.on('response', function(incomingMessage){
  //   console.log(incomingMessage.status);
  //   incomingMessage.on('readable', function(){
  //     var message = incomingMessage.read();
  //     console.log(message.toString());
  //   });
  // });
  // console.dir(agent);
}

setTimeout(() => {
  console.log('success: ', success);
  console.log('errors: ', errors);
}, 3000);
