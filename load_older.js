const Agent = require('./loadlib/agent')
const stats = require('./loadlib/stats')

/**
 * Duration of the load test in milliseconds
 * @private
 */
const testDuration = 10000

/**
 * Number of request per second for each concurrent agent
 * @private
 */
const requestsPerSecond = 1000
const requestDelay = 1000 / requestsPerSecond

/**
 * Number of concurrent agents
 * @private
 */
let concurrentAgents = 100

/**
 * All issued requests counter
 * @private
 */
let requestsIssued = 0

/**
 * Successful request counter
 * @private
 */
 let successResponses = 0

 // @TODO name?
 let tempCounter = 0

/**
 * Failed requests counter
 * @TODO api private?
 * @private
 */
let failReponses = 0

/**
 * Hrtime tuple with test start timestamp
 * @private
 */
const testStart = process.hrtime()

/**
 * Array of response times from each successful request
 * @private
 */
const requestArray = []

/**
 * Array of concurrent agent objects
 * @private
 */
const agentArray = []

/**
 * Object with settings for http.Agent
 * https://nodejs.org/api/http.html#http_new_agent_options
 * @private
 */
const agentOptions = {
  keepAlive:true,
  maxSockets:50
}

/**
 * Object with connection settings:
 * hostname, port, path
 * @private
 */
const options = {
  hostname: '192.168.33.13',
  port: 3000,
  path: '/table'
}

// Create concurrent agents
for (let a = 0; a < concurrentAgents; a++) {
  const agent = new Agent(agentOptions, options)
  agentArray.push(agent)
}

// ---------------



// Add agents in interval
// setTimeout(addAgent, 10000)
// setTimeout(addAgent, 20000)

startRequests()
startSampling()

function startRequests() {
  // Start issuing requests from each concurrent agent
  agentArray.forEach((agent) => {
    const interval = setInterval(sendRequest.bind(null, agent), requestDelay)
  })
}

let tempTime = testStart
// tempCounter = successResponses
// let doneResp = 0
function startSampling() {
  setInterval(() => {
    const report = stats.reqSec(tempCounter, tempTime)
    tempTime = process.hrtime()
    // console.log(report, tempCounter, getHrDiffTime(testStart))
    console.log(report, tempCounter, )
    tempCounter = 0

  }, 2000)
}

function addAgent() {
  concurrentAgents++
  const agent = new Agent(agentOptions, options)
  // agentArray.push()
  setInterval(sendRequest.bind(null, agent), requestDelay)
}

/**
 * Send one request from a http agent
 * @param {Object} agent
 * @private
 */
function sendRequest(agent) {
  requestsIssued++;
  const requestStartTime = process.hrtime();
  agent.request()
  .then(() => {
    requestArray.push({
      agents: concurrentAgents,
      responseTime: getHrDiffTime(requestStartTime)
    })
    checkEnd('ok')
  }).
  catch((err) => {
    console.log('error: ', err);
    checkEnd('fail')
  })
}

function checkEnd (type) {
  if (type === 'ok') {
    successResponses++
    // tempCounter++
  }
  else if (type === 'fail') {
    failReponses++
  }
  else {
    console.log('not recognised types')
  }

  if (getHrDiffTime(testStart) > testDuration) {
    stats.displayReport(testStart, requestArray, successResponses, failReponses, requestsIssued)
    process.exit(1)
  }
}
