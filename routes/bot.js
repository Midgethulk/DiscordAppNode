var express = require('express');
var router = express.Router();
const botChan = require('../services/botChan.js').bot;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('bot/index', { title: 'Express' });
});

/* Start Bot. */
router.get('/start', function(req, res, next) {

  botChan.startBot()
  .then(
    function(){
      console.log("ok")
      res.json("Started");
    }
  )
  .catch(
    function(){
      console.log("nok")
      res.json("Failed to Start")
    }
  );
  
});

/* Stop Bot. */
router.get('/stop', function(req, res, next) {
  
  botChan.stopBot()
  .then(
    function(){
      console.log("ok")
      res.json("Stopped");
    }
  )
  .catch(
    function(){
      console.log("nok")
      res.json("Failed to Stop")
    }
  );

});

/* Uptime Bot. */
router.get('/uptime', function(req, res, next) {
  
  let response = "None"

  response = botChan.getUptime();

  res.json(response);
});

module.exports = router;
