exports.config = {
  testDuration: 20000,
  requestsPerSecond: 50,
  concurrentAgents: 10,
  samplingRate: 10
}

exports.agentConfig = {
  keepAlive:true,
  maxSockets:50
}

exports.requestConfig = {
  hostname: '192.168.33.13',
  port: 3000,
  path: '/table'
}
