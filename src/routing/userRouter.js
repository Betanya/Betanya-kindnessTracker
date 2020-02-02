// userRouter.js - User route module.

// Dependencies
var express = require('express');
var router = express.Router();
var database = require("../data/database.js");

// Home button on nav (or requests to domain/user).
router.get('', async function (req, res) {
    let user = req.session.user;

    if (user === undefined) {
        res.render("index", { title: "Index", message: "Please login." } );             // Redirects to index page for login.
    } else {
        let options = {                                                                 // Options to be passed to UI
            title: "User",
            user: user,
            deeds: []
        }
        
        options.deeds = await database.getIncompleteDeeds(user.username);               // Update deeds property with incomplete deeds.
        
        req.session.currentDeedIndex = 0;                                               // Allows for skip functionality to work.
        req.session.deeds = options.deeds;                                              // Adds deeds to session.

        res.render("user", options);                                                    // Sends to user page.
    }
});

// Login button on index page.
router.post('', async function (req, res) {
    let username = req.body.username;
    let password = req.body.password;

    try {
        let usernameExists = await database.checkUsername(username);                    // Checks if username exists in database.

        if (usernameExists) {
            let validPassword = await database.checkPassword(username, password);       // Checks if password entered is valid.

            if (validPassword) {
                let user = await database.getUser(username);                            // Gets the user from the database.
                req.session.user = user;

                let options = {                                                         // Options to be passed to UI.
                    title: "User",
                    user: user,
                    deeds: []
                }
                
                options.deeds = await database.getIncompleteDeeds(user.username);       // Update deeds property with all incomplete deeds.
        
                req.session.currentDeedIndex = 0;                                       // Allows for skip functionality to work.
                req.session.deeds = options.deeds;                                      // Adds deeds to session.
        
                res.render("user", options);                                            // Sends to user page.
            } else {
                res.render("index", { title: "Index", message: "Password is invalid." });       // Redirects user back to index page.
            }
        } else {
            res.render("index", { title: "Index", message: "Username is invalid." });           // Redirects user back to index page.
        }
    } catch (ex) {

        // On error from any of the above database requests, redirects user to index page.
        res.render("index", { title: "Index", message: "Error. Please contact developers."});
    }
});

module.exports = router;                                                                // Allows router object to be used by app.js.