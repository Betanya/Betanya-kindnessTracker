// addDeedRouter.js - Add deed route module.

var express = require('express');
var router = express.Router();
var database = require("../data/database.js");

// Add New Deed button on user page
router.get('', (req, res) => {
    console.log("Inside addDeed router.get");
    let user = req.session.user;

    if (user === undefined) {
        res.render("index", { title: "Index", message: "Please login."});
    } else {
        res.render("addDeed", { title: "Add" });
    }
});

// Add button on addDeed page
router.post('', async function(req, res) {
    console.log("Inside addDeedRouter.post.");
    let user = req.session.user;
    let deedDescription = req.body.deedDescription;
    let status = "";
    let moreThanOneDeed;
    let deed;
    let deedsExist = true;

    let currentDeeds = await database.getIncompleteDeeds(user.username);
    console.log("Current Deeds: " + JSON.stringify(currentDeeds));

    if (currentDeeds != false) {
        for (d of currentDeeds) {
            console.log("Loop deed: " + d.deedDescription.toLowerCase() + " | Deed Description: " + deedDescription.toLowerCase());
            if (d.deedDescription.toLowerCase() === deedDescription.toLowerCase()) {
                status = "Exists";
                break;
            }
        }
    } else {
        deedsExist = false;
    }

    console.log("Status: " + status);

    try {
        if (status === "") {
            await database.addDeed(user.username, deedDescription);
            status = "Nonexistent";
        }

        let deeds = await database.getIncompleteDeeds(user.username);
        console.log("DEEDS: \n" + JSON.stringify(deeds));
        
        deed = deeds[0].deedDescription;
        req.session.currentDeedIndex = 0;
        req.session.deeds = deeds;

        console.log(deeds.length);
        moreThanOneDeed = deeds.length > 1 ? true : false;
        console.log(moreThanOneDeed);
        req.session.moreThanOneDeed = moreThanOneDeed;
        
    } catch (ex) {
        status = "Error";
    }
    
    res.render("user", 
    { 
        title: "User", 
        user: user, 
        message: "",
        deed: deed,
        moreThanOneDeed: moreThanOneDeed,
        status: status,
        deedsExist: deedsExist
    });
});

module.exports = router;