var express = require('express')
let mainScreenController = require('../controllers/mainScreen');
var router = express.Router();

/*Get this page*/
router.get('/', mainScreenController.render);

/*Handle a post*/
router.post('/', mainScreenController.render);

module.exports = router