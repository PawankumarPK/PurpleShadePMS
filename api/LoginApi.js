var app = require("../app")
var userModel = require("../moduleDB/signup")

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

var jwt = require("jsonwebtoken")
var bcrypt = require("bcrypt")


app.post("/login", function (req, res) {

    var email = req.body.email
    var password = req.body.password

    userModel.find({ email: email })
        .exec()
        .then(user => {
            if (user.length < 1) {
                res.status(404).json({
                    message: "Auth Failed"
                })
            } else {
                bcrypt.compare(password, user[0].password, function (err, result) {
                    if (err) {
                        res.status(404).json({
                            message: "Auth Failed"
                        })
                    }
                    if (result) {
                        var token = jwt.sign({
                            username: user[0].username,
                            email: user[0].email,
                            userId: user[0]._id
                        },
                            "secret", {
                            expiresIn: "1h"
                        })

                        res.status(201).json({
                            message: "User Found",
                            token: token
                        })
                    } else {
                        res.status(404).json({
                            message: "Auth Failed"
                        })
                    }
                })

            }

        })
        .catch(err => {
            res.json({
                error: err
            })
        })


})