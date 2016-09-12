const Agent = require('./agent')
const stats = require('./stats')
const utils = require('./utils')
const agentConfig = require('../config').agentConfig

let config;
const cpuArray = []
const memArray = []
const fdArray = []
const progressArray = []

let requestDelay
let requestsIssued = 0
let successResponses = 0
let failReponses = 0
let totalResponses = 0

let testStart
const requestArray = []
const agentArray = []

exports.start = init

function init(options) {
  if (options) {
    config = options
  }
  requestDelay = 1000 / config.requestsPerSecond
  if (config.statStream) {
    const statStreams = require('./statStreams')
    const streams = statStreams.init(config)
    topStats(streams)
    fdStats(streams)
  }
  testStart = process.hrtime()
  const requestConfig = {
    hostname: config.host,
    port: config.port,
    path: config.path
  }
  for (let a = 0; a < config.concurrentAgents; a++) {
    const agent = new Agent(agentConfig, requestConfig)
    agentArray.push(agent)
  }
  startRequests()
}

/**
 * Remote TOP stats
 */
function topStats(statStreams) {
  const top = statStreams.topStream
  top.on('data', (data) => {
    const obj = JSON.parse(data.toString())
    cpuArray.push(obj.cpu)
    memArray.push(obj.mem)
  })
  // top.on('error', (err) => {
  //   console.log('top error');
  // })
}

/**
 * Remote lsof stats (opened file descriptors)
 */
function fdStats(statStreams) {
  const fdStream = statStreams.fdStream
  let fd = 0
  fdStream.on('data', (data) => {
    fd = parseInt(data.toString())
    fdArray.push(fd)
  })
  // fdStream.on('error', (err) => {
  //   console.log('fd error')
  // })
}

function startRequests() {
  // Start issuing requests from each concurrent agent
  agentArray.forEach((agent, index) => {
    setTimeout(() => {
      agent.interval = setInterval(sendRequest.bind(null, agent), requestDelay)
    }, 200 * index)
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
    requestArray.push(utils.getElapsedTime(requestStartTime))
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
