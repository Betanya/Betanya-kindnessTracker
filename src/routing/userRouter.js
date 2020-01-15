// userRouter.js - User route module.

var express = require('express');
var router = express.Router();
var database = require("../data/database.js");

router.get('', function (req, res) {
    console.log("Inside user router.get");
    let user = req.session.user;
    console.log("User from session in router.get: " + JSON.stringify(user));
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
                req.session.user = user;
                console.log("userRouter.post::try-catch::VALID_USER: \n" + JSON.stringify(user));

                let deeds = await database.getIncompleteDeeds(user.username);
                let randomDeed = "";

                if (deeds === false) {
                    randomDeed = "You have completed all your deeds!"
                } else {
                    let randomNumber = Math.floor(Math.random() * Math.floor(deeds.length));
                    console.log("Random number: " + randomNumber);
                    console.log("Deeds[i]: " + deeds[randomNumber]);
                    randomDeed = deeds[randomNumber].deedDescription;
                    console.log("Random deed: " + randomDeed);
                }

                res.render("user", { title: "User", user: user, randomDeed: randomDeed });
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