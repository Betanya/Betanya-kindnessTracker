// userRouter.js - User route module.

var express = require('express');
var router = express.Router();
var database = require("../data/database.js");

router.get('', function (req, res) {
    res.render("user", { title: "User", userProfile: { nickname: "Max" } });
})

router.post('', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    console.log("Username: " + username + " | Password: " + password);
    let user = {
        username: username,
        password: password
    };

    let verification = database.verifyUserLogin(username, password);

    console.log(verification);

    if (verification === true) {
        user = database.getUser(user);
        console.log(user);
        res.render("user", { title: "User", user: user, message: "" });
    } else if (verification === false) {
        res.render("signup", { title: "Signup", message: "Please sign up."});
    } else if (verification === 'Invalid Password') {
        res.render("index", { title: "Index", message: "Invalid Password" });
    } else {
        res.render("index", { title: "Index", message: verification });
    }
});

module.exports = router;