// userRouter.js - User route module.

var express = require('express');
var router = express.Router();
var database = require("../data/database.js");
var deedsUtil = require("../util/deeds.js");

router.get('', async function (req, res) {
    console.log("Inside user router.get");
    let user = req.session.user;

    if (user === undefined) {
        res.render("index", { title: "Index", message: "Please login."});
    } else {
        let deeds = await database.getIncompleteDeeds(user.username);
        let randomDeed = deedsUtil.generateRandomDeed(deeds);

        console.log("User from session in router.get: " + JSON.stringify(user));
        res.render("user", { title: "User", user: user, message: "", randomDeed: randomDeed });
    }
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
                req.session.user = user;
                console.log("userRouter.post::try-catch::VALID_USER: \n" + JSON.stringify(user));

                let deeds = await database.getIncompleteDeeds(user.username);
                let randomDeed = "";
                console.log("DEEDS: \n" + JSON.stringify(deeds));

                if (deeds === false) {
                    randomDeed = "You have completed all your deeds!"
                } else {
                    randomDeed = deedsUtil.generateRandomDeed(deeds);
                }

                res.render("user", { title: "User", user: user, randomDeed: randomDeed });
            } else {
                res.render("index", { title: "Index", message: "Password is invalid."});
            }
        } else {
            res.render("index", { title: "Index", message: "Username is invalid."});
        }
    } catch (ex) {
        console.log("userRouter.post::try-catch::ERROR_THROWN - \n" + ex.message);
        res.render("index", { title: "Index", message: "ERROR. CONTACT DEVELOPER."});
    }
});

module.exports = router;