var express = require('express');
var router = express.Router();
var appModel = require('../models/modelFile');

exports.render = (req, res, next) => {
    renderPage(res);
}


exports.post = (req, res, next) => {
    console.log("got a post");
}


/**
 * Renders the page
 * @param res
 **/
function renderPage(res, loggedInStatus) {
    if(loggedInStatus){
        //user is logged in

        res.render('index', {
            title: 'index',
        });
    }else{
        res.redirect('/loginScreen');
    }

}
