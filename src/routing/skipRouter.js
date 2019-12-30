// skipRouter.js - Skip route module.

var express = require('express');
var router = express.Router();

// Skip button on user page
router.get('', (req, res) => {
    res.render("skip", { title: "Skip" });
});

module.exports = router;