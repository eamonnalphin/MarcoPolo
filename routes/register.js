var express = require('express')
let registerController = require('../controllers/register');
var router = express.Router();

/*Get this page*/
router.get('/', registerController.render);

/*Handle a post*/
router.post('/', registerController.render);

router.post('/')

module.exports = router