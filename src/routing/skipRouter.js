// skipRouter.js - Skip route module.

var express = require('express');
var router = express.Router();

// Skip button on user page
router.get('', async function (req, res) {
    let user = req.session.user;
    let deed = "";

    if (user === undefined) {
        res.render("index", { title: "Index", message: "Please login."});
    } else {
        let deeds = req.session.deeds;
        let currentDeedIndex = req.session.currentDeedIndex;
        if (currentDeedIndex == (deeds.length - 1)) {
            currentDeedIndex = 0;
            req.session.currentDeedIndex = currentDeedIndex;
            deed = deeds[currentDeedIndex].deedDescription;
        } else {
            deed = deeds[currentDeedIndex + 1].deedDescription;
            req.session.currentDeedIndex = currentDeedIndex + 1;
        }
        
        res.render("user", 
        { 
            title: "User", 
            user: user, 
            message: "",
            deed: deed,
            moreThanOneDeed: req.session.moreThanOneDeed
        });
    }
});

module.exports = router;