var express = require("express")
var router = express()

var userSignupRecord = require("../moduleDB/SignupDB")

router.patch("/updateProfile", function (req, res) {
    var id = req.query.id
    var username = req.body.username
    var email = req.body.email

    userSignupRecord.findById(id, function (err, data) {
        data.username = username
        data.email = email

        data.save().then(data => {
            res.status(201).json({
                message: "Profile Update Successfully",
                result: data
            })
        })
    })
})

module.exports = router

