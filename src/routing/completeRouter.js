// completeRouter.js - Complete route module.

var express = require('express');
var router = express.Router();
var database = require("../data/database.js");

// Deed complete! button on user page
router.get('', async function (req, res) {
    let user = req.session.user;

    if (user === undefined) {
        res.render("index", { title: "Index", message: "Please login."});
    } else {
        let deeds = req.session.deeds;
        let currentDeedIndex = req.session.currentDeedIndex;
        let deedId = deeds[currentDeedIndex].id;
        let status = "";
        let moreThanOneDeed;
        let deedsExist;
        let deed;

        try {
            await database.markDeedCompleted(deedId);
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

module.exports = router;