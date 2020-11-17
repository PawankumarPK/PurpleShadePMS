var express = require("express")
var router = express()

var userModel = require("../moduleDB/SignupDB")

const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json())

var jwt = require("jsonwebtoken")
var bcrypt = require("bcrypt");
const user_id = require("../customObject/userDetail");

router.post("/login", function (req, res) {

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
                            expiresIn: "7d"
                        })

                        res.status(201).json({
                            message: "User Found",
                            token: user,
                        })
                        user_id.uId = user[0]._id                      

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

module.exports = router;