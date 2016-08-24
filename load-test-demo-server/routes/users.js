var express = require('express');
var router = express.Router();

var findLargest = require('find-largest');
var path = require('path');

var options = {
  dir: path.join(__dirname, '../../node_modules'),
  number: 3,
  // extension: 'js',
  // excluded: ['node_modules'],
  format: 'k'
};

// findLargest(options)
//   .then(function (largest) {
//     console.log(largest);
//   });

/* GET users listing. */
// var count = 0;
router.get('/', function(req, res, next) {
  findLargest(options)
    .then(function (largest) {
      // console.log(largest);
      res.json(largest);
    });
});

module.exports = router;
