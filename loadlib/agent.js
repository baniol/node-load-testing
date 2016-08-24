const http = require('http');

function Agent(agentCustomOptions, requestCustomOptions) {
  const agentDefaultOptions = {
    keepAlive:true,
    maxSockets:50
  };
  const agentOptions = Object.assign(agentDefaultOptions, agentCustomOptions);
  const agent = new http.Agent(agentOptions);
  const requestDefaultOptions = {
    method: 'GET',
    agent: agent
  };
  this.requestOptions = Object.assign(requestDefaultOptions, requestCustomOptions);
}

Agent.prototype.request = function () {
  return new Promise((resolve, reject) => {
    const request = http.request(this.requestOptions, (res) => {
      if (res.statusCode === 200) {
        resolve(res);
        request.destroy();
      }
      // @TODO - 400 codes reject ?
    });
    request.on('error', (err) => {
      reject(err);
      request.destroy();
    });
    request.end(); // @TODO ?
  });
};

module.exports = Agent;
