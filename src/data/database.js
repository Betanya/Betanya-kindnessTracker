// database.js - Used to connect to our AWS DynamoDB Database

// Imports
var AWS = require("aws-sdk");
var access = require("../data/access.json");

// Will be used to safely store passwords
// var password = require("../util/password.js")

let awsConfig = {
    "region": "us-east-2",
    "endpoint": "http://dynamodb.us-east-2.amazonaws.com",
    "accessKeyId": access.accessKeyId, 
    "secretAccessKey": access.secretAccessKey
};

AWS.config.update(awsConfig);
let docClient = new AWS.DynamoDB.DocumentClient();

function checkUsername(username) {
    return new Promise((resolve, reject) => {
        console.log("Inside checkUsername");
        var params = {
            TableName: "users",
            FilterExpression: "username = :username",
            ExpressionAttributeValues: {
                ":username": username
            }
        };

        docClient.scan(params, function (err, data) {
            console.log("Inside checkUsername docClient.scan callback.");
            if (err) {
                console.log("checkUsername::users::docClient.scan::ERROR - " + err);
                reject();
            } else {
                let results = JSON.parse(JSON.stringify(data));
                if (results.Count === 0) {
                    console.log("checkUsername::users::docClient.scan::success::INCORRECT_USERNAME");
                    resolve(false);
                } else {
                    console.log("checkUsername::users::docClient.scan::success::USERNAME_EXISTS");
                    resolve(true);
                }
            }
        });
    });
}

function checkPassword(username, password) {
    return new Promise((resolve, reject) => {
        console.log("Inside checkPassword");
        var params = {
            TableName: "users",
            FilterExpression: "username = :username and password = :password",
            ExpressionAttributeValues: {
                ":username": username,
                ":password": password
            }
        };

        docClient.scan(params, function (err, data) {
            console.log("Inside checkPassword docClient.scan callback.");
            if (err) {
                console.log("checkPassword::users::docClient.scan::ERROR - " + err);
                reject();
            } else {
                let results = JSON.parse(JSON.stringify(data));
                if (results.Count === 0) {
                    console.log("checkPassword::users::docClient.scan::success::INCORRECT_PASSWORD");
                    resolve(false);
                } else {
                    console.log("checkPassword::users::docClient.scan::success::VALID_PASSWORD");
                    resolve(true);
                }
            }
        });
    });
}

function getUser(username) {
    return new Promise((resolve, reject) => {
        console.log("Inside getUser");
        var params = {
            TableName: "users",
            Key: {
                username: username
            }
        };

        docClient.get(params, function (err, data) {
            console.log("Inside getUser docClient.get callback.");
            if (err) {
                console.log("getUser::users::docClient.get::ERROR - " + err);
                reject();
            } else {
                let user = JSON.parse(JSON.stringify(data)).Item;
                resolve(user);
            }
        });
    });
}

function signUp(user) {
    return new Promise(async (resolve, reject) => {
        console.log("Inside signUp");

        var params = {
            TableName: "users",
            Item: user
        };

        let usernameExists = await checkUsername(user.username);

        if (usernameExists) {
            resolve("ALREADY_EXISTS");
        } else {
            docClient.put(params, function (err) {
                console.log("Inside signUp docClient.put callback.");
                if (err) {
                    console.log("signUp::users::docClient.put::ERROR - " + JSON.stringify(err, null, 2));
                    reject(err);                
                } else {
                    console.log("signUp::users::docClient.put::SUCCESS");
                    resolve("SUCCESS");                 
                }
            });
        }
    });
}

function getIncompleteDeeds(username) {
    return new Promise((resolve, reject) => {
        console.log("Inside getIncompleteDeeds");
        var params = {
            TableName: "deeds",
            FilterExpression: "username = :username and completed = :completed",
            ExpressionAttributeValues: {
                ":username": username,
                ":completed": false
            }
        };

        docClient.scan(params, function (err, data) {
            console.log("Inside getIncompleteDeeds docClient.scan callback.");
            if (err) {
                console.log("getIncompleteDeeds::deeds::docClient.scan::ERROR - " + err);
                reject();
            } else {
                console.log("getIncompleteDeeds::rawData - " + JSON.stringify(data));
                let results = JSON.parse(JSON.stringify(data));
                if (results.Count === 0) {
                    console.log("getIncompleteDeeds::deeds::docClient.scan::success::NO_INCOMPLETE_DEEDS");
                    resolve(false);
                } else {
                    console.log("getIncompleteDeeds::deeds::docClient.scan::success::INCOMPLETE_DEEDS_EXIST");
                    resolve(results.Items);
                }
            }
        });
    });
}

module.exports = {
    checkUsername: checkUsername,
    checkPassword: checkPassword,
    getUser: getUser,
    signUp: signUp,
    getIncompleteDeeds: getIncompleteDeeds
};