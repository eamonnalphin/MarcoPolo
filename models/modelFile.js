let db = require('../util/database');
let crypto = require('crypto')
let moment = require('moment');



/**
 * Creates a salt for a password and returns the salt and encrypted password.
 * @param thisPassword the password to encrypt
 */
function getEncryptedPasswordAndNewSalt(password){
    //1. create a "salt"
    let salt = crypto.randomBytes(16).toString('hex');

    //2. use the salt to create a password
    let encryptedPassword = crypto.pbkdf2Sync(
        password,
        salt,
        1000,
        64,
        'sha512'
    ).toString('hex');

    let saltAndEncryptedPWord = {
        salt: salt,
        encryptedPassword: encryptedPassword
    }

    return saltAndEncryptedPWord

}


/**
 * Returns true if a username and password matches.
 * @param username
 * @param password
 */
function verifyLogin(username, password, callback){
    //1. check for the username.
    console.log("Verifying login");
    verifyUsername(username, function(outcome, salt){
        if(outcome){
            console.log("Verifying login: username found")
            //2. username was found and matches, now verify password using the retrieved salt.
            verifyPassword(username, password, salt, function(outcome){
                //3. return the outcome of the login attempt
                if(outcome){
                    console.log("Verifying login: password matches.");
                    callback(true); //username and password match.
                }else{
                    callback(false); //username and password do not match.
                }
            })
        }else{
            //username was not found or doesn't match.
            callback(false);
        }
    })

}

/**
 * Verifies that the username exists and retrieves that salt for that username.
 * @param userName
 * @param callback
 */
function verifyUsername(username, callback){
    console.log("Verifying username: " + username);
    username = username.trim();//remove all whitespace
    let checkCommand = "SELECT USERNAME, SALT FROM ADMINLOGIN WHERE USERNAME = ? LIMIT 1";
    let outcome = false;
    let salt = "";

    db.pool.getConnection((err,connection)=>{
        connection.query(checkCommand,[username], function(err, results){
            if(!err){
                try{
                    //console.log("results : " + JSON.stringify(results));
                    if(results[0].USERNAME === username){
                        console.log("Verifying username: verified.");
                        outcome = true;
                        salt = results[0].SALT.toString('hex');
                    }else{
                        console.log("Verifying username: not verified.");
                        outcome = false;
                    }
                }catch(tryerr){
                    console.log("Error checking username: " + tryerr);
                    outcome = false;
                }
            }else{
                console.log("Error checking username: " + err);
                outcome = false;
            }

            connection.release();
            callback(outcome, salt)
        })
    })
}

/**
 * Verifies that the username and password pair match, using the given salt.
 * @param username
 * @param password
 * @param salt
 * @param callback
 */
function verifyPassword(username, password,salt,callback){
    console.log("Verifying password");
    //1. use the salt to create the password
    let encryptedPassword = crypto.pbkdf2Sync(
        password,
        salt,
        1000,
        64,
        'sha512'
    ).toString('hex');

    //2. Check if this password matches what's saved.
    let checkCommand = "SELECT PASSWORD FROM ADMINLOGIN WHERE USERNAME = ? AND PASSWORD = ? LIMIT 1;";
    let outcome = false;
    db.pool.getConnection((err,connection)=>{
        connection.query(checkCommand, [username, encryptedPassword], (err, results) => {
            if(!err){
                try{
                    console.log("result: " + JSON.stringify(results));
                    if(results[0].PASSWORD === encryptedPassword){
                        outcome = true;
                    }else{
                        outcome = false;
                    }
                }catch (tryErr){
                    console.log("Error checking password: " + tryErr);
                    outcome = false;
                }
            }else{
                console.log("Error verifying password: " + err);
                outcome = false;
            }

            connection.release()
            callback(outcome);

        })
    })

}

function registerNewUser(userName,password,callback){
    let insertCommand = "INSERT INTO ADMINLOGIN (username, password, salt) VALUES (?, ?, ?);"

    let PS = getEncryptedPasswordAndNewSalt(password);
    let outcome = false;

    db.pool.getConnection((err, connection)=> {
        connection.query(insertCommand, [userName, PS.encryptedPassword, PS.salt], (err, rows) => {
            if (!err) {
                console.log("success.")
                outcome = true;
            } else {
                console.log("error: " + err)
            }
            callback(outcome)

        })
    })

}

