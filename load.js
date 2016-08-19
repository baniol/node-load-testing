const Agent = require('./loadlib/agent');
const stats = require('./loadlib/stats');

const iterations = 400;
const timeLimit = 40000;
const timeout = 50;

let success = 0;
let errors = 0;
let iteration = 0;

const interval = setInterval(createAgent, timeout);

const hstart = process.hrtime();
const tStart = Date.now();

const timeArray = [];

// ---
const agentOptions = {
  keepAlive:false,
  maxSockets:50
};
const options = {
  hostname: '192.168.33.13',
  port: 3000,
  path: '/users'
};

function createAgent() {
  iteration++;
  const tDiff = Date.now() - tStart;
  if (iteration > iterations || tDiff > timeLimit) {
    clearInterval(interval);
    stats.displayReport(hstart, timeArray, success, errors);
    process.exit(1);
  }
  const agent = new Agent(agentOptions, options);
  const start = process.hrtime();

  agent.request()
  .then(() => {
    const diff = process.hrtime(start);
    const stop = parseInt(diff[0] * 1e3 + diff[1]*1e-6);
    timeArray.push(stop);
    success++;
  }).
  catch(() => {
    errors++;
  })
}
