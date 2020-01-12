var express = require('express')
let viewDayDataController = require('../controllers/viewDayData');
var router = express.Router();

/*Get this page*/
router.get('/', viewDayDataController.render);

/*Handle a post*/
router.post('/', viewDayDataController.render);


router.post('/ID', viewDayDataController.renderForID);

module.exports = router