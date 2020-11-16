var express = require("express")
var router = express()

var userRecord = require("../moduleDB/AddRecordsDB")

const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json())

router.get("/allRecords", function (req, res) {
    var allRecord = userRecord.find()

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

