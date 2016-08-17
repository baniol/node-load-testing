const http = require('http');
const stats = require('simple-statistics');

const iterations = 2000;

const timeLimit = 40000;

let success = 0;
let errors = 0;
let iteration = 0;

const timeout = 40;

const interval = setInterval(createAgent, timeout);

const hstart = process.hrtime();
const tStart = Date.now();

const timeArray = [];

function createAgent () {
  iteration++;
  const tDiff = Date.now() - tStart;
  if (iteration > iterations || tDiff > timeLimit) {
    clearInterval(interval);
    displayReport();
    process.exit(1);
  }
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
  const start = process.hrtime();
  var request = http.request(options, (res) => {

    // console.log(res.statusCode);
    if (res.statusCode === 200) {
      const diff = process.hrtime(start);
      const stop = parseInt(diff[0] * 1e3 + diff[1]*1e-6);
      timeArray.push(stop);
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

function displayReport() {
  const hdiff = process.hrtime(hstart);
  const hstop = parseInt(hdiff[0] * 1e3 + hdiff[1]*1e-6);
  console.log(`The test took ${hstop/1000} seconds`);
  const mean = stats.mean(timeArray);
  const req = ((success * 1000) / hstop).toFixed(2);
  console.log('success: ', success);
  console.log('errors: ', errors);
  console.log('req/sec: ', req);
  console.log('mean: ', mean);
}
