"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailHtml2 = exports.mailSent2 = exports.emailHtml = exports.mailSent = exports.onRequestOTP = exports.GenerateOTP = void 0;
const config_1 = require("../config");
const nodemailer_1 = require("nodemailer");
const GenerateOTP = () => {
    const otp = Math.floor(1000 + Math.random() * 9000);
    const expiry = new Date();
    expiry.setTime(new Date().getTime() + 30 * 60 * 1000);
    return { otp, expiry };
};
exports.GenerateOTP = GenerateOTP;
const onRequestOTP = async (otp, toPhoneNumber) => {
    const client = require('twilio')(config_1.accountSid, config_1.authToken);
    const response = await client.messages
        .create({
        body: `Your OTP is ${otp}`,
        to: toPhoneNumber,
        from: config_1.fromAdminPhone
    });
    return response;
};
exports.onRequestOTP = onRequestOTP;
const transport = (0, nodemailer_1.createTransport)({
    service: 'gmail',
    auth: {
        user: config_1.GMAIL_USER,
        pass: config_1.GMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});
const mailSent = async (from, to, subject, html) => {
    try {
        const response = await transport.sendMail({
            from: config_1.FromAdminMail, subject: config_1.userSubject, to, html
        });
        return response;
    }
    catch (err) {
        console.log(err);
    }
};
exports.mailSent = mailSent;
const emailHtml = (otp) => {
    let response = `
      <div style="max-width: 700px; margin:auto; border:10px solid #ddd; border-radius:25px; padding:50px 20px; font-size:110%; font-family:sans-serif;">
      <h2 style="text-align:center; text-transform:uppercase; color:teal;">
      WELCOME TO SWIFT RIDERS
      </h2>
      <p>Hi there, your otp is ${otp}</p>
      </div>
      `;
    return response;
};
exports.emailHtml = emailHtml;
/**===================user mail services =========== **/
const mailSent2 = async (from, to, subject, html) => {
    try {
        const response = await transport.sendMail({ from: config_1.FromAdminMail,
            subject: config_1.userSubject,
            to,
            html });
        return response;
    }
    catch (error) {
        console.log(error);
    }
};
exports.mailSent2 = mailSent2;
const emailHtml2 = (link) => {
    let response = `
      <div style="max-width:700px;
      margin:auto;
      border:10px solid #ddd;
      padding:50px 20px;
      font-size: 110%;
      font-style: italics
      "> 
      <h2 style="text-align:center;
      text-transform:uppercase;
      color:teal;
      ">
      Swift Riders
      </h2>
      <p>Hi there, below is your password reset link and it expires in 10 mins</p>
       ${link}
       <h3>DO NOT DISCLOSE TO ANYONE<h3>
       </div>
      `;
    return response;
};
exports.emailHtml2 = emailHtml2;
