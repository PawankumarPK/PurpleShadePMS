// Require objects.
var express = require('express');
var app     = express();
var aws     = require('aws-sdk');
var config =  require("config")

// Edit this with YOUR email address.
var email   = "pyadav.workmail@gmail.com";

// Load your AWS credentials and try to instantiate the object.
//make default.json file in controller and add below code
/** 
{ 
    "accessKeyId": "AKIAU62HD5VCRBDCOVAG",
    "secretAccessKey": "LFOMIfeuAl65JVkFiDbyHPIMgdtUc+hSiPB7c4Du",
    "region": "us-west-2"
}
*/

//uncomment this if you are going to use aws ses
//aws.config.loadFromPath(__dirname + "/default.json")



// Instantiate SES.
var ses = new aws.SES();

// Verify email addresses.
app.get('/verify', function (req, res) {
    var params = {
        EmailAddress: email
    };
    
    ses.verifyEmailAddress(params, function(err, data) {
        if(err) {
            res.send(err);
        } 
        else {
            res.send(data);
        } 
    });
});


// Listing the verified email addresses.
app.get('/list', function (req, res) {
    ses.listVerifiedEmailAddresses(function(err, data) {
        if(err) {
            res.send(err);
        } 
        else {
            res.send(data);
        } 
    });
});


// Deleting verified email addresses.
app.get('/delete', function (req, res) {
    var params = {
        EmailAddress: email
    };

    ses.deleteVerifiedEmailAddress(params, function(err, data) {
        if(err) {
            res.send(err);
        } 
        else {
            res.send(data);
        } 
    });
});
// Deleting verified email addresses.
app.get('/delete', function (req, res) {
    var params = {
        EmailAddress: email
    };

    ses.deleteVerifiedEmailAddress(params, function(err, data) {
        if(err) {
            res.send(err);
        } 
        else {
            res.send(data);
        } 
    });
});


// Sending RAW email including an attachment.
app.get('/send', function (req, res) {
    var ses_mail = "From: 'AWS Tutorial Series' <" + email + ">\n";
    ses_mail = ses_mail + "To: " + email + "\n";
    ses_mail = ses_mail + "Subject: AWS SES Attachment Example\n";
    ses_mail = ses_mail + "MIME-Version: 1.0\n";
    ses_mail = ses_mail + "Content-Type: multipart/mixed; boundary=\"NextPart\"\n\n";
    ses_mail = ses_mail + "--NextPart\n";
    ses_mail = ses_mail + "Content-Type: text/html; charset=us-ascii\n\n";
    ses_mail = ses_mail + "This is the body of the email.\n\n";
    ses_mail = ses_mail + "--NextPart\n";
    ses_mail = ses_mail + "Content-Type: text/plain;\n";
    ses_mail = ses_mail + "Content-Disposition: attachment; filename=\"attachment.txt\"\n\n";
    ses_mail = ses_mail + "AWS Tutorial Series - Really cool file attachment!" + "\n\n";
    ses_mail = ses_mail + "--NextPart--";
    
    var params = {
        RawMessage: { Data: new Buffer(ses_mail) },
        Destinations: [ email ],
        Source: "'AWS Tutorial Series' <" + email + ">'"
    };
    
    ses.sendRawEmail(params, function(err, data) {
        if(err) {
            res.send(err);
        } 
        else {
            res.send(data);
        }           
    });
});

module.exports = app