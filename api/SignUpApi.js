var express = require("express")
var router = express()

var userModel = require("../moduleDB/SignupDB")

var bcrypt = require("bcrypt")

const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json())

//Api for signup

router.post("/signup", function (req, res) {

    var username = req.body.username
    var email = req.body.email
    var password = req.body.password
    var confirmPassword = req.body.confirmPassword

    if (password !== confirmPassword) {
        res.json({
            message: "Password Not Matched!",
        })
    } else {
        bcrypt.hash(password, 10, function (err, hash) {
            if (err) {
                return res.json({
                    message: "Something went wrong",
                    error: err
                })
            } else {
                var userDetails = new userModel({
                    username: username,
                    email: email,
                    password: hash
                })

                userDetails.save().then(data => {
                    res.status(201).json({
                        message: "User Register Successfully",
                        result: data
                    })
                }).catch(err => {
                    res.json(err)
                })

            }
        })
    }
})
module.exports = router

