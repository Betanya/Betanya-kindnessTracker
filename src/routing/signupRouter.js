// signupRouter.js - Sign Up route module.

var express = require('express');
var router = express.Router();

// Sign up button from index page.
router.get('', (req, res) => {
    res.render("signup", { title: "Signup" });
});

// Sign up button from signup page.
router.post('', (req, res) => {
    res.render("index", { title: "Home" });
});

module.exports = router;