var express = require('express');
var router = express.Router();
var config = require('../../config/config');

module.exports = function (app) {
  app.use('/', router);
};

// Get Homepage
router.get('/', function(req, res){
  res.render('index');
});




//module.exports = router;
