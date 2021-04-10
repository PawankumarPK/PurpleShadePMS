require("dotenv").config()


var express = require("express")
var router = express()

var UserModel = require("../moduleDB/SignupDB")

var bcrypt = require("bcrypt")

const { v4: uuidv4 } = require('uuid');
const nodemailer = require("nodemailer");

const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json())

router.post("/signup", function (req, res, next) {

    var username = req.body.username
    var email = req.body.email
    var password = req.body.password
    var confirmPassword = req.body.confirmPassword
    var appPin = req.body.appPin
    var userToken = ""
    var token = Math.floor(100000 + Math.random() * 900000)

    if (password !== confirmPassword) {
        res.json({
            message: "Password Not Matched!"
        })

        return
    }

    UserModel.findOne({ email }, function (err, user) {
        //--------- error occur ----------//
        if (err) {
            return res.status(500).send({ msg: err.message });
        }

        //-------- if email is exist into database i.e. email is associated with another user ---------//
        else if (user) {
            return res.status(400).send({ msg: 'This email address is already associated with another account.' });
        }

        //---------- if user is not exist into database then save the user into database for register account --------//
        else {

            //-------- password hashing for save into database ---------//
            password = bcrypt.hashSync(password, 10);

            //-------------------- create and save user --------------------//
            user = new UserModel({ username: username, email: email, password: password, appPin: appPin, signUpToken: token, token: userToken });
            //user = new UserModel(req.body)

            user.save(function (err) {
                if (err) {
                    return res.status(500).send({ msg: err.message });
                }

                //--------- generate token and save --------//

                //step 1
                let transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: process.env.EMAIL,
                        pass: process.env.PASSWORD
                    }

                })

                //step 2
                let mailOption = {
                    from: process.env.EMAIL,
                    to: email,
                    subject: 'Account Verification Code',
                    html: `Hello ${username} <br><h4>Is this you signing up?</h4></br>
                    If yes, use this verification code <br><h2>${token}</h2></br>`

                }

                // step3
                transporter.sendMail(mailOption, function (err, data) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("Email sent !!!!!");
                        return res.status(200).send('A verification email has been sent to ' + user.email + '. It will be expire after one day. If you not get verification Email click on resend token.');

                    }
                })

            })

        }
    })
})


router.get("/signUpVerify", function (req, res) {

    var email = req.query.email
    var token = req.query.token

    //--------------- token is not found into database i.e. token may have expired ---------------//
    if (!token) {
        var response = res.status(400).send({ msg: 'Your verification link may have expired. Please click on resend for verify your Email.' });
        removeField(res, email)
        return response
    }

    //---------------- if token is found then check valid user ------------------//

    else {

        console.log(token);
        UserModel.findOne({ email: email, signUpToken: token }, function (err, user) {
            //-------------- not valid user ---------------//
            if (!user) {
                var response = res.status(401).send({ msg: 'We were unable to find a user for this verification. Please SignUp!' });
                removeField(res, email)
                return response

            }
            //----------------- user is already verified ----------------//
            else if (user.isVerified) {
                var response = res.status(200).send('User has been already verified. Please Login');
                console.log(email);
                return response
            }
            // ---------------- verify user -----------------//
            else {
                //-------------------- change isVerified to true --------------------//
                user.isVerified = true;

                console.log(user.isVerified);
                user.save(function (err) {
                    //-------------------- error occur ----------------------//
                    if (err) {
                        return res.status(500).send({ msg: err.message });
                    }
                    //----------------- account successfully verified -----------------------//
                    else {
                        return res.status(200).send('Your account has been successfully verified');
                    }
                });
            }
        });
    }


})


router.post("/verificationSignUpToken", function (req, res) {
    var email = req.body.email

    var signUpTokenDetail = UserModel.findOne({ email: email })
    signUpTokenDetail.exec().then(user => {

        if (!user) {
            var response = res.status(401).send({ msg: 'We were unable to find a user for this verification. Please SignUp!' });
            //removeField(res, email)
            return response
        }

        res.status(201).json({
            message: "Fetch verification token successful",
            token: user
        })
    })


})

router.post("/removeSignUp", function (req, res) {
    var email = req.body.email

    UserModel.deleteOne({ email: email }).then(data => {
        res.status(201).json({
            message: "Delete Field Successfully",
            result: data
        })
    }).catch(err => {
        res.json(err)
    })
})

function removeField(res, email) {
    UserModel.findOneAndDelete(email).then(data => {
        //res.status(201).send({ msg: "Delete data" })
    })
}

module.exports = router