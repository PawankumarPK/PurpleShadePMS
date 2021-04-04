require("dotenv").config() 

const nodemailer = require("nodemailer")

//step 1
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }

})

//step 2
let mailOption = {
    from: process.env.EMAIL,
    to: 'pawanrock006@gmail.com',
    subject: 'Testing and testing',
    text: 'ENV working '
}

// step3
transporter.sendMail(mailOption, function (err, data) {
    if (err) {
        console.log(err);
    } else {
        console.log("Email sent !!!!!");
    }
})