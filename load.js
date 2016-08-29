const Agent = require('./loadlib/agent')
const stats = require('./loadlib/stats')
const config = require('./config').config
const utils = require('./loadlib/utils')
const agentConfig = require('./config').agentConfig
const requestConfig = require('./config').requestConfig

const top = require('./client')
let topObject = {};

top.topStream.on('data', (data) => {
  const obj = top.parseTop(data.toString())
  topObject = obj;
});

const requestDelay = 1000 / config.requestsPerSecond
let requestsIssued = 0
let successResponses = 0
let failReponses = 0
let samplingResponses = successResponses
let samplingCounter = 0
const sampleRate = config.testDuration / config.samplingRate

let tempCounter = 0 // ?

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

console.log('% \t Req/sec \t Latency \t Cpu \t Memory')
const sampling = setInterval(startSampling, sampleRate)

function startRequests() {
  // Start issuing requests from each concurrent agent
  agentArray.forEach((agent) => {
    const interval = setInterval(sendRequest.bind(null, agent), requestDelay)
  })
}

function startSampling() {
  var reqsec = stats.partialRequestRate(samplingResponses, samplingTime)
  const latency = stats.getLatency(tempArray)
  samplingCounter = samplingCounter + config.samplingRate
  console.log(`${samplingCounter}  \t ${reqsec} \t ${latency} \t ${topObject.cpu} \t ${topObject.mem}`)
  samplingTime = process.hrtime()
  samplingResponses = 0
  tempArray = []
}

function sendRequest(agent) {
  requestsIssued++;
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
    samplingResponses++
    // tempCounter++
  }
  else if (type === 'fail') {
    failReponses++
  }
  else {
    console.log('not recognised types')
  }

  if (utils.getElapsedTime(testStart) > config.testDuration) {
    stats.displayReport(testStart, requestArray, successResponses, failReponses, requestsIssued)
    process.exit(1)
  }
}
