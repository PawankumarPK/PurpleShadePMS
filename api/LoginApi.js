var app = require("../app")
var userModel = require("../moduleDB/signup")

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

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
                        res.status(201).json({
                            message: "User Found",
                            user: user
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