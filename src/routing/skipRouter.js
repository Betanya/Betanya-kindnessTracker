// skipRouter.js - Skip route module.

// Dependencies
var express = require('express');
var router = express.Router();

// Skip button on user page (or request to domain/skip).
router.get('', async function (req, res) {
    let user = req.session.user;

    if (user === undefined) {
        res.render("index", { title: "Index", message: "Please login."});           // Redirects to index page for login.
    } else {
        let currentDeedIndex = req.session.currentDeedIndex;                        // Gets index for deed user currently sees.
        let options = {                                                             // Options to be passed to UI.
            title: "User",
            user: user,
            deeds: []
        }

        options.deeds = req.session.deeds;                                          // Store current deeds list from session in UI options.

        // Check if user is viewing last deed in deeds list.
        if (currentDeedIndex === (options.deeds.length - 1)) {
            
            // Reset deed to be viewed to first deed in deeds list.
            options.deedIndex = 0;
            req.session.currentDeedIndex = 0;
        } else {

            // Set index of deed to be viewed to next need in the deeds list.
            options.deedIndex = currentDeedIndex + 1;
            req.session.currentDeedIndex = currentDeedIndex + 1
        }
        
        res.render("user", options);                                               // Sends to user page.
    }
});

module.exports = router;                                                           // Allows router object to be used by app.js.