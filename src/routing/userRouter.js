// userRouter.js - User route module.

var express = require('express');
var router = express.Router();
var database = require("../data/database.js");

router.get('', async function (req, res) {
    console.log("Inside user router.get");
    let user = req.session.user;

    if (user === undefined) {
        res.render("index", { title: "Index"});
    } else {
        let deeds;
        let status = "";
        let moreThanOneDeed;
        let deedsExist;
        let deed;

        try {
            deeds = await database.getIncompleteDeeds(user.username);
            
            if (deeds === false) {
                deed = "You have completed all your deeds!"
                deedsExist = false;
                moreThanOneDeed = false;
            } else {
                deedsExist = true;
                deed = deeds[0].deedDescription;
                req.session.currentDeedIndex = 0;
                req.session.deeds = deeds;

                console.log(deeds.length);
                moreThanOneDeed = deeds.length > 1 ? true : false;
                console.log(moreThanOneDeed);
                req.session.moreThanOneDeed = moreThanOneDeed;
            }
        } catch (ex) {
            status = "Error";
        }

        res.render("user", 
        { 
            title: "User", 
            user: user,
            deed: deed,
            moreThanOneDeed: moreThanOneDeed,
            deedsExist: deedsExist,
            status: status
        });
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
                let deedsExist;

                if (deeds === false) {
                    deed = "You have completed all your deeds!"
                    deedsExist = false;
                } else {
                    deed = deeds[0].deedDescription;
                    req.session.currentDeedIndex = 0;
                    req.session.deeds = deeds;

                    console.log(deeds.length);
                    moreThanOneDeed = deeds.length > 1 ? true : false;
                    console.log(moreThanOneDeed);
                    req.session.moreThanOneDeed = moreThanOneDeed;
                }

                res.render("user", { title: "User", user: user, deed: deed, moreThanOneDeed: moreThanOneDeed, deedsExist: deedsExist });
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