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
const requestsPerSecond = 100

/**
 * Number of concurrent agents
 * @private
 */
const concurrentAgents = 4

/**
 * All issued requests counter
 * @private
 */
let requestsIssued = 0

/**
 * Successful request counter
 * @private
 */
let successfulRequests = 0

/**
 * Failed requests counter
 * @private
 */
let failedRequests = 0

/**
 * Hrtime tuple with test start timestamp
 * @private
 */
const testStart = process.hrtime()

/**
 * Array of response times from each successful request
 * @private
 */
const timeArray = []

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
  path: '/'
}

for (let a = 0; a < concurrentAgents; a++) {
  const agent = new Agent(agentOptions, options)
  agentArray.push(agent)
}

const requestDelay = 1000 / requestsPerSecond
agentArray.forEach((agent) => {
  const interval = setInterval(sendRequest.bind(null, agent), requestDelay)
})

function sendRequest(agent) {
  requestsIssued++;
  const start = process.hrtime();
  agent.request()
  .then(() => {
    const diff = process.hrtime(start)
    const stop = parseInt(diff[0] * 1e3 + diff[1]*1e-6)
    timeArray.push(stop)
    checkEnd('ok')
  }).
  catch((err) => {
    console.log('error: ', err);
    checkEnd('fail')
  })
}

let successResponses = 0
let failReponses = 0
function checkEnd (type) {
  if (type === 'ok') {
    successResponses++
  }
  else if (type === 'fail') {
    failReponses++
  }
  else {
    console.log('not recognised types')
  }

  const tDiff = getHrDiffTime(testStart)
  if (tDiff > testDuration) {
    stats.displayReport(testStart, timeArray, successResponses, failReponses, requestsIssued)
    process.exit(1)
  }
}

// https://www.airpair.com/node.js/posts/top-10-mistakes-node-developers-make
var getHrDiffTime = function(time) {
  // ts = [seconds, nanoseconds]
  var ts = process.hrtime(time)
  // convert seconds to miliseconds and nanoseconds to miliseconds as well
  return parseInt((ts[0] * 1000) + (ts[1] / 1000000))
}