/**
 * Gets the id for the given username. 
 * @param {*} username 
 * @param {*} callback 
 */
function getIDForUser(userName,callback){
    let getCommand = "SELECT ID FROM ADMINLOGIN WHERE USERNAME = ?"
    let userID = ""

    db.pool.getConnection((err, connection)=>{
        connection.query(getCommand,[userName], (err,rows)=>{
            if(!err){
                try{
                    console.log("Rows pulled:" + JSON.stringify(rows))
                    userID = rows[0].ID
                   
                } catch (tryErr){
                    console.log("Error try to pull rows" + tryerr)
                }
            }
            
            callback(userID);
            
        })

    })
}

/**
 * Creates a new event
 * @param {*} eventName 
 * @param {*} eventDescription 
 * @param {*} adminID 
 * @param {*} callback 
 */
function createNewEvent(eventName, eventDescription, adminID, callback) {
    let insertCommand = "INSERT INTO EVENT (NAME, DESCRIPTION, ADMINID) VALUES (?, ?, ?)"
    let outcome = false 

    db.pool.getConnection((err, connection)=>{
        connection.query(insertCommand, [eventName, eventDescription, adminID], (err,rows)=>{
            if(!err){
                console.log("Rows affected: " + JSON.stringify(rows))
                outcome = true;

            }else{
                console.log("Error: " + err)
                outcome = false
            }

            callback(outcome);

        })
    })

}


/**
 * Get all events for this admin ID
 * @param adminID
 * @param callback
 */
function getAllEvents(adminID, callback){
    let getCommand = "SELECT ID, NAME, DESCRIPTION FROM EVENT WHERE ADMINID = ?"

    let outcome = false
    let theseRows = []

    console.log("ADMINID: " + adminID);
    db.pool.getConnection((err, connection)=>{
        connection.query(getCommand, [adminID], (err, rows)=>{
            if(!err){
                console.log("rows: " + JSON.stringify(rows));
                theseRows = rows;
            }else{
                console.log("Error: " + err);
                outcome = false;
            }

            callback(theseRows);

        })
    })
}


/**
 * GEt all event days for a given event ID
 * @param eventID
 * @param callback
 */
function getAllRawEventsDays(eventID, callback){

    let getCommand = "SELECT\n" +
        "  EVENTDAY.ID AS ID,\n" +
        "  COUNT(DISTINCT EVENTDAYENTRY.MAC) AS ATTENDEES,\n" +
        "  EVENTDAY.TIMESTART,\n" +
        "  EVENTDAY.TIMEEND,\n" +
        "  EVENTDAY.NOTE\n" +
        "FROM\n" +
        "  EVENTDAY\n" +
        "LEFT JOIN EVENTDAYENTRY ON EVENTDAYENTRY.EVENTDAYID = EVENTDAY.ID\n" +
        "WHERE EVENTDAY.eventID = ?\n" +
        "GROUP BY EVENTDAY.NOTE";

    let theseDays = [];

    db.pool.getConnection((err, connection)=>{
        connection.query(getCommand, [eventID], (err, rows)=>{
            if(!err){
                console.log("rows: " + JSON.stringify(rows));
                theseDays = rows;
            }else{
                console.log("Error: " + err);
            }
            callback(theseDays);
        })
    })
}

/**
 * Makes a date readable.
 * @param rawDate
 * @returns {string}
 */
function makePrettyDate(rawDate){
    let prettyDate =  moment(rawDate).format('MMM DD, YYYY hh:mm a');
    return prettyDate;
}

/**
 * Gets all event days, but formatted.
 * @param eventID
 * @param callback
 */
