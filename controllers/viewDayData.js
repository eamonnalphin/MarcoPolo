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

        let i = 0;
        
        let macs = [];
        let starts = [];
        let ends = [];

        for(i = 0; i < theseRows.length; i++){
            let cur = theseRows[i];
            if(macs.includes(cur.MAC)){
                continue;
            }

            macs.push(cur.MAC);

            starts.push(cur.timestamp);
            
            let last = cur.timestamp;
            console.log(i);
    
            for(let j = i; j < theseRows.length; j++){
                console.log(j);
                console.log(theseRows[j]);

                if(theseRows[j].MAC == cur.MAC){
                    last = theseRows[j].timestamp;
                }
            }
            ends.push(last);
        }

        let objs = [];
        let k;
        for(k = 0; k < macs.length; k++){
            objs[k] = {
                mac: macs[k],
                start: starts[k],
                end: ends[k]
            }
        }

        console.log(objs);



        res.render('viewDayData', {
            eventName: req.body.eventName,
            startTime: req.body.startTime,
            endTime: req.body.endTime,
            eventsDayEntryRows: theseRows,
            eventDayID: req.body.eventDayID
        });
    })

}
