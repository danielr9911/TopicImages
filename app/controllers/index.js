var express = require('express');
var router = express.Router();

module.exports = function (app) {
  app.use('/', router);
};

// Get Homepage
router.get('/', function(req, res){
  res.render('index');
});


function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else {
    //req.flash('error_msg','You are not logged in');
    res.redirect('/login');
  }
}

//module.exports = router;
