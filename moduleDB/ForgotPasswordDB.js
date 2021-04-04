require("dotenv").config()

const mongoose = require("mongoose")
mongoose.connect(process.env.LOCAL_URL_FOR_MONGODB, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
var conn = mongoose.connection

var userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        index: {
            unique: true
        },
        match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
    },
    forgotPassToken: {
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


var forgotPasswordVerify = mongoose.model("forgotPassword", userSchema)
module.exports = forgotPasswordVerify

