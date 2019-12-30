// completeRouter.js - Complete route module.

var express = require('express');
var router = express.Router();

// Deed complete! button on user page
router.get('', (req, res) => {
    res.render("complete", { title: "Complete", status: "completed" });
});

module.exports = router;