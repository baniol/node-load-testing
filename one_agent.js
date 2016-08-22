'use strict'

const Agent = require('./loadlib/agent')
const stats = require('./loadlib/stats')

const concurrency = 2
const requestsPerSecond = 5
const iterations = 0

const timeLimit = 10000

let success = 0
let errors = 0
let iteration = 0

const agentOptions = {
  keepAlive:true,
  maxSockets:50
}
const options = {
  hostname: '192.168.33.13',
  port: 3000,
  path: '/users'
}

const hstart = process.hrtime();
const tStart = Date.now();

const timeArray = [];

const agents = []

for (let index = 0; index < concurrency; index++) {
  agents.push(new Agent(agentOptions, options))
}

const interval = setInterval(sendRequest, 1000 / requestsPerSecond)

function sendRequest () {
  for (let agent of agents) {
    // offset from loadtest.js l. 470:
    // start each client at a random moment in one second
    var offset = Math.floor(Math.random() * 1000);
		setTimeout(() => {
      // iteration++;
      // const tDiff = Date.now() - tStart;
      // if (iteration > (iterations * concurrency) || tDiff > timeLimit) {
      //   clearInterval(interval);
      //   stats.displayReport(hstart, timeArray, success, errors);
      //   process.exit(1);
      // }
      const start = process.hrtime();
      agent.request()
      .then((res) => {
        iteration++;
        const tDiff = Date.now() - tStart;
        console.log(tDiff, timeLimit);
        // if ((iterations > 0 && iteration > (iterations * concurrency)) || tDiff > timeLimit) {
        if (tDiff > timeLimit) {
          clearInterval(interval);
          stats.displayReport(hstart, timeArray, success, errors);
          process.exit(1);
        }
        // console.log(res.statusCode);
        const diff = process.hrtime(start);
        const stop = parseInt(diff[0] * 1e3 + diff[1]*1e-6);
        timeArray.push(stop);
        // console.log(timeArray.length);
        success++
      }).
      catch((err) => {
        // console.log(err)
        errors++
      })
    }, offset);
  }
}
