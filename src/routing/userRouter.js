// userRouter.js - User route module.

var express = require('express');
var router = express.Router();
var database = require("../data/database.js");

router.get('', async function (req, res) {
    console.log("Inside user router.get");
    let user = req.session.user;
    let deed = "";

    if (user === undefined) {
        res.render("index", { title: "Index", message: "Please login."});
    } else {
        let deeds = req.session.deeds;

        if (deeds === undefined) {
            deed = "You have completed all your deeds!";
            res.render("user", 
            { 
                title: "User", 
                user: user, 
                message: "", 
                deed: deed,
                moreThanOneDeed: req.session.moreThanOneDeed
            });
        } else {
            deed = deeds[0].deedDescription;
            req.session.currentDeedIndex = 0;
            res.render("user", 
            { 
                title: "User", 
                user: user, 
                message: "", 
                deed: deed,
                moreThanOneDeed: req.session.moreThanOneDeed
            });
        }   
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
                console.log("DEEDS: \n" + JSON.stringify(deeds));
                
                let moreThanOneDeed;

                if (deeds === false) {
                    deed = "You have completed all your deeds!"
                } else {
                    deed = deeds[0].deedDescription;
                    req.session.currentDeedIndex = 0;
                    req.session.deeds = deeds;

                    console.log(deeds.length);
                    moreThanOneDeed = deeds.length > 1 ? true : false;
                    console.log(moreThanOneDeed);
                    req.session.moreThanOneDeed = moreThanOneDeed;
                }

                res.render("user", { title: "User", user: user, deed: deed, moreThanOneDeed: moreThanOneDeed });
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