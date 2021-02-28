var express = require("express")
var app = express()

var addRecords = require("./controller/AddRecordsApi")
const { request } = require("./controller/GetRecordsApi")
var getRecords = require("./controller/GetRecordsApi")
var login = require("./controller/LoginApi")
var signup = require("./controller/SignUpApi")
var actionsOnRecord = require("./controller/ActionsOnRecordApi")
var updateSignUpDetails = require("./controller/UpdateSignUpDetails")

app.use('/records/', addRecords)
app.use('/records/', getRecords)
app.use("/records", actionsOnRecord)
app.use("/user/", login)
app.use("/user/", signup)
app.use("/user/", updateSignUpDetails)

app.listen(3000, () => {
    console.log("Server running at port 3000");
})


module.exports = app;



