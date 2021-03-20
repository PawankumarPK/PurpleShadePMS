var express = require("express")
var router = express()

var UserModel = require("../moduleDB/SignupDB")

var bcrypt = require("bcrypt")

const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json())

router.patch("/updatePassword", function (req, res) {
    var id = req.query.id
    var email = req.body.email
    var password = req.body.password
    var confirmPassword = req.body.confirmPassword


    if (password !== confirmPassword) {
        res.json({
            message: "Password Not Matched!"
        })
        return
    }

    UserModel.findById(id, function (err, data) {

        if (err) {
            return res.status(500).send({ msg: err.message });
        }

        console.log(password);
        data.password = password

        data.save().then(data => {
            res.status(201).json({
                message: "Password Update Successfully",
                result: data
            })
        })
    })
})

module.exports = router