var express = require('express');
let indexController = require('../controllers/index');
var router = express.Router();

/* GET home page. */
router.get('/', indexController.render);

router.post('/', indexController.post);

module.exports = router;
