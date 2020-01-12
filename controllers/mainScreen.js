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
        res.redirect('/loginScreen')
    }

}


exports.post = (req, res, next) => {
    console.log("Got a random post");
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


/**
 * Renders the page
 * @param res
 **/
function renderPage(req, res) {

    appModel.getAllEvents(req.session.userID, function(allMyEvents){
        res.render('mainScreen', {
            title: 'mainScreen',
            myEvents: allMyEvents
        });
    })

}
