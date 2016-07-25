const stats = require('./getStats_02')

stats.pipe(process.stdout)

// stats.on('readable', function() {
//   var chunk;
//   while((chunk = stats.read()) !== null) {
//     console.log(chunk);
//     // const obj = {
//     //   type: 'fd',
//     //   pid: pid,
//     //   // top: parseTop(chunk.toString())
//     //   top: chunk.toString().replace(/\s+/, '')
//     // }
//     // socket.write(JSON.stringify(obj));
//   }
// });
