var express = require("express")
var router = express()

var User = require("../moduleDB/SignupDB")

var bcrypt = require("bcrypt")
var token = require("token")
var crypto = require("crypto")
const { v4: uuidv4 } = require('uuid');
const nodemailer = require("nodemailer");


const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json())

router.post("/dummySignup", function (req, res, next) {

    var username = req.body.username
    var email = req.body.email
    var password = req.body.password
    var confirmPassword = req.body.confirmPassword
    var token = uuidv4()

    User.findOne({ email }, function (err, user) {
        // error occur
        if (err) {
            return res.status(500).send({ msg: err.message });
        }
        // if email is exist into database i.e. email is associated with another user.
        else if (user) {
            return res.status(400).send({ msg: 'This email address is already associated with another account.' });
        }
        // if user is not exist into database then save the user into database for register account

        else {
            // password hashing for save into database
            password = bcrypt.hashSync(password, 10);
            // create and save user
            user = new User({ username: username, email: email, password: password, signUpToken: token });
            user.save(function (err) {
                if (err) {
                    return res.status(500).send({ msg: err.message });
                }

                console.log(user.isVerified);

                // generate token and save

                //var token = new Token({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });

                // Send email (use credintials of SendGrid)

                var transporter = nodemailer.createTransport({
                    host: "smtp.mailtrap.io",
                    port: 2525,
                    auth: {
                        user: "16111fa3918686",
                        pass: "e1a66aed659b3b"
                    }
                });

                // var transporter = nodemailer.createTransport({
                //     host: "smtp.ethereal.email",
                //     port: 587,
                //     auth: { user: process.env.SENDGRID_USERNAME, pass: process.env.SENDGRID_PASSWORD }
                // });
                var mailOptions = {
                    from: 'no-reply@example.com',
                    to: user.email,
                    subject: 'Account Verification Link',
                    text: `Hello ${username}
                    Please verify your account by clicking the link: 
                    http://${req.headers.host}/verify/user/${token}
                    Thank You`}

                transporter.sendMail(mailOptions);

                return res.status(200).send('A verification email has been sent to ' + user.email + '. It will be expire after one day. If you not get verification Email click on resend token.');

            })

        }
    })
})

router.get("/verify/:token", function (req, res) {

    var token = req.params.token

    // token is not found into database i.e. token may have expired 
    if (!token) {
        return res.status(400).send({ msg: 'Your verification link may have expired. Please click on resend for verify your Email.' });
    }

    // if token is found then check valid user 

    else {
        User.findOne({ signUpToken: token }, function (err, user) {
            // not valid user
            if (!user) {
                return res.status(401).send({ msg: 'We were unable to find a user for this verification. Please SignUp!' });
            }
            // user is already verified
            else if (user.isVerified) {
                return res.status(200).send('User has been already verified. Please Login');
            }
            // verify user
            else {
                // change isVerified to true
                user.isVerified = true;

                console.log(user.isVerified);
                user.save(function (err) {
                    // error occur
                    if (err) {
                        return res.status(500).send({ msg: err.message });
                    }
                    // account successfully verified
                    else {
                        return res.status(200).send('Your account has been successfully verified');
                    }
                });
            }
        });
    }


})

module.exports = router