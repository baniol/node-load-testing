const fs = require('fs');
const Readable = require('stream').Readable;

var pidStats = {};
var pagesize = 4096;

const pid = 4051;

let streamFile;

const file = `/proc/${+pid}/stat`;

function readFile() {
  return new Promise((resolve, reject) => {
    fs.readFile(file, 'utf8', (err, data) => {
      // @TODO reject error
      if (err) throw err;
      resolve(data);
    });
  });
}

class StatStream extends Readable {
  constructor(options) {
    super(options)
  }

  _read() {
    setTimeout(() => {
      readFile().then((content) => {
        // @TODO
        var w = require('./transformStats')(pid, content);
        this.push(w);
      })
    }, 500);
  }
}

module.exports = StatStream
