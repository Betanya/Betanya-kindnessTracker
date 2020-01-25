// indexRouter.js - Index route module.

var express = require('express');
var router = express.Router();
var database = require("../data/database.js");
var deedsUtil = require("../util/deeds.js");

router.get('', async function (req, res) {
    let user = req.session.user;

    if (user === undefined) {
        res.render("index", { title: "Index", message: "Please login."});
    } else {
        let deeds = await database.getIncompleteDeeds(user.username);
        let randomDeed = deedsUtil.generateRandomDeed(deeds);
        res.render("user", { title: "User", user: user, randomDeed: randomDeed });
    }
})

module.exports = router;