var express = require("express")
var router = express()

var ForgotPasswordModel = require("../moduleDB/ForgotPasswordDB")
var UserModel = require("../moduleDB/SignupDB")

var bcrypt = require("bcrypt")

const { v4: uuidv4 } = require('uuid');
const nodemailer = require("nodemailer");

const bodyParser = require('body-parser');
const { route } = require("./ActionsOnRecordApi")

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json())

router.post("/forgotPassword", function (req, res, next) {
    var email = req.body.email
    var token = Math.floor(100000 + Math.random() * 900000)

    ForgotPasswordModel.findOne({ email }, function (err, user) {

        //--------- error occur ----------//
        if (err) {
            return res.status(500).send({ msg: err.message });
        }

        //---------- if user is not exist into database then save the user into database for register account --------//
        else {

            //-------------------- create and save user --------------------//
            user = new ForgotPasswordModel({ email: email, forgotPassToken: token });

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
                    html: `Dear User <br><h4>Seems like you forgot your password for PMS</h4></br>
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

router.post("/verificationToken", function (req, res) {
    var email = req.body.email

    var forgotPasswordDetail = ForgotPasswordModel.findOne({ email: email })
    forgotPasswordDetail.exec().then(user => {

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

router.get("/forgotPassVerify", function (req, res) {

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
        ForgotPasswordModel.findOne({ email: email, forgotPassToken: token }, function (err, user) {

            //--------------------- not valid user ------------------------------------//
            if (!user) {
                var response = res.status(401).send({ msg: 'We were unable to find a user for this verification. Please SignUp!' });
                removeField(res, email)
                return response
            }


            user.isVerified = true;

            console.log(user.isVerified);
            user.save(function (err) {
                //-------------------- error occur ----------------------//
                if (err) {
                    return res.status(500).send({ msg: err.message });
                }
                //----------------- account successfully verified -----------------------//
                else {
                    // removeField(res, email)
                    return res.status(200).send('Your account has been successfully verified');
                }
            });
        })

    }
})

function removeField(res, email) {
    ForgotPasswordModel.findOneAndDelete(email).then(data => {
        //res.status(201).send({ msg: "Delete data" })
    })
}

router.post("/updatePassword", function (req, res) {

    var email = req.body.email
    var password = req.body.password
    var confirmPassword = req.body.password

    password = bcrypt.hashSync(password, 10);

    UserModel.updateOne({ email: email }, { password: password }, function (err, res) {
        if (err) {
            return res.status(500).send({ msg: err.message });
        }
    })

    res.status(201).json({
        message: "Password update successfully"
    })

})


module.exports = router