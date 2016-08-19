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
        resolve();
      }
      // @TODO - 400 codes reject ?
    });
    request.end(); // @TODO ?
    // request.destroy();
    request.on('error', (err) => {
      reject();
    });
  });
};

module.exports = Agent;
