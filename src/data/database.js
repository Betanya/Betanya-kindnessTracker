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

function login(username, password, callback) {
    console.log("Inside verifyUserLogin");
    var params = {
        TableName: "users",
        Key: {
            "username": username
        }
    };
    docClient.get(params, function (err, data) {
        if (err) {
            console.log("users::verifyUserLogin::error - " + JSON.stringify(err, null, 2));
            return err;
        }

        if (Object.keys(data).length === 0) {
            console.log("users::verifyUserLogin::success::nullData - " + JSON.stringify(err, null, 2));
            return false;
        }
        else {
            if (data.Item.password === password) {
                console.log("users::verifyUserLogin::success::validUser - " + JSON.stringify(data, null, 2));
                return true;
            } else {
                console.log("users::verifyUserLogin::success::invalidPassword - " + JSON.stringify(data, null, 2));
                return 'Invalid Password';
            }    
        }
    });
}

//module.exports.verifyUserLogin = verifyUserLogin;
// {
//     verifyUserLogin: async function (username, password) {
//         console.log("Inside verifyUserLogin");
//         var params = {
//             TableName: "users",
//             Key: {
//                 "username": username
//             }
//         };
//         docClient.get(params, function (err, data) {
//             if (err) {
//                 console.log("users::verifyUserLogin::error - " + JSON.stringify(err, null, 2));
//                 return err;
//             }

//             if (Object.keys(data).length === 0) {
//                 console.log("users::verifyUserLogin::success::nullData - " + JSON.stringify(err, null, 2));
//                 return false;
//             }
//             else {
//                 if (data.Item.password === password) {
//                     console.log("users::verifyUserLogin::success::validUser - " + JSON.stringify(data, null, 2));
//                     return true;
//                 } else {
//                     console.log("users::verifyUserLogin::success::invalidPassword - " + JSON.stringify(data, null, 2));
//                     return 'Invalid Password';
//                 }    
//             }
//         });
//     },

//     getUser: function(username) {
//         var params = {
//             TableName: "users",
//             Key: {
//                 "username": username
//             }
//         };
//         docClient.get(params, function (err, data) {
//             if (err) {
//                 console.log("users::getUser::error - " + JSON.stringify(err, null, 2));
//                 throw err;
//             }
//             else {
//                 data = JSON.stringify(data, null, 2);
//                 console.log("users::getUser::success - " + data);
//                 return data;
//             }
//         });
//     },

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
