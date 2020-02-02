// addDeedRouter.js - Add deed route module.

// Dependencies
var express = require('express');
var router = express.Router();
var database = require("../data/database.js");
var deedsUtil = require("../util/deedsUtil.js")

// Add New Deed button on user page (or a request to domain/addDeed).
// Checks if user is logged in.
router.get('', (req, res) => {
    let user = req.session.user;

    if (user === undefined) {
        res.render("index", { title: "Index", message: "Please login." });          // Redirects to index page for login.
    } else {
        res.render("addDeed", { title: "Add" });                                    // Sends to addDeed page.
    }
});

// Add button on addDeed page.
router.post('', async function(req, res) {
    let user = req.session.user;                            // Get user from session.
    let deedDescription = req.body.deedDescription;         // Get deed description that the user entered in the textbox.
    let options = {                                         // Options to be passed to UI.
        title: "User",
        user: user,
        deeds: []
    }

    // Update deeds property with incomplete deeds.
    options.deeds = await database.getIncompleteDeeds(user.username);                       

    // Check if deed entered by user already exists. Value is true or false.
    options.deedAlreadyExists = deedsUtil.checkIfDeedExists(deedDescription, options.deeds);

    if (!options.deedAlreadyExists) {
        await database.addDeed(user.username, deedDescription);                 // Add new deed to database.
        options.deeds = await database.getIncompleteDeeds(user.username);       // Update deeds property with all incomplete deeds.
        
        req.session.currentDeedIndex = 0;                                       // Allows for skip functionality to work.
        req.session.deeds = options.deeds;                                      // Adds deeds to session.
    }

    res.render("user", options);                                                // Sends to user page.
});

module.exports = router;                                                        // Allows router object to be used by app.js.