exports.config = {
  numberOfRequests: 1000,
  requestsPerSecond: 20,
  concurrentAgents: 10
}

exports.agentConfig = {
  keepAlive:true,
  maxSockets:50
}

exports.requestConfig = {
  hostname: '192.168.33.13',
  port: 3000,
  path: '/'
}
