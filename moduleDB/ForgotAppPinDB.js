const mongoose = require("mongoose")
mongoose.connect("mongodb://localhost:27017/PurpleShadesPMS", { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
var conn = mongoose.connection

var userPinSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        index: {
            unique: true
        },
        match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
    },
    forgotPinToken: {
        type: String,
    },
    isVerified: {
        type: Boolean,
        default: false
    },

    date: {
        type: Date,
        default: Date.now
    }
})


var forgotPinVerify = mongoose.model("forgotAppPin", userPinSchema)
module.exports = forgotPinVerify

