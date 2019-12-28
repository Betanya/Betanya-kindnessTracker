// index.js

/**
 * Required External Modules
 */

const express = require("express");
const path = require("path");

/**
 * App Variables
 */

const app = express();
const port = process.env.PORT || "8000";

/**
 *  App Configuration
 */

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "public")));

/**
 * Routes Definitions
 */

app.get("/", (req, res) => {
    res.render("index", { title: "Home" });
});

app.get("/user", (req, res) => {
    res.render("user", { title: "User", userProfile: { nickname: "Max" } });
});

app.post("/user", (req, res) => {
    res.render("user", { title: "User", userProfile: { nickname: "Max" } });
});

app.get("/signup", (req, res) => {
    res.render("signup", { title: "Signup" });
});

app.post("/signup", (req, res) => {
    res.render("index", { title: "Home" });
});

app.get("/history", (req, res) => {
    res.render("history", { title: "History" });
});

app.get("/complete", (req, res) => {
    res.render("complete", { title: "Complete", status: "completed" });
});

app.get("/addDeed", (req, res) => {
    res.render("addDeed", { title: "Add" });
});

app.post("/addDeed", (req, res) => {
    res.render("complete", { title: "Complete", status: "added" });
});

app.get("/skip", (req, res) => {
    res.render("skip", { title: "Skip" });
});

app.get("/logout", (req, res) => {
    res.render("index", { title: "Home" });
});

/**
 * Server Activation
 */

app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
});