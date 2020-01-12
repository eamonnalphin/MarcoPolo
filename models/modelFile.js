let db = require('../util/database');
let crypto = require('crypto')



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

module.exports = {
    getsaltandpw:getEncryptedPasswordAndNewSalt,
    verifyLogin:verifyLogin
}