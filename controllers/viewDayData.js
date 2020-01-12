var express = require('express');
var router = express.Router();
var appModel = require('../models/modelFile')


exports.render = (req, res, next) => {
    renderPage(req,res);
}


exports.post = (req, res, next) => {
    console.log("got a post");
}

exports.renderForID = (req, res, next) =>{
    console.log("getting data for day is: " + JSON.stringify(req.body));
    renderPage(req,res)
}


/**
 * Renders the page
 * @param res
 **/
function renderPage(req,res) {

    appModel.getAllEventDayEntriesForDayID(req.body.eventDayID,function(theseRows){
        res.render('viewDayData', {
            eventName: req.body.eventName,
            startTime: req.body.startTime,
            endTime: req.body.endTime,
            eventsDayEntryRows: theseRows
        });
    })

}
