var express = require('express');
var router = express.Router();
let appModel = require('../models/modelFile')


exports.render = (req, res, next) => {
    renderPage(res);
}


exports.post = (req, res, next) => {
    console.log("got a post");
}

exports.saveEvent = (req, res, next) =>{
    console.log("trying to save an event: " + JSON.stringify(req.body))
    let eventName = req.body.eventName
    let eventDescription = req.body.eventDescription
    let adminID = req.session.userID
    console.log("saving event for admin ID: " + adminID);

    appModel.createANewEvent(eventName, eventDescription, adminID, function(outcome){
        if(outcome){
            console.log("created event!")
        }else{
            console.log("error creating event.")
        }

        renderPage(res);
    })


    

}


/**
 * Renders the page
 * @param res
 **/
function renderPage(res) {
    res.render('editEventScreen', {
        title: 'editEventScreen'
    });
}
