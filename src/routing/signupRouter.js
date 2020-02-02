// signupRouter.js - Sign Up route module.

// Dependencies
var express = require('express');
var router = express.Router();
var database = require("../data/database.js");
var bcrypt = require('bcryptjs');

// Sign up button from index page (or request to domain/signup; only works if user is not logged in).
router.get('', async function(req, res) {
    let user = req.session.user;

    if (user === undefined) {
        res.render("signup", { title: "Signup" });                              // Sends user to signup page.
    } else {
        let options = {                                                         // Options to be passed to UI.
            title: "User",
            user: user,
            deeds: []
        }

        options.deeds = await database.getIncompleteDeeds(user.username);       // Update deeds property with all incomplete deeds.
        
        req.session.currentDeedIndex = 0;                                       // Allows for skip functionality to work.
        req.session.deeds = options.deeds;                                      // Adds deeds to session.

        res.render("user", options);                                            // Sends to user page.
    }
});

// Sign up button from signup page.
router.post('', async function (req, res) {

    // Gets user information from sign up form.
    let user = {
        username: req.body.username,
        email: req.body.email,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        password: bcrypt.hashSync(req.body.password, 10)            // Hashes the users password with a 10 round salt.
    };

    let status = await database.signUp(user);                       // Signs up the user.

    // Redirects user based on signup status message.
    if (status === "SUCCESS") {
        res.render("index", { title: "Index", message: "Signup successful. Please login." });
    } else if (status === "USERNAME_EXISTS") {
        res.render("signup", { title: "Signup", message: "Username already exists." });
    } else {
        res.render("index", { title: "Index", message: "Signup failed. Please contact developers." });
    }
});

module.exports = router;                                            // Allows router object to be used by app.js.