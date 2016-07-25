const stats = require('./getStats_01')
const Readable = require('stream').Readable

// const callback = (err, res) => {
//   console.log(res)
// }
//
// console.log(stats(4396, callback))

class StatStream extends Readable {
  constructor(options) {
    super(options)
  }

  _read() {
    stats(4396, (err, res) => {
      this.push(res)
      // this.push(null)
    })
  }
}

const statstream = new StatStream({objectMode: true})

// statstream.pipe(process.stdout)

statstream.on('data', (res) => {
  console.log(res);
})
