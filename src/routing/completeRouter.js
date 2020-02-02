// completeRouter.js - Complete route module.

// Dependencies
var express = require('express');
var router = express.Router();
var database = require("../data/database.js");

// "Deed complete" button on user page (or a request to domain/complete).
router.get('', async function (req, res) {
    let user = req.session.user;

    if (user === undefined) {
        res.render("index", { title: "Index", message: "Please login." });                  // Redirects to index page for login.
    } else {
        let currentDeedIndex = req.session.currentDeedIndex;                                // Checks which deed user is currently viewing.
        let options = {                                                                     // Options to be passed to UI.
            title: "User",
            user: user,
            deeds: []
        }

        // Checks if user has at least one incomplete deed showing.
        if (req.session.deeds[currentDeedIndex] !== undefined) {
            await database.markDeedCompleted(req.session.deeds[currentDeedIndex].id);       // Marks deed completed in database.
        }
        
        options.deeds = await database.getIncompleteDeeds(user.username);                   // Update deeds property with incomplete deeds.

        req.session.currentDeedIndex = 0;                                                   // Allows for skip functionality to work.
        req.session.deeds = options.deeds;                                                  // Adds deeds to session.

        res.render("user", options);                                                        // Sends to user page.
    }
});

module.exports = router;                                                                    // Allows router object to be used by app.js.