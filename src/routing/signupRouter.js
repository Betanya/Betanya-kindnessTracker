// signupRouter.js - Sign Up route module.

var express = require('express');
var router = express.Router();
var database = require("../data/database.js");

// Sign up button from index page.
router.get('', (req, res) => {
    res.render("signup", { title: "Signup" });
});

// Sign up button from signup page.
router.post('', async function (req, res) {
    console.log("Inside post request");
    
    let user = {
        username: req.body.username,
        email: req.body.email,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        password: req.body.password
    };

    console.log("Username: " + user.username + " | Email: " + user.email + " | Firstname: " + user.firstname + " | Lastname: " + user.lastname + " | Password: " + user.password);

    let status = await database.signUp(user);
    if (status === "SUCCESS") {
        res.render("index", { title: "Home", message: "Signup successful. Please login." });
    } else {
        res.render("index", { title: "Home", message: "Signup unsuccessful. Please contact developers." });
    }
});

module.exports = router;