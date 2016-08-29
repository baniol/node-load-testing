exports.getElapsedTime = function(time) {
  var ts = process.hrtime(time)
  return parseInt((ts[0] * 1e3) + (ts[1] * 1e-6))
}
