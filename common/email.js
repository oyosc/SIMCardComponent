"use strict";
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var option = require('./config').email;

//var transporter = nodemailer.createTransport(smtpTransport(option.from));

var transporter = nodemailer.createTransport({
    host: option.from.host,
    secureConnection: true, // use SSL
    port: 465, // port for secure SMTP
    tls : {rejectUnauthorized: false},
    auth: option.from.auth
});

exports.sendVerifyEmail = function(mailData, callback) {
    var emailVerificationText = '';
    if (mailData.emailVerificationToken) {
        //emailVerificationText = 'Activate your account:' + mailData.emailVerificationToken;
        emailVerificationText = '请点击下面的链接，您的APIKey是：' + mailData.APIKey + '，验证您的账号：' + mailData.emailVerificationToken;
    }
    //var mailContentText = 'Welcome, and thanks for signing up for AccountsComponent! ' + emailVerificationText;
    //var htmlText = '<b>Welcome, and thanks for signing up for AccountsComponent!</b>';
    var htmlText = '<b>欢迎使用美赛达用户管理组件！</b>';
    var mailContentText = '欢迎使用美赛达用户管理组件！ ' + emailVerificationText;
    var mailContentHtml = htmlText + '<b>' + emailVerificationText + '</b>'
    var mailOptions = {
        from: option.defaultFrom,
        to: mailData.userEmail,
        envelope: {
            from: option.defaultFrom,
            to: mailData.userEmail
        },
        subject: 'Please verify this email address',
        text:mailContentText,
        html:mailContentHtml,
        generateTextFromHTML : true
    };
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log(error);
            callback(error);
        }else{
            console.log('Message sent: ' + info.response);
            callback(null, info);
        }
    });
};

//transport.sendMail({
//    from : "webadmin@mesada.com.cn",
//    to : "zhaozhi@mesada.com.cn",
//    subject: "test",
//    generateTextFromHTML : true,
//    html : "啊哈哈哈"
//}, function(error, response){
//    if(error){
//        console.log(error);
//    }else{
//        console.log("Message sent: " + response.message);
//    }
//    transport.close();
//});