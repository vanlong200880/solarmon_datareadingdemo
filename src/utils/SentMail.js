// import Constants from "./Constants";
import Libs from "./Libs";
// import qs from 'qs';
// import axios from 'axios';
// "use strict";
var nodemailer = require('nodemailer');


var SentMail = function () {
}
module.exports = SentMail;
/**
 * sent mail 
 * @param plaintext 
 * @return string
 */
 
SentMail.SentMailHTML = function (from, to, subject, contentHtml) {
    if (Libs.isBlank(from)) { from = config.server.fromEmailConfig };
    if (!Libs.isBlank(to)) { 
        to = to;
    } else {
        to = config.server.toEmailConfig;
    };
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: config.server.smtpConfig.host,
        port: config.server.smtpConfig.port,
        secure: config.server.smtpConfig.secureConnection, // true for 465, false for other ports
        auth: {
            user: config.server.smtpConfig.auth.user,
            pass: config.server.smtpConfig.auth.pass
        }
    });

    var mailOptions = {
        from: from,
        to: to,
        subject: subject,
        html: contentHtml
    };

    return transporter.sendMail(mailOptions).then(info => {
        // console.log('infoL: ', info);
        // console.log('Preview URL: ' + nodemailer.getTestMessageUrl(info));
    });
}


