const Agent = require('./loadlib/agent')
const stats = require('./loadlib/stats')
const config = require('./config').config
const utils = require('./loadlib/utils')
const agentConfig = require('./config').agentConfig
const requestConfig = require('./config').requestConfig
const statStreams = require('./loadlib/statStreams')

const top = statStreams.topStream
let topObject = {} // @TODO not used ?
const cpuArray = [] // for final stats
const memArray = [] // for final stats
const progressArray = []
top.on('data', (data) => {
  const obj = JSON.parse(data.toString());
  topObject = obj
  cpuArray.push(obj.cpu)
  memArray.push(obj.mem)
});

const fdStream = statStreams.fdStream
let fd = 0
const fdArray = []
fdStream.on('data', (data) => {
  fd = parseInt(data.toString())
  fdArray.push(fd)
});

const requestDelay = 1000 / config.requestsPerSecond
let requestsIssued = 0
let successResponses = 0
let failReponses = 0
let totalResponses = 0

const testStart = process.hrtime()
let samplingTime = testStart
const requestArray = []
let tempArray = []
const agentArray = []

// --------------

for (let a = 0; a < config.concurrentAgents; a++) {
  const agent = new Agent(agentConfig, requestConfig)
  agentArray.push(agent)
}

startRequests()

function startRequests() {
  // Start issuing requests from each concurrent agent
  agentArray.forEach((agent) => {
    agent.interval = setInterval(sendRequest.bind(null, agent), requestDelay)
  })
}

function sendRequest(agent) {
  requestsIssued++;
  if (requestsIssued >= config.numberOfRequests) {
    clearInterval(agent.interval)
  }
  const requestStartTime = process.hrtime();
  agent.request()
  .then(() => {
    // @TODO Array pushes move to checkEnd success
    requestArray.push({
      agents: config.concurrentAgents,
      responseTime: utils.getElapsedTime(requestStartTime)
    })
    tempArray.push({
      agents: config.concurrentAgents,
      responseTime: utils.getElapsedTime(requestStartTime)
    })
    checkEnd('ok')
  }).
  catch((err) => {
    // console.log('error: ', err);
    checkEnd('fail')
  })
}

// @TODO change name
function checkEnd (type) {

  if (type === 'ok') {
    successResponses++
    totalResponses++
  }
  else if (type === 'fail') {
    failReponses++
    totalResponses++
  }
  else {
    console.log('not recognised types')
  }

  const p = parseInt((totalResponses / config.numberOfRequests) * 100, 10);
  if (p % 10 === 0 && progressArray.indexOf(p) === -1 && p > 0) {
    progressArray.push(p)
    console.log(`${p}% (success: ${successResponses}; errors: ${failReponses})`);
  }


  if (totalResponses >= config.numberOfRequests) {
    stats.displayReport(testStart, requestArray, successResponses, failReponses, requestsIssued, fdArray, cpuArray, memArray, () => {
      process.exit(1)
    })
  }
}
