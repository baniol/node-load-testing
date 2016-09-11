const stats = require('simple-statistics')
const fs = require('fs')
const columnify = require('columnify')
const utils = require('./utils')

function displayReport(hstart, requestArray, success, errors, issued, fdArray, cpuArray, memArray, end) {

  const elapsed = utils.getElapsedTime(hstart)
  console.log(`The test took ${elapsed/1000} seconds`)

  const mean = stats.mean(requestArray).toFixed(2)
  const req = getRequestRate(success, elapsed)

  function sortNumber(a,b) {
    return a - b
  }

  const data = {
    Requests: issued,
    Success: success,
    Erros: errors,
    'Req/sec': req,
    'Mean res time': mean
  }

  if (cpuArray.length > 0) {
    Object.assign(data, {'Cpu avg': getCpuAvg(cpuArray)})
  }
  if (memArray.length > 0) {
    Object.assign(data, {'Mem avg': getMemAvg(memArray)})
  }
  if (fdArray.length > 0) {
    Object.assign(data, {'Fd max': fdArray.sort(sortNumber).pop()})
  }

  console.log(columnify(data))
  end()

}

function getCpuAvg(cpuArray) {
  return stats.mean(cpuArray).toFixed(2)
}

function getMemAvg(memArray) {
  return stats.mean(memArray).toFixed(2)
}

function getRequestRate(success, time) {
  return ((success * 1000) / time).toFixed(2)
}

exports.displayReport = displayReport
