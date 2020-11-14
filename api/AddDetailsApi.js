var app = require("../app")
var userRecords = require("../moduleDB/AddRecordsDB")

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

app.post("/inputRecord", function (req, res) {

    var title = req.body.title
    var webAddress = req.body.webAddress
    var email = req.body.email
    var password = req.body.password
    var addNote = req.body.addNote

    var record = new userRecords({
        title: title,
        webAddress: webAddress,
        email: email,
        password: password,
        addNote: addNote
    })

    record.save().then(data => {

        res.status(201).json({
            message: "Successfull add record",
            record: data
        })

    }).catch(err => {
        res.json(err)
    })
})