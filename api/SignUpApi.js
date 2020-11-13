var app = require("../app")
var userModel = require("../moduleDB/signup")

const mongoose = require("mongoose")
var jwt = require("jsonwebtoken")
var bcrypt = require("bcrypt")

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())


//Api for signup

app.post("/signup", function (req, res) {

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

                console.log("===>>>", userDetails);
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
module.exports = app

