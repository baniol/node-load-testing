'use strict'

var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  for (let i = 1e7; i > 0; --i) {}
  res.send('served');
});

module.exports = router;
