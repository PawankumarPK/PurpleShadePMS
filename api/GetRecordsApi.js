var app = require("../app")
var userRecord = require("../moduleDB/AddRecordsDB")

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

app.get("/allRecords", function (req, res) {
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
