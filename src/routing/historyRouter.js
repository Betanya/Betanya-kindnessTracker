// historyRouter.js - History route module.

var express = require('express');
var router = express.Router();

// History button on nav after user has logged in
router.get('', (req, res) => {
    console.log("Inside history router.get");
    let user = req.session.user;

    if (user === undefined) {
        res.render("index", { title: "Index", message: "Please login."});
    } else {
        // TO DO: Get deeds in format to display on heat map.
        res.render("history", { title: "History" });
    }
});

module.exports = router;