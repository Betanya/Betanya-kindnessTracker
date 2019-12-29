// index.js


/**
 * Required External Modules
 */

const express = require("express");
const path = require("path");
const database = require("./src/data/database.js");


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
app.use(express.urlencoded());
app.use(express.json());


/**
 * Routes Definitions
 */

// Index router.
var indexRouter = require('./src/routing/indexRouter.js');
app.use('/', indexRouter);

// User router.
var userRouter = require('./src/routing/userRouter.js');
app.use('/user', userRouter);

// Sign Up router.
var signupRouter = require('./src/routing/signupRouter.js');
app.use('/signup', signupRouter);

// History router.
var historyRouter = require('./src/routing/historyRouter.js');
app.use('/history', historyRouter);

// Complete router.
var completeRouter = require('./src/routing/completeRouter.js');
app.use('/complete', completeRouter);

// Add Deed router.
var addDeedRouter = require('./src/routing/addDeedRouter.js');
app.use('/addDeed', addDeedRouter);

// Skip router.
var skipRouter = require('./src/routing/skipRouter.js');
app.use('/skip', skipRouter);

// Logout router.
var logoutRouter = require('./src/routing/logoutRouter.js');
app.use('/logout', logoutRouter);


/**
 * Server Activation
 */

app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
});