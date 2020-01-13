// database.js - Used to connect to our AWS DynamoDB Database

// Imports
var AWS = require("aws-sdk");
var access = require("../data/access.json");

// Will be used to safely store passwords
// var hash = require("")

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
            console.log("Inside docClient.scan callback.");
            if (err) {
                console.log("users::docClient.scan::ERROR - " + err);
                reject();
            } else {
                let results = JSON.parse(JSON.stringify(data));
                if (results.Count === 0) {
                    resolve(false);
                } else {
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
            console.log("Inside docClient.scan callback.");
            if (err) {
                console.log("users::docClient.scan::ERROR - " + err);
                reject();
            } else {
                let results = JSON.parse(JSON.stringify(data));
                if (results.Count === 0) {
                    resolve(false);
                } else {
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
            console.log("Inside docClient.scan callback.");
            if (err) {
                console.log("users::docClient.scan::ERROR - " + err);
                reject();
            } else {
                let user = JSON.parse(JSON.stringify(data)).Item;
                resolve(user);
            }
        });
    });
}

function signUp(user) {
    return new Promise((resolve, reject) => {
        console.log("Inside signUp");
        
        var input = {
            "username": user.username, 
            "email": user.email, 
            "firstname": user.firstname,
            "lastname": user.lastname, 
            "password": user.password
        };

        var params = {
            TableName: "users",
            Item: user
        };

        docClient.put(params, function (err, data) {
            if (err) {
                console.log("users::put::ERROR - " + JSON.stringify(err, null, 2));
                reject(err);                
            } else {
                console.log("users::put::SUCCESS");
                resolve("SUCCESS");                 
            }
        });

        // var params = {
        //     TableName: "users",
        //     Key: {
        //         username: username
        //     }
        // };

        // docClient.get(params, function (err, data) {
        //     console.log("Inside docClient.scan callback.");
        //     if (err) {
        //         console.log("users::docClient.scan::ERROR - " + err);
        //         reject();
        //     } else {
        //         let user = JSON.parse(JSON.stringify(data)).Item;
        //         resolve(user);
        //     }
        // });
    });
}

module.exports = {
    checkUsername: checkUsername,
    checkPassword: checkPassword,
    getUser: getUser,
    signUp: signUp
};



//     deleteFromDb: function () {
//         var params = {
//             TableName: "users",
//             Key: {
//                 "email_id": "email@gmail.com"
//             }
//         };
//         docClient.delete(params, function (err, data) {
    
//             if (err) {
//                 console.log("users::delete::error - " + JSON.stringify(err, null, 2));
//             } else {
//                 console.log("users::delete::success");
//             }
//         });
//     },

//     updateInDatabase: function () {
//         var params = {
//             TableName: "users",
//             Key: { "email_id": "example-1@gmail.com" },
//             UpdateExpression: "set updated_by = :byUser, is_deleted = :boolValue",
//             ExpressionAttributeValues: {
//                 ":byUser": "updateUser",
//                 ":boolValue": true
//             },
//             ReturnValues: "UPDATED_NEW"
    
//         };
//         docClient.update(params, function (err, data) {
    
//             if (err) {
//                 console.log("users::update::error - " + JSON.stringify(err, null, 2));
//             } else {
//                 console.log("users::update::success "+JSON.stringify(data) );
//             }
//         });
//     },

//     createInDatabase: function () {
//         var input = {
//             "email_id": "example-1@gmail.com", "created_by": "clientUser", "created_on": new Date().toString(),
//             "updated_by": "clientUser", "updated_on": new Date().toString(), "is_deleted": false
//         };
//         var params = {
//             TableName: "users",
//             Item:  input
//         };
//         docClient.put(params, function (err, data) {
    
//             if (err) {
//                 console.log("users::save::error - " + JSON.stringify(err, null, 2));                      
//             } else {
//                 console.log("users::save::success" );                      
//             }
//         });
//     }
// };


//            let user = results.Items[0];