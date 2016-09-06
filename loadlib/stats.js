const stats = require('simple-statistics')
const Table = require('cli-table')
const fs = require('fs')
const columnify = require('columnify')

function displayReport(hstart, requestArray, success, errors, issued, fdArray, cpuArray, memArray, end) {

  // @TODO unify
  const hdiff = process.hrtime(hstart)
  const hstop = parseInt(hdiff[0] * 1e3 + hdiff[1]*1e-6)
  console.log(`The test took ${hstop/1000} seconds`)

  const timeArray = requestArray.map((el) => el.responseTime)
  // const agents = requestArray.map((el) => el.agents)
  //
  // writeFiles(timeArray, agents);

  const mean = stats.mean(timeArray).toFixed(2)
  const req = partialRequestRate(success, hstart)

  function sortNumber(a,b) {
    return a - b
  }

  // const cpuMax = cpuArray.sort(sortNumber).pop()
  const fdMax = fdArray.sort(sortNumber).pop()
  const cpuAvg = getPartialCpu(cpuArray)
  const memAvg = getMemAvg(memArray)

  const data = {
    Requests: issued,
    Success: success,
    Erros: errors,
    'Req/sec': req,
    Mean: mean,
    'Cpu avg': cpuAvg,
    'Mem avg': memAvg,
    'Fd max': fdMax
  }

  console.log(columnify(data))
  end()

}

function getLatency(requestArray) {
  const timeArray = requestArray.map((el) => el.responseTime)
  return stats.mean(timeArray).toFixed(2)
}

// @TODO change name
function getPartialCpu(cpuArray) {
  return stats.mean(cpuArray).toFixed(2)
}

function getMemAvg(memArray) {
  return stats.mean(memArray).toFixed(2)
}

function partialRequestRate(success, hstart) {
  // @TODO unify
  const hdiff = process.hrtime(hstart)
  const hstop = parseInt(hdiff[0] * 1e3 + hdiff[1]*1e-6)
  return ((success * 1000) / hstop).toFixed(2)
}

function writeFiles (timeArray, agents) {
  fs.writeFileSync('./charts/agents.js', `var ra = ${JSON.stringify(agents)}`)
  fs.writeFileSync('./charts/timearray.js', `var ta = ${JSON.stringify(timeArray)}`)
}

exports.displayReport = displayReport
exports.partialRequestRate = partialRequestRate
exports.getPartialCpu = getPartialCpu
exports.getMemAvg = getMemAvg
exports.getLatency = getLatency
