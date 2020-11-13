var app = require("../app")
var userModel = require("../moduleDB/signup")

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

app.post("/login", function (req, res) {

    var username = req.body.username
    var password = req.body.password

    userModel.find({ username: username })
        .exec()
        .then(user => {
            res.status(201).json({
                message: "User Found",
                user: user
            })
        })
        .catch(err => {
            res.json({
                error: err
            })
        })


})