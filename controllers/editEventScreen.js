var express = require('express');
var router = express.Router();
let appModel = require('../models/modelFile')


exports.render = (req, res, next) => {
    let eventID = ""
    renderPage(req, res, eventID);
}


exports.post = (req, res, next) => {
    console.log("got a post");
}


exports.editThisEventID = (req,res,next)=>{
    console.log("loading for: " + JSON.stringify(req.body));
    renderPage(req,res)

}

exports.saveEvent = (req, res, next) =>{
    console.log("trying to save an event: " + JSON.stringify(req.body))
    let eventName = req.body.eventName;
    let eventDescription = req.body.eventDescription;
    let adminID = req.session.userID;
    console.log("saving event for admin ID: " + adminID);


    appModel.createANewEvent(eventName, eventDescription, adminID, function(outcome){
        if(outcome){
            console.log("created event!")
        }else{
            console.log("error creating event.")
        }

        renderPage(req,res);
    })


    

}


/**
 * Renders the page
 * @param res
 **/
function renderPage(req, res) {

    appModel.getAllEventDays(req.body.eventID, function(theseDays){
        res.render('editEventScreen', {
            title: req.body.eventName,
            eventID: req.body.eventID,
            eventsDaysRows: theseDays
        });
    })

}
