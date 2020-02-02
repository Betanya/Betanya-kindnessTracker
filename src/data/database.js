// database.js - Used to connect to our AWS DynamoDB Database

// Imports
var AWS = require("aws-sdk");                               // Use aws-sdk npm module.
var access = require("../data/access.json");                // Use our access.json to get database login information.
var bcrypt = require('bcryptjs');                           // Use bcryptjs npm module for password hashing.

let awsConfig = {                                           // Create object with DynamoDB information.
    "region": "us-east-2",
    "endpoint": "http://dynamodb.us-east-2.amazonaws.com",
    "accessKeyId": access.accessKeyId, 
    "secretAccessKey": access.secretAccessKey
};

AWS.config.update(awsConfig);                               // Update AWS module with configuration.
let docClient = new AWS.DynamoDB.DocumentClient();          // Create a DynamoDB document client object.

// Check if username entered exists in DynamoDB database.
function checkUsername(username) {
    return new Promise((resolve, reject) => {
        
        // Parameters required for docClient.scan().
        var params = {
            TableName: "users",
            FilterExpression: "username = :username",
            ExpressionAttributeValues: {
                ":username": username
            }
        };

        // Scan users table for username.
        docClient.scan(params, function (err, data) {
            if (err) {
                reject();
            } else {
                let results = JSON.parse(JSON.stringify(data));
                if (results.Count === 0) {                          // No users with specified username.
                    resolve(false);
                } else {
                    resolve(true);
                }
            }
        });
    });
}

// Check if password in DynamoDB database matches entered password.
function checkPassword(username, password) {
    return new Promise((resolve, reject) => {

        // Parameters required for docClient.get().
        var params = {
            TableName: "users",
            Key: {
                username: username
            }
        };

        // Gets user from users table.
        docClient.get(params, function (err, data) {
            if (err) {
                reject();
            } else {
                let user = JSON.parse(JSON.stringify(data)).Item;

                // Checks if user's password matches the password they entered.
                if (bcrypt.compareSync(password, user.password)) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            }
        });
    });
}

// Get user by username from DynamoDB database.
function getUser(username) {
    return new Promise((resolve, reject) => {
        
        // Parameters required for docClient.get().
        var params = {
            TableName: "users",
            Key: {
                username: username
            }
        };

        // Gets user from users table.
        docClient.get(params, function (err, data) {
            if (err) {
                reject();
            } else {
                let user = JSON.parse(JSON.stringify(data)).Item;
                resolve(user);
            }
        });
    });
}

// Adds user's information to users table in DynamoDB database.
function signUp(user) {
    return new Promise(async (resolve, reject) => {

        // Parameters required for docClient.put().
        var params = {
            TableName: "users",
            Item: user
        };

        let usernameExists = await checkUsername(user.username);

        // Checks if the username already exists in database.
        if (usernameExists) {                                           
            resolve("USERNAME_EXISTS");
        } else {

            // Adds user to users table.
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

// Gets all deeds from deeds table in DynamoDB database for specific username.
// Deeds returned have "false" for value in "completed" column.
function getIncompleteDeeds(username) {
    return new Promise((resolve, reject) => {
        
        // Parameters required for docClient.scan().
        var params = {
            TableName: "deeds",
            FilterExpression: "username = :username and completed = :completed",
            ExpressionAttributeValues: {
                ":username": username,
                ":completed": false
            }
        };

        // Scans deeds table for incomplete deeds.
        docClient.scan(params, function (err, data) {
            if (err) {
                reject();
            } else {
                let results = JSON.parse(JSON.stringify(data));
                if (results.Count === 0) {
                    resolve([]);                      // Resolves/returns a blank array to indicate to UI that there are no incomplete deeds.
                } else {
                    resolve(results.Items);           // Resolves/returns the array of incomplete deeds.
                }
            }
        });
    });
}

// Adds a deed for a specific user to the deeds table in DynamoDB database.
function addDeed(username, deedDescription) {
    return new Promise((resolve, reject) => {

        // The deed to be added.
        var input = {
            "id": (Math.floor(Math.random() * Math.floor(300000000))).toString(),           // A random ID for the deed.
            "completed": false, 
            "dateAdded": (new Date().getTime()) / 1000,
            "deedDescription": deedDescription, 
            "username": username
        };

        // Parameters required for docClient.put().
        var params = {
            TableName: "deeds",
            Item: input
        };

        // Adds deed to deeds table.
        docClient.put(params, function (err, data) {
            if (err) {
                reject();
            } else {
                resolve();
            }
        });
    });
}

// Changes value of "completed" column for specified deed in deeds table of DynamoDB database to "true".
function markDeedCompleted(deedId) {
    return new Promise((resolve, reject) => {

        // Parameters required for docClient.update().
        var params = {
            TableName: "deeds",
            Key: { 
                "id": deedId 
            },
            UpdateExpression: "set completed = :completed",
            ExpressionAttributeValues: {
                ":completed": true
            },
            ReturnValues: "UPDATED_NEW"
        };

        // Updates deed in deeds table.
        docClient.update(params, function (err, data) {
            if (err) {
                reject();
            } else {
                resolve();
            }
        });
    });
}

// Gets all completed deeds from the past year for a given user and sends results to cal-heatmap in history.pug.
function getHistory(username) {
    return new Promise((resolve, reject) => {
        let today = (new Date().getTime()) / 1000;
        let lastYear = (new Date(new Date().setFullYear(new Date().getFullYear() - 1)).getTime()) / 1000;

        // Parameters required for docClient.scan().
        var params = {
            TableName: "deeds",
            FilterExpression: "username = :username and dateAdded <= :today and dateAdded >= :lastYear and completed = :completed",
            ExpressionAttributeValues: {
                ":username": username,
                ":today": today,
                ":lastYear": lastYear,
                ":completed": true
            }
        };

        // Scans deeds table for complete deeds.
        docClient.scan(params, function (err, data) {
            if (err) {
                reject();
            } else {
                let results = JSON.parse(JSON.stringify(data));

                if (results.Count === 0) {
                    resolve({});                      // Resolves/returns a blank array to indicate to UI that there are no available deeds.
                } else {
                    let deeds = results.Items;
                    let formattedDeeds = {};

                    for (deed of deeds) {
                        if (formattedDeeds[deed.dateAdded] === undefined) {
                            formattedDeeds[deed.dateAdded] = 1;
                        } else {
                            formattedDeeds[deed.dateAdded] += 1;
                        }
                    }

                    resolve(formattedDeeds);           // Resolves/returns the array of completed deeds.
                }
            }
        });

    });
}

// Adds all database connectivity functions (above) to node modules.
// Allows for functions to be accessed by other JavaScript files.
module.exports = {
    checkUsername: checkUsername,
    checkPassword: checkPassword,
    getUser: getUser,
    signUp: signUp,
    getIncompleteDeeds: getIncompleteDeeds,
    addDeed: addDeed,
    markDeedCompleted: markDeedCompleted,
    getHistory: getHistory
};