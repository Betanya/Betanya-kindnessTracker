// indexRouter.js - Index route module.

// Dependencies
var express = require('express');
var router = express.Router();
var database = require("../data/database.js");

// Requests to domain, domain/index). The default router when user goes to site.
router.get(['', '/index'], async function (req, res) {
    let user = req.session.user;

    if (user === undefined) {
        res.render("index", { title: "Index" });                                // Redirects to index page for login.
    } else {
        let options = {                                                         // Options to be passed to UI.
            title: "User",
            user: user,
            deeds: []
        }

        options.deeds = await database.getIncompleteDeeds(user.username);       // Update deeds property with all incomplete deeds.
        
        req.session.currentDeedIndex = 0;                                       // Allows for skip functionality to work.
        req.session.deeds = options.deeds;                                      // Adds deeds to session.

        res.render("user", options);                                            // Sends to user page.
    }
})

module.exports = router;                                                        // Allows router object to be used by app.js.