// indexRouter.js - Index route module.

var express = require('express');
var router = express.Router();

router.get('', function (req, res) {
    res.render("index", { title: "Home" });
})

module.exports = router;

// const addUser = (ev) => {
//     ev.preventDefault();  //to stop the form submitting
// }