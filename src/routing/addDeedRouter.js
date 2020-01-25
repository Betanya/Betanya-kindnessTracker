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
    let status;
    let moreThanOneDeed;
    let deed;

    let currentDeeds = req.session.deeds;
    console.log("Current Deeds: " + JSON.stringify(currentDeeds));
    for (d of currentDeeds) {
        console.log("Loop deed: " + d.deedDescription.toLowerCase() + " | Deed Description: " + deedDescription.toLowerCase());
        if (d.deedDescription.toLowerCase() === deedDescription.toLowerCase()) {
            status = "This deed already exists.";
            break;
        }
    }

    console.log("Status: " + status);

    try {
        if (status === undefined) {
            await database.addDeed(user.username, deedDescription);
            status = true;
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
        status = false;
    }
    
    res.render("user", 
    { 
        title: "User", 
        user: user, 
        message: "",
        deed: deed,
        moreThanOneDeed: moreThanOneDeed,
        status: status
    });
});

module.exports = router;