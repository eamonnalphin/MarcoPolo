var express = require('express')
let loginController = require('../controllers/loginScreen');
var router = express.Router();

/*Get this page*/
router.get('/', loginController.render);

/*Handle a post*/
router.post('/', loginController.render);

router.post('/auth', loginController.postAuth);

router.post('/register', loginController.register);

module.exports = router