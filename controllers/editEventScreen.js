var express = require('express');
var router = express.Router();
let appModel = require('../models/modelFile')


exports.render = (req, res, next) => {
    let eventID = "";

    renderPage(req, res, false);
}


exports.post = (req, res, next) => {
    console.log("got a post");
}

exports.updateEvent = (req, res, next) => {
    console.log("tyring to update event");
    appModel.updateEvent(req.body.eventID, req.body.eventName, req.body.eventDescription, function(outcome){
        renderPage(req,res,true);
    })
}

exports.createNew = (req, res, next) =>{
    console.log("trying to create a new event");
    renderPage(req,res,false)
}


exports.editThisEventID = (req,res,next)=>{
    console.log("loading for: " + JSON.stringify(req.body));
    renderPage(req,res, true)

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

        res.redirect('/mainScreen')
    })
}


/**
 * Renders the page
 * @param res
 **/
function renderPage(req, res, viewExisting) {

    appModel.getAllEventDays(req.body.eventID, function(theseDays){
        res.render('editEventScreen', {
            title: req.body.eventName,
            eventID: req.body.eventID,
            eventName: req.body.eventName,
            eventDescription: req.body.eventDescription,
            eventsDaysRows: theseDays,
            viewExisting: viewExisting
        });
    })

}
