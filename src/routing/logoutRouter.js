// logoutRouter.js - Logout route module.

// Dependencies
var express = require('express');
var router = express.Router();

// Logout button on nav after user has logged in (or request to domain/logout).
router.get('', (req, res) => {
    req.session.destroy(function(err) {                         // Destroys session.
        res.render("index", { title: "Index" });                // Sends user to login page.
    });
});

module.exports = router;                                        // Allows router object to be used by app.js.