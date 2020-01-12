var express = require('express');
var router = express.Router();
let appModel = require('../models/modelFile');


exports.render = (req, res, next) => {
    req.session.loggedin = false;
    req.session.username = "";
    renderPage(res,"", false);
}


exports.post = (req, res, next) => {
    console.log("got an unknown post.");
    req.session.loggedin = false;
    req.session.username = "";
    renderPage(res,"", false);
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
                appModel.getID(username, function(userID){
                    req.session.userID = userID;
                    req.session.loggedin = true;
                    req.session.username = username;
                    res.redirect('/mainScreen');
                })
               
            }else{
                console.log("username and password don't match.")
                renderPage(res,"Incorrect username or password.", false)
            }
        });
    }
}


exports.register = (req,res,next) => {
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
function renderPage(res, errorMessage, loggedInStatus) {
    res.render('loginScreen', {
        title: 'loginScreen',
        errorMessage: errorMessage,
        loggedInStatus: loggedInStatus
    });
}
