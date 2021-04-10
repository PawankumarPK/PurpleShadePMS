var express = require("express")
var router = express()

var UserModel = require("../moduleDB/SignupDB")

const nodemailer = require("nodemailer");

const bodyParser = require('body-parser');
const { route } = require("./SignUpApi");

router.use(express.urlencoded({ extended: false }));
router.use(express.json())

router.post("/updateAppPin", function (req, res) {

    var email = req.body.email
    var pin = req.body.pin

    UserModel.updateOne({ email: email }, { appPin: pin }, function (err, res) {
        if (err) {
            return res.status(500).send({ msg: err.message });
        }
    })

    res.status(201).json({
        message: "Pin update successfully"
    })

})


function removeField(res, id) {
    AppPinModel.findByIdAndDelete(id).then(data => {
        //res.status(201).send({ msg: "Delete data" })
    })
}


module.exports = router