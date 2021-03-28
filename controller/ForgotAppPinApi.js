var express = require("express")
var router = express()

var AppPinModel = require("../moduleDB/ForgotAppPinDB")

const nodemailer = require("nodemailer");

const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json())

router.post("/forgotAppPin", function (req, res, next) {
    var email = req.body.email
    var token = Math.floor(100000 + Math.random() * 900000)

    //console.log(Math.floor(100000 + Math.random() * 900000));


    AppPinModel.findOne({ email }, function (err, user) {

        //--------- error occur ----------//
        if (err) {
            return res.status(500).send({ msg: err.message });
        }

        //---------- if user is not exist into database then save the user into database for register account --------//
        else {

            //-------------------- create and save user --------------------//
            user = new AppPinModel({ email: email, forgotPinToken: token });

            user.save(function (err) {
                if (err) {
                    return res.status(500).send({ msg: err.message });
                }

                //--------- generate token and save --------//

                var transporter = nodemailer.createTransport({
                    host: "smtp.mailtrap.io",
                    port: 2525,
                    auth: {
                        user: "16111fa3918686",
                        pass: "e1a66aed659b3b"
                    }
                });

                var mailOptions = {
                    from: 'no-reply@example.com',
                    to: user.email,
                    subject: 'Account Verification Link',
                    text: `Hello User'
                    Please use this code to reset the PIN for the app: 
                    Here is your code: ${token}
                    Thank You`}

                transporter.sendMail(mailOptions);

                return res.status(200).send('A verification email has been sent to ' + user.email + '. It will be expire after one day. If you not get verification Email click on resend token.');

            })

        }
    })
})


router.get("/forgotPinVerify", function (req, res) {

    var id = req.query.id
    var token = req.query.token

    //--------------- token is not found into database i.e. token may have expired ---------------//
    if (!token) {
        var response = res.status(400).send({ msg: 'Your verification link may have expired. Please click on resend for verify your Email.' });
        removeField(res, id)
        return response
    }

    //---------------- if token is found then check valid user ------------------//

    else {
        AppPinModel.findOne({ _id: id, forgotPinToken: token }, function (err, user) {

            if (!user) {
                var response = res.status(401).send({ msg: "We were unable to find a user for this verification. Please SignUp!" })
                removeField(res, id)
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
                    return res.status(200).send('Your account has been successfully verified');
                }
            });
        })

    }
})


function removeField(res,id) {
    AppPinModel.findByIdAndDelete(id).then(data => {
        //res.status(201).send({ msg: "Delete data" })
    })
}


module.exports = router