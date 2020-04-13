var express = require('express');
var router = express.Router();

let index = require('../controllers/index')

/* GET home page. */
router.get('/', index.getLandingPage );
router.post('/', index.findSummoner)

module.exports = router;
