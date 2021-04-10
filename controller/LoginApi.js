var express = require("express")
var router = express()

var userModel = require("../moduleDB/SignupDB")

const bodyParser = require('body-parser');
router.use(express.urlencoded({ extended: false }));
router.use(express.json())

var jwt = require("jsonwebtoken")
var bcrypt = require("bcrypt");
const user_id = require("../customObject/userDetail");

router.post("/login", function (req, res) {

    var email = req.body.email
    var password = req.body.password

    userModel.findOne({ email: email })
        .exec()
        .then(user => {
            if (user.length < 1) {
                res.status(404).json({
                    message: "Auth Failed"
                })
            } else if (!user) {
                return res.status(401).send({ msg: 'The email address ' + email + ' is not associated with any account. please check and try again!' });
            } else if (!user.isVerified) {
                return res.status(401).send({ msg: "Your Email has not been verified. Please click on resend" })
            }
            // user successfully logged in
            // else{
            //     return res.status(200).send('User successfully logged in.');
            // }
            else {

                bcrypt.compare(password, user.password, function (err, result) {
                    if (err) {
                        res.status(404).json({
                            message: err
                        })
                    }

                    if (result) {

                        //--------------------------------- Generate token -------------------------//

                        var token = jwt.sign({
                            username: user.username,
                            email: user.email,
                            userId: user._id
                        },
                            "secret", {
                            expiresIn: "7d"
                        })

                        // --------------------- Update token -----------------------//
                        userModel.updateOne({ _id: user._id }, { token: token }, function (err, res) {
                            if (err) throw err;
                        });


                        res.status(201).json({
                            message: "User Found",
                            token: token,
                        })
                        user_id.uId = user._id

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