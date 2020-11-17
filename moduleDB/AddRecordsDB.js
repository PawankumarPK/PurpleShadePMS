const mongoose = require("mongoose")
mongoose.connect("mongodb://localhost:27017/PurpleShadesPMS", { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })

var userRecords = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },
    websiteAddress: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    addNote: {
        type: String
    },
    loginId: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now
    }
})

var userDetails = mongoose.model("Record", userRecords)
module.exports = userDetails