var express = require('express');
var router = express.Router();
var appModel = require('../models/modelFile')


exports.render = (req, res, next) => {
    try{
        if(req.session.loggedin){
            renderPage(req,res);
        }else{
            res.redirect('/loginScreen')
        }
    }catch(err){
        res.redirect('/loginScreen');
    }

}


exports.post = (req, res, next) => {
    console.log("got a post");
    try{
        if(req.session.loggedin){
            renderPage(req,res);
        }else{
            res.redirect('/loginScreen')
        }
    }catch(err){
        res.redirect('/loginScreen')
    }


}

exports.renderForID = (req, res, next) =>{
    try{
        console.log("getting data for day is: " + JSON.stringify(req.body));
        if(req.session.loggedin){
            renderPage(req,res);
        }else{
            res.redirect('/loginScreen')
        }
    }catch(err){
        res.redirect('/loginScreen')
    }

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
            eventsDayEntryRows: theseRows,
            eventDayID: req.body.eventDayID
        });
    })

}
