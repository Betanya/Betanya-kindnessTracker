// indexRouter.js - Index route module.

var express = require('express');
var router = express.Router();
var database = require("../data/database.js");
var deedsUtil = require("../util/deeds.js");

router.get('', async function (req, res) {
    console.log("Inside index router.get");

    let user = req.session.user;
    let deed = "";

    if (user === undefined) {
        res.render("index", { title: "Index"});
    } else {
        let deeds = await database.getIncompleteDeeds(user.username);

        if (deeds === undefined) {
            deed = "You have completed all your deeds!";
            res.render("user", 
            { 
                title: "User", 
                user: user,
                deed: deed,
                moreThanOneDeed: req.session.moreThanOneDeed,
                deedsExist: false
            });
        } else {
            deed = deeds[0].deedDescription;
            req.session.currentDeedIndex = 0;
            res.render("user", 
            { 
                title: "User", 
                user: user,
                deed: deed,
                moreThanOneDeed: req.session.moreThanOneDeed,
                deedsExist: true
            });
        }   
    }
})

module.exports = router;