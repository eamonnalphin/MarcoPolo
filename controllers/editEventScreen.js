var express = require('express');
var router = express.Router();
let appModel = require('../models/modelFile')


exports.render = (req, res, next) => {
    let eventID = "";
    try{
        if(req.session.loggedin){
            renderPage(req, res, false);
        }else{
            res.redirect('/loginScreen')
        }
    }catch(err){
        res.redirect('/loginScreen');
    }


}


exports.post = (req, res, next) => {
    console.log("Got a post.");
    let eventID = "";
    try{
        if(req.session.loggedin){
            renderPage(req, res, false);
        }else{
            res.redirect('/loginScreen')
        }
    }catch(err){
        res.redirect('/loginScreen')
    }

}

exports.updateEvent = (req, res, next) => {
    console.log("tyring to update event");
    let eventID = "";
    try{
        if(req.session.loggedin){
            appModel.updateEvent(req.body.eventID, req.body.eventName, req.body.eventDescription, function(outcome){
                renderPage(req,res,true);
            })
        }else{
            res.redirect('/loginScreen')
        }
    }catch(err){
        res.redirect('/loginScreen');
    }


}

exports.createNew = (req, res, next) =>{
    try{
        console.log("trying to create a new event");

        if(req.session.loggedin){
            renderPage(req, res, false);
        }else{
            res.redirect('/loginScreen')
        }
    }catch(err){
        res.redirect('/loginScreen')
    }

}


exports.editThisEventID = (req,res,next)=>{
    console.log("loading for: " + JSON.stringify(req.body));
    try{
        if(req.session.loggedin){
            renderPage(req, res, true);
        }else{
            res.redirect('/loginScreen')
        }
    }catch(err){
        res.redirect('/loginScreen');
    }


}

exports.saveEvent = (req, res, next) =>{

    try{
        if(req.session.loggedin){
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
        }else{
            res.redirect('/loginScreen')
        }
    }catch(err){
        res.redirect('/loginScreen');
    }


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
