var express = require('express')
var router = express.Router()

const data = require('../MOCK_DATA')

router.get('/', function(req, res, next) {
  // res.json(data)
  res.render('table', { items: data });
});

module.exports = router
