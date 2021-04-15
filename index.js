var express = require("express")
var app = express()

var addRecords = require("./controller/AddRecordsApi")
const { request } = require("./controller/GetRecordsApi")
var getRecords = require("./controller/GetRecordsApi")
var login = require("./controller/LoginApi")
var signup = require("./controller/SignUpApi")
var actionsOnRecord = require("./controller/ActionsOnRecordApi")
var updateSignUpDetails = require("./controller/UpdateSignUpDetails")
var profileDetails = require("./controller/ProfileApi")
var forgotPassword = require("./controller/ForgotPassword")
var logoutUser = require("./controller/LogoutApi")
var appPin = require("./controller/AppPinApi")

app.use('/records/', addRecords)
app.use('/records/', getRecords)
app.use("/records", actionsOnRecord)
app.use("/user/", login)
app.use("/user/", signup)
app.use("/user/", updateSignUpDetails)
app.use("/user/", profileDetails)
app.use("/user/", forgotPassword)
app.use("/user/", logoutUser)
app.use("/user/", appPin)

//----------------------------------------------- test purpose ---------------------------------------//
var awsSES = require("./controller/AwsSesApi")

app.use("/aws/", awsSES)


// app.listen(5000, () => {
//     console.log("Server running at port 5000");
// })


module.exports = app;



