// index.js


/**
 * Required External Modules
 */

const express = require("express");                             // Use express npm module.
const path = require("path");                                   // Use path npm module.
const session = require('express-session');                     // Use express-session npm module.
const DynamoDBStore = require('dynamodb-store');                // Use dynamodb-store npm module.
const access = require("./src/data/access.json");               // Use our access.json to get database login information
const compression = require('compression');                     // Use compression npm module for http response compression.
const helmet = require('helmet');                               // Use helmet npm module for http protection.

/**
 * App Variables
 */

const app = express();                                          // Create express app.
const port = process.env.PORT || "8000";                        // Specify port number app should use.


/**
 *  App Configuration
 */

app.use(compression());                                         // Compress all routes.
app.use(helmet());                                              // Protects app from well-known web vulnerabilities.
app.use(
    // Creates a session middleware with given options.
    session({

        // Session information stored in DynamoDB table called sessions.
        // Uses the 'dynamodb-store' npm module.
        store: new DynamoDBStore({
            table: {
              name: 'sessions',
              readCapacityUnits: 10,
              writeCapacityUnits: 10,
            },
            dynamoConfig: {
              accessKeyId: access.accessKeyId,
              secretAccessKey: access.secretAccessKey,
              region: 'us-east-2',
              endpoint: 'http://dynamodb.us-east-2.amazonaws.com',
            },
            ttl: 600000,
        }),

        // Name for the session ID cookie. Defaults to 'connect.sid'.
        name: 'sid',

        // Whether to force-save unitialized (new, but not modified) sessions
        // to the store. Defaults to true (deprecated). For login sessions, it
        // makes no sense to save empty sessions for unauthenticated requests,
        // because they are not associated with any valuable data yet, and would
        // waste storage. We'll only save the new session once the user logs in.
        saveUninitialized: false,

        // Whether to force-save the session back to the store, even if it wasn't
        // modified during the request. Default is true (deprecated). We don't
        // need to write to the store if the session didn't change.
        resave: false,

        // Secret key to sign the session ID. The signature is used
        // to validate the cookie against any tampering client-side.
        secret: access.dynamodbStoreSessionSecret,

        // Settings object for the session ID cookie. The cookie holds a
        // session ID ref in the form of 's:{SESSION_ID}.{SIGNATURE}' for example:
        // s%3A9vKnWqiZvuvVsIV1zmzJQeYUgINqXYeS.nK3p01vyu3Zw52x857ljClBrSBpQcc7OoDrpateKp%2Bc

        // It is signed and URL encoded, but NOT encrypted, because session ID is
        // merely a random string that serves as a reference to the session. Even
        // if encrypted, it still maintains a 1:1 relationship with the session.
        // OWASP: cookies only need to be encrypted if they contain valuable data.
        // See https://github.com/expressjs/session/issues/468

        cookie: {

            // Path attribute in Set-Cookie header. Defaults to the root path '/'.
            path: '/',

            // HttpOnly flag in Set-Cookie header. Specifies whether the cookie can
            // only be read server-side, and not by JavaScript. Defaults to true.
            httpOnly: true,

            // Preferred way to set Expires attribute. Time in milliseconds until
            // the expiry. There's no default, so the cookie is non-persistent.
            maxAge: 1000 * 60 * 60 * 2,

            // SameSite attribute in Set-Cookie header. Controls how cookies are sent
            // with cross-site requests. Used to mitigate CSRF. Possible values are
            // 'strict' (or true), 'lax', and false (to NOT set SameSite attribute).
            // It only works in newer browsers, so CSRF prevention is still a concern.
            sameSite: true,

            // Secure attribute in Set-Cookie header. Whether the cookie can ONLY be
            // sent over HTTPS. Can be set to true, false, or 'auto'. Default is false.
            secure: process.env.NODE_ENV === 'production'
        }
    })
)
app.set("views", path.join(__dirname, "views"));                    // Specifies path to views folder.
app.set("view engine", "pug");                                      // Tells express that pug is the view engine.
app.use(express.static(path.join(__dirname, "public")));            // Makes public folder available in html (pug) pages for scripts.
app.use(express.urlencoded());                                      // Look at express documentation
app.use(express.json());                                            // Look at express documentation


/**
 * Routes Definitions
 */

// Add Deed router.
var addDeedRouter = require('./src/routing/addDeedRouter.js');                  // Specifies add deed page router.
app.use('/addDeed', addDeedRouter);

// Complete router.
var completeRouter = require('./src/routing/completeRouter.js');                // Specifies complete page router.
app.use('/complete', completeRouter);

// History router.
var historyRouter = require('./src/routing/historyRouter.js');                  // Specifies history page router.
app.use('/history', historyRouter);

// Index router.
var indexRouter = require('./src/routing/indexRouter.js');                      // Specifies index page router.
app.use('/', indexRouter);

// Logout router.
var logoutRouter = require('./src/routing/logoutRouter.js');                    // Specifies logout page router.
app.use('/logout', logoutRouter);

// Sign Up router.
var signupRouter = require('./src/routing/signupRouter.js');                    // Specifies signup page router.
app.use('/signup', signupRouter);

// Skip router.
var skipRouter = require('./src/routing/skipRouter.js');                        // Specifies skip page router.
app.use('/skip', skipRouter);

// User router.
var userRouter = require('./src/routing/userRouter.js');                        // Specifies user page router.
app.use('/user', userRouter);



/**
 * Server Activation
 */

app.listen(port, () => {                                                        // Start express app. Begin listening for requests on X port.
    console.log(`Listening to requests on http://localhost:${port}`);
});