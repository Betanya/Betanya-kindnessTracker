// userRouter.js - User route module.

var express = require('express');
var router = express.Router();

router.get('', function (req, res) {
    res.render("user", { title: "User", userProfile: { nickname: "Max" } });
})

router.post('', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    console.log("Username: " + username + " | Password: " + password);
    let user = {
        username: username,
        password: password
    };

    res.render("user", { title: "User", userProfile: { nickname: username } });
});

module.exports = router;