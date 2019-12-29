// historyRouter.js - History route module.

var express = require('express');
var router = express.Router();

// History button on nav after user has logged in
router.get('', (req, res) => {
    res.render("history", { title: "History" });
});

module.exports = router;