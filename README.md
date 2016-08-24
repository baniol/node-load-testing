`npm install`

Open in a separate terminal window `load-test-demo-server` and run `node bin/www`

the scripts creates concurrent agents and sends requests from each for a determined period of time (`testDuration`).

---
## options

* `testDuration` - the time request will be sent
* `requestsPerSecond` - number of requests pre second for each of the concurrent agents.
* `concurrentAgents`

## stats
req/sec - number of successfull requests per second within during the test
