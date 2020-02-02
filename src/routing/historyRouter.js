// historyRouter.js - History route module.

// Dependencies
var express = require('express');
var router = express.Router();
var database = require("../data/database");

// History button on nav after user has logged in and requests made by cal-heatmap for completed deeds data.
router.get('', async function(req, res) {
    let user = req.session.user;

    if (user === undefined) {
        res.render("index", { title: "Index", message: "Please login." });                  // Redirects to index page for login.
    } else {

        // If getData is undefined, the request came from the user clicking the history button on the nav bar.
        if (req.query.getData === undefined) {                                              
            res.render("history", { title: "History" });
        } else {                                                                            // Request from cal-heatmap.
            let data = await database.getHistory(user.username);                            // Gets completed deeds for user.
            res.json(data);                                                                 // Sends completed deeds to cal-heatmap.
        }
    }
});

module.exports = router;                                                                    // Allows router object to be used by app.js.