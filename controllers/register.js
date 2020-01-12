var express = require('express');
var router = express.Router();
var appModel = require('../models/modelFile')


exports.render = (req, res, next) => {
    renderPage(res);
}


exports.post = (req, res, next) => {
    console.log("got a post");
}


exports.registerNewUser = (req,res,next) => {
    console.log("registering: " + JSON.stringify(req.body));
    appModel.registerNewUser(req.body.username, req.body.password, function(outcome){
        if(outcome){
            appModel.verifyLogin(req.body.username, req.body.password, function(outcome){
                if(outcome){
                    console.log("username and password match. Logging in.")
                    appModel.getID(req.body.username, function(userID){
                        req.session.userID = userID;
                        req.session.loggedin = true;
                        req.session.username = req.body.username;
                        res.redirect('/mainScreen');
                    })

                }else{
                    console.log("username and password don't match.")
                    renderPage(res,"Incorrect username or password.", false)
                }
            });
        }else{
            console.log("error registering.")
            renderPage(res, "Error registering.", false);
        }
    })
}


/**
 * Renders the page
 * @param res
 **/
function renderPage(res, errorMessage) {
    res.render('register', {
        title: 'Register',
        errorMessage: errorMessage
    });
}
