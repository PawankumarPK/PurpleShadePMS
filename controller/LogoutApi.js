var express = require("express")
var router = express()

var UserModel = require("../moduleDB/SignupDB")

const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json())


router.patch("/logout", function (req, res) {
    var id = req.query.id

    UserModel.findById(id, function (req, user) {
        user.token = ""

        user.save().then(data => {
            res.status(201).json({
                message: "Successfully Logout",
                result: data
            })
        })

    })
})

module.exports = router