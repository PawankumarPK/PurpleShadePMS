var express = require("express")
var router = express()

var userRecords = require("../moduleDB/AddRecordsDB")

const bodyParser = require('body-parser');
const userDetail = require("../customObject/userDetail");
var checkAuth = require("../middleware/auth")

router.use(express.urlencoded({ extended: false }));
router.use(express.json())

router.post("/inputRecord", function (req, res) {

    var title = req.body.title
    var webAddress = req.body.webAddress
    var email = req.body.email
    var password = req.body.password
    var addNote = req.body.addNote
    var loginId = req.body.loginId

    var record = new userRecords({
        title: title,
        websiteAddress: webAddress,
        email: email,
        password: password,
        addNote: addNote,
        loginId: loginId
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

module.exports = router;