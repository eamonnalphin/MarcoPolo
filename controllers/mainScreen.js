var express = require('express');
var router = express.Router();
var appModel = require('../models/modelFile')

exports.render = (req, res, next) => {
    renderPage(req,res);
}


exports.post = (req, res, next) => {
    console.log("got a post");
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
