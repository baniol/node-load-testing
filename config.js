exports.config = {
  numberOfRequests: 1000,
  requestsPerSecond: 20,
  concurrentAgents: 10,
  statStream: false
}

exports.agentConfig = {
  keepAlive:true,
  maxSockets:50
}
