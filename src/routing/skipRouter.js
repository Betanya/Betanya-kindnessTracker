// skipRouter.js - Skip route module.

var express = require('express');
var router = express.Router();
var database = require("../data/database.js");
var deedsUtil = require("../util/deeds.js");

// Skip button on user page
router.get('', async function (req, res) {

    // TO DO: Need to figure out a way to keep track of current deed being displayed.
    // let user = req.session.user;
    // let deeds = await database.getIncompleteDeeds(user.username);
    // let randomDeed = deedsUtil.generateRandomDeed(deeds);
    // res.render("user", { title: "User", user: user, message: "", randomDeed: randomDeed });
});

module.exports = router;