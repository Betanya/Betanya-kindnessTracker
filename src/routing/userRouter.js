// userRouter.js - User route module.

var express = require('express');
var router = express.Router();
var database = require("../data/database.js");

router.get('', function (req, res) {
    let user = {
        firstname: "test"
    };
    res.render("user", { title: "User", user: user, message: "" });
});

router.post('', async function (req, res) {
    console.log("Inside post request");
    let username = req.body.username;
    let password = req.body.password;
    console.log("Username: " + username + " | Password: " + password);

    try {
        let usernameExists = await database.checkUsername(username);

        if (usernameExists) {
            let validPassword = await database.checkPassword(username, password);

            if (validPassword) {
                let user = await database.getUser(username);
                console.log("users::docClient.scan::success::VALID_USER - " + JSON.stringify(user));
                res.render("user", { title: "User", user: user, message: "" });
            } else {
                console.log("users::docClient.scan::success::INCORRECT_PASSWORD");
                res.render("index", { title: "Index", message: "Password is invalid."});
            }
        } else {
            console.log("users::docClient.scan::success::INCORRECT_USERNAME");
            res.render("index", { title: "Index", message: "Username is invalid."});
        }
    } catch (ex) {
        console.log("users::docClient.scan::success::ERROR_ERROR_ERROR");
        res.render("index", { title: "Index", message: "ERROR. CONTACT DEVELOPER."});
    }
});

module.exports = router;