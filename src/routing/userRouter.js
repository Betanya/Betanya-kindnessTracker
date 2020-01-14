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
    console.log("Inside userRouter post request");
    let username = req.body.username;
    let password = req.body.password;
    console.log("Username: " + username + " | Password: " + password);

    try {
        let usernameExists = await database.checkUsername(username);

        if (usernameExists) {
            let validPassword = await database.checkPassword(username, password);

            if (validPassword) {
                let user = await database.getUser(username);
                console.log("userRouter.post::try-catch::VALID_USER: \n" + JSON.stringify(user));
                res.render("user", { title: "User", user: user });
            } else {
                res.render("index", { title: "Index", message: "Password is invalid."});
            }
        } else {
            res.render("index", { title: "Index", message: "Username is invalid."});
        }
    } catch (ex) {
        console.log("userRouter.post::try-catch::ERROR_THROWN");
        res.render("index", { title: "Index", message: "ERROR. CONTACT DEVELOPER."});
    }
});

module.exports = router;