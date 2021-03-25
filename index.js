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
var changePassword = require("./controller/ChangePassword")
var logoutUser = require("./controller/LogoutApi")
var forgotAppPin = require("./controller/ForgotAppPinApi")

app.use('/records/', addRecords)
app.use('/records/', getRecords)
app.use("/records", actionsOnRecord)
app.use("/user/", login)
app.use("/user/", signup)
app.use("/user/", updateSignUpDetails)
app.use("/user/", profileDetails)
app.use("/user/", forgotPassword)
app.use("/user/", changePassword)
app.use("/user/", logoutUser)
app.use("/user/", forgotAppPin)

//----------------------------------------------- test purpose ---------------------------------------//
var dummySignup = require("./controller/DummySIgnUp")
app.use("/dummy/", dummySignup)


app.listen(3000, () => {
    console.log("Server running at port 3000");
})


module.exports = app;