function getAllEventDays(eventID, callback){


    getAllRawEventsDays(eventID, function(rows){

        var prettyRows = [];

        rows.forEach((item,index)=>{
            console.log("this row: " + JSON.stringify(item))
            var eventDayObj = {
                eventDayID: item.ID,
                startTime:makePrettyDate(item.TIMESTART),
                endTime:makePrettyDate(item.TIMEEND),
                attendeeCount:item.ATTENDEES,
                note:item.NOTE
            }

            prettyRows.push(eventDayObj);

        })
        callback(prettyRows);
    })
}

/**
 * Count the attendance for a given event day
 * @param eventDayID
 * @param callback
 */
function getAttendanceForEventDay(eventDayID,callback){
    let getCommand = "SELECT COUNT(DISTINCT MAC) FROM eventdayentry where eventdayID = ?"
    let count = 0;
    db.pool.getConnection((err, connection)=>{
        connection.query(getCommand, [eventDayID], (err, rows)=>{
            if(!err){
                count = rows[0].COUNT
            }else{
                console.log("Error: " + err)
            }
        })

        callback(count)
    })

}

/**
 * Gets the raw event entries for a day id.
 * @param eventDayID
 * @param callback
 */
function getAllRawEventDayEntriesForDayID(eventDayID, callback){
    let getCommand = "SELECT distinct TIMESTAMP, MAC, WIFI FROM EVENTDAYENTRY WHERE EVENTDAYID = ?"

    let theseEntries = []

    db.pool.getConnection((err, connection)=>{
        connection.query(getCommand, [eventDayID], (err, rows)=>{
            if(!err){
                console.log("rows: " + JSON.stringify(rows));
                theseEntries = rows;
            }else{
                console.log("Error: " + err);
            }
            callback(theseEntries);
        })
    })
}

/**
 * Get displayable entries
 * @param eventDayID
 * @param callback
 */
function getAllEventDayEntriesForDayID(eventDayID, callback){

    getAllRawEventDayEntriesForDayID(eventDayID, function(rows){

        var prettyRows = [];

        rows.forEach((item,index)=>{
            console.log("this row: " + JSON.stringify(item))
            var eventDayEntryObj = {
                ID: item.ID,
                timestamp:makePrettyDate(item.TIMESTAMP),
                MAC:item.MAC,
                WIFI:item.WIFI,
            }

            prettyRows.push(eventDayEntryObj);

        })
        callback(prettyRows);
    })
}

/**
 * UPdates the event with the given ID
 * @param eventID
 * @param eventName
 * @param eventDescription
 * @param callback
 */
function updateEvent(eventID, eventName, eventDescription, callback){
    let updateCommand = "UPDATE EVENT SET NAME = ?, SET DESCRIPTION = ? WHERE ID = ?"

    let outcome = false;

    db.pool.getConnection((err,connection)=>{
        connection.query(updateCommand, [eventName, eventDescription, eventID], (err, rows)=>{
            if(!err){
                console.log("updated: " + JSON.stringify(rows))
                outcome = true;
            }else{
                console.log("Error: " + err);
            }
            callback(outcome);
        })
    })
}



/**
 * Adds an event day to the db.
 * @param eventID
 * @param eventStartTime
 * @param eventEndTime
 * @param eventDayNote
 * @param callback
 */
function addEventDay(eventID, eventStartTime, eventEndTime, eventDayNote, callback){
    let insertCommand = "INSERT INTO EVENTDAY (EVENTID, TIMESTART, TIMEEND, NOTE) VALUES(?,?,?,?);"

    let outcome = false;
    console.log(eventID, eventStartTime, eventEndTime, eventDayNote);
    db.pool.getConnection((err, connection)=>{
        connection.query(insertCommand,[eventID, eventStartTime, eventEndTime, eventDayNote], (err,rows)=>{
            if(!err){
                outcome = true
            }else{
                console.log("error: " + err)
            }
            callback(outcome);
        })

    })

    
}


module.exports = {
    verifyLogin:verifyLogin,
    getID:getIDForUser,
    getAllEvents:getAllEvents,
    createANewEvent:createNewEvent,
    getAllEventDays:getAllEventDays,
    getAllEventDayEntriesForDayID:getAllEventDayEntriesForDayID,
    updateEvent:updateEvent,
    registerNewUser: registerNewUser,
    addEventDay: addEventDay
}