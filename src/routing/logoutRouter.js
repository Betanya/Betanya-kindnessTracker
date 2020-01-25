// logoutRouter.js - Logout route module.

var express = require('express');
var router = express.Router();

// Logout button on nav after user has logged in
router.get('', (req, res) => {
    req.session.destroy(function(err) {
        res.render("index", { title: "Index" });
    });
});

module.exports = router;