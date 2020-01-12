var express = require('express');
var router = express.Router();
let appModel = require('../models/modelFile');


exports.render = (req, res, next) => {
    let saltandpw = appModel.getsaltandpw("dummyPassword28");
    console.log("saltandpw:"+ JSON.stringify(saltandpw))
    req.session.loggedin = false;
    req.session.username = "";
    renderPage(res,"", false);
}


exports.post = (req, res, next) => {
    console.log("got an unknown post.");
}

exports.postAuth = (req, res, next) => {
    console.log("Got login attempt.");
    let username = req.body.username;
    let password = req.body.password;
    if(username && password){
        console.log("Verifying username and password");
        appModel.verifyLogin(username, password, function(outcome){
            if(outcome){
                console.log("username and password match. Logging in.")
                req.session.loggedin = true;
                req.session.username = username;
                res.redirect('/mainScreen');
            }else{
                console.log("username and password don't match.")
                renderPage(res,"Incorrect username or password.", false)
            }
        });
    }


}


/**
 * Renders the page
 * @param res
 **/
function renderPage(res, errorMessage, loggedInStatus) {
    res.render('loginScreen', {
        title: 'loginScreen',
        errorMessage: errorMessage,
        loggedInStatus: loggedInStatus
    });
}
