// logoutRouter.js - Logout route module.

var express = require('express');
var router = express.Router();

// Logout button on nav after user has logged in
router.get('', (req, res) => {
    res.render("index", { title: "Home" });
});

module.exports = router;