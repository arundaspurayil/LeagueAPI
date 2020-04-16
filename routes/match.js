var express = require('express');
var router = express.Router();

let match = require('../controllers/match')

/* GET users listing. */
router.get('/:summonerID', match.getCurrentGame);

module.exports = router;
