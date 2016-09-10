const stats = require('simple-statistics')
const fs = require('fs')
const columnify = require('columnify')
const utils = require('./utils')

function displayReport(hstart, requestArray, success, errors, issued, fdArray, cpuArray, memArray, end) {

  const elapsed = utils.getElapsedTime(hstart)
  console.log(`The test took ${elapsed/1000} seconds`)

  const mean = stats.mean(requestArray).toFixed(2)
  const req = getRequestRate(success, hstart)

  function sortNumber(a,b) {
    return a - b
  }

  const fdMax = fdArray.sort(sortNumber).pop()
  const cpuAvg = getCpuAvg(cpuArray)
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

function getCpuAvg(cpuArray) {
  return stats.mean(cpuArray).toFixed(2)
}

function getMemAvg(memArray) {
  return stats.mean(memArray).toFixed(2)
}

function getRequestRate(success, hstart) {
  return ((success * 1000) / utils.getElapsedTime(hstart)).toFixed(2)
}

exports.displayReport = displayReport
