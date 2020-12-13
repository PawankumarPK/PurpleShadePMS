var express = require("express")
var app = express()

var addRecords = require("./controller/AddRecordsApi")
var getRecords = require("./controller/GetRecordsApi")
var login = require("./controller/LoginApi")
var signup = require("./controller/SignUpApi")

app.use('/records/', addRecords)
app.use('/records/', getRecords)
app.use("/user/", login)
app.use("/user/", signup)

app.listen(3000, () => {
    console.log("Server running at port 3000");
})


module.exports = app;



