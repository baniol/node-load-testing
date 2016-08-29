const spawn = require('child_process').spawn

const pid = 4127;

// const topStream = require('./libs/topStream')(pid)

// topStream.on('readable', function() {
//   var chunk;
//   while((chunk = topStream.read()) !== null) {
//     // socket.write(JSON.stringify(chunk));
//     console.log(chunk);
//   }
// });

const fdStream = require('./libs/fdStream')(pid)

// fdStream.on('readable', function() {
//   var chunk;
//   while((chunk = fdStream.read()) !== null) {
//     // socket.write(JSON.stringify(chunk));
//     console.log(chunk);
//   }
// });
setInterval(() => {
  fdStream.stdout.pipe(process.stdin)
}, 1000)
