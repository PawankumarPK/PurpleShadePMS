var express = require("express")
var app = express()

var addRecords = require("./api/AddRecordsApi")
var getRecords = require("./api/GetRecordsApi")
var login = require("./api/LoginApi")
var signup = require("./api/SignUpApi")

app.use('/records/', addRecords)
app.use('/records/', getRecords)
app.use("/user/", login)
app.use("/user/", signup)

app.listen(3000, () => {
    console.log("Server running at port 3000");
})


module.exports = app;



