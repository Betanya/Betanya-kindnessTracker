// addDeedRouter.js - Add deed route module.

var express = require('express');
var router = express.Router();

// Add New Deed button on user page
router.get('', (req, res) => {
    res.render("addDeed", { title: "Add" });
});

// Add button on addDeed page
router.post('', (req, res) => {
    res.render("complete", { title: "Complete", status: "added" });
});

module.exports = router;