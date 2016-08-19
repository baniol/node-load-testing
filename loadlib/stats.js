const stats = require('simple-statistics');

function displayReport(hstart, timeArray, success, errors) {
  const hdiff = process.hrtime(hstart);
  const hstop = parseInt(hdiff[0] * 1e3 + hdiff[1]*1e-6);
  console.log(`The test took ${hstop/1000} seconds`);
  const mean = stats.mean(timeArray);
  const req = ((success * 1000) / hstop).toFixed(2);
  console.log('success: ', success);
  console.log('errors: ', errors);
  console.log('req/sec: ', req);
  console.log('mean: ', mean);
}

exports.displayReport = displayReport;
