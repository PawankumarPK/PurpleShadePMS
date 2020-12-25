var express = require("express")
var router = express()

var userRecords = require("../moduleDB/AddRecordsDB")
const { route } = require("./AddRecordsApi")

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

router.patch("/updateDetails", function (req, res) {
    var id = req.query.id
    var title = req.body.title
    var websiteAddress = req.body.websiteAddress
    var email = req.body.email
    var password = req.body.password
    var addNote = req.body.addNote

    userRecords.findById(id, function (err, data) {
        data.title = title
        data.websiteAddress = websiteAddress
        data.email = email
        data.password = password
        data.addNote = addNote

        data.save().then(data => {
            res.status(201).json({
                message: "Record update successfully",
                result: data
            })
        }).catch(err => {
            res.json(err)
        })
    })

})

router.get("/viewDetails", function (req, res) {
    var id = req.query.id

    var details = userRecords.find({ _id: id })
    details.exec().then(data => {
        res.status(200).json({
            message: "Fetch Details Successfully",
            record: data
        })

    })
})

router.get("/recordDetail", function (req, res) {
    var id = req.query.id

    var recordDetail = userRecords.find({ _id: id })
    recordDetail.exec().then(data => {
        res.status(200).json({
            message: "Fetch record detail successfully",
            record: data
        })
    })
})

module.exports = router
