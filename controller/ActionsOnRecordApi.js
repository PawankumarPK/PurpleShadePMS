var express = require("express")
var router = express()

var userRecords = require("../moduleDB/AddRecordsDB")

router.delete("/deleteRecord", function (req, res) {

    var recordId = req.query.id
    userRecords.findByIdAndRemove(recordId).then(data => {
        res.status(201).json({
            message: "Delete Record Successfully",
            result: data
        })
    }).catch(err => {
        res.json(err)
    })
})

module.exports = router
