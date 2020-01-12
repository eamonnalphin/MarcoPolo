var express = require('express')
let editEventScreenController = require('../controllers/editEventScreen');
var router = express.Router();

/*Get this page*/
router.get('/', editEventScreenController.render);


/*Handle a post*/
router.post('/', editEventScreenController.render);

router.post('/saveEvent', editEventScreenController.saveEvent);

router.post('/ID',editEventScreenController.editThisEventID);

router.post('/createNew',editEventScreenController.createNew);

router.post('/updateEvent', editEventScreenController.updateEvent);

router.post('/deleteEvent', editEventScreenController.deleteEvent);

module.exports = router