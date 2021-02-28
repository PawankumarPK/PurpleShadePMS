var express = require("express")
var router = express()

var userProfile = require("../moduleDB/SignupDB")

const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json())


router.get("/userProfile", function (req, res) {
    var id = req.query.id

    var userProfileDetail = userProfile.find({ _id: id })
    userProfileDetail.exec().then(data => {
        res.status(200).json({
            message: "Success",
            data: data
        })
    }).catch(err =>{
        res.json(err)
    })
})

module.exports = router

