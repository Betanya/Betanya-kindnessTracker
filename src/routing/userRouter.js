// userRouter.js - User route module.

var express = require('express');
var router = express.Router();
//var database = require("../data/database.js");
var AWS = require("aws-sdk");
var access = require("../data/access.json");

let awsConfig = {
    "region": "us-east-2",
    "endpoint": "http://dynamodb.us-east-2.amazonaws.com",
    "accessKeyId": access.accessKeyId, 
    "secretAccessKey": access.secretAccessKey
};

AWS.config.update(awsConfig);
let docClient = new AWS.DynamoDB.DocumentClient();

router.get('', function (req, res) {
    res.render("user", { title: "User", userProfile: { nickname: "Max" } });
});

router.post('', function (req, res) {
    console.log("Inside post request");
    let username = req.body.username;
    let password = req.body.password;
    console.log("Username: " + username + " | Password: " + password);

    var params = {
        TableName: "users",
        FilterExpression: "username = :username and password = :password",
        ExpressionAttributeValues: {
            ":username": username,
            ":password": password
        }
    };

    docClient.scan(params, function (err, data) {
        console.log("Inside docClient.scan callback.");
        if (err) {
            console.log("users::docClient.scan::error - " + err);
            throw err;
        }
        
        let dataStringified = JSON.stringify(data);
        let results = JSON.parse(dataStringified);

        if (results.Count === 0) {
            console.log("users::docClient.scan::success::NULL_DATA - " + dataStringified);
            res.render("index", { title: "Index", message: "Username or password is invalid. If you do not have an account, please click the Sign Up button below."});
        } else  {
            console.log("users::docClient.scan::success::VALID_USER - " + dataStringified);
            let user = results.Items[0];
            console.log("User: " + JSON.stringify(user));
            res.render("user", { title: "User", user: user, message: "" });
        }

        // if ({
        //     console.log("users::docClient.scan::success::data - " + JSON.stringify(data));
        // }

        // if (Object.keys(data).length === 0) {
        //     
        // }
        // else {
        //     if (data.Item.password === password) {
        //         
        //         docClient.get(params, function (err, data) { 

        //         });
        //     } else {
        //         console.log("users::verifyUserLogin::success::invalidPassword - " + JSON.stringify(data, null, 2));
        //         return 'Invalid Password';
        //     }    
    });

        // console.log("After verifyUserLogin");
        // console.log("Verification: " + verification);

        // if (verification === true) {
        //     console.log("Before getUser");
        //     user = database.getUser(user);
        //     console.log("After getUser");
        //     console.log("User:" + user);
        //     console.log("Before render user that exists and is valid.");
        //    
        // } else if (verification === false) {
        //     res.render("signup", { title: "Signup", message: "Please sign up."});
        // } else if (verification === 'Invalid Password') {
        //     res.render("index", { title: "Index", message: "Invalid Password" });
        // } else {
        //     res.render("index", { title: "Index", message: verification });
        // }
        // console.log("After res.render.");
});

module.exports = router;