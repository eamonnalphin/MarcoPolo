var express = require('express');
var router = express.Router();


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
function renderPage(res) {
    res.render('register', {
        title: 'Register'
    });
}
