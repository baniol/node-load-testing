exports.config = {
  testDuration: 10000,
  requestsPerSecond: 30,
  concurrentAgents: 5,
  samplingRate: 10
}

exports.agentConfig = {
  keepAlive:true,
  maxSockets:50
}

exports.requestConfig = {
  // hostname: '52.57.29.116',
  hostname: '192.168.33.13',
  port: 3000,
  path: '/'
}
