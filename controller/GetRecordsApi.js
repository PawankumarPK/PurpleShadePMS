var express = require("express")
var router = express()

var userRecord = require("../moduleDB/AddRecordsDB")
var checkAuth = require("../middleware/auth")

const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json())

router.get("/allRecords", function (req, res) {
    var id = req.query.id

    var allRecord = userRecord.find({ loginId: id })
    allRecord.exec().then(data => {
        res.status(200).json({
            message: "Success",
            record: data
        })

    }).catch(err => {
        res.json(err)
    })
})

module.exports = router;

