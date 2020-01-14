// index.js


/**
 * Required External Modules
 */

const express = require("express");
const path = require("path");
const session = require('express-session');
const DynamoDBStore = require('dynamodb-store');
const access = require("./src/data/access.json");


/**
 * App Variables
 */

const app = express();
const port = process.env.PORT || "8000";

//console.log("Session options: " + JSON.stringify(sessionOptions, null, 2));


/**
 *  App Configuration
 */

app.use(
    // Creates a session middleware with given options.
    session({

        // Defaults to MemoryStore, meaning sessions are stored as POJOs
        // in server memory, and are wiped out when the server restarts.
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

        // Whether to force-set a session ID cookie on every response. Default is
        // false. Enable this if you want to extend session lifetime while the user
        // is still browsing the site. Beware that the module doesn't have an absolute
        // timeout option (see https://github.com/expressjs/session/issues/557), so
        // you'd need to handle indefinite sessions manually.
        // rolling: false,

        // Secret key to sign the session ID. The signature is used
        // to validate the cookie against any tampering client-side.
        secret: `quiet, pal! it's a secret!`,

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
            // path: '/',

            // Domain attribute in Set-Cookie header. There's no default, and
            // most browsers will only apply the cookie to the current domain.
            // domain: null,

            // HttpOnly flag in Set-Cookie header. Specifies whether the cookie can
            // only be read server-side, and not by JavaScript. Defaults to true.
            // httpOnly: true,

            // Expires attribute in Set-Cookie header. Set with a Date object, though
            // usually maxAge is used instead. There's no default, and the browsers will
            // treat it as a session cookie (and delete it when the window is closed).
            // expires: new Date(...)

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