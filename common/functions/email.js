var postmark = require("postmark");
const config = require('../../common/config/env.config.js');
const nodemailer = require("nodemailer");
const  env  = process.env;

const transporter = nodemailer.createTransport({
    host: "mail.alifpay.com.my",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: "no-reply@alifpay.com.my",
      pass: "iamNoRLAP!$@#",
    },
  });

exports.sendEmail =async (to,subject,contents,attachments=[])=>{
    var client = new postmark.Client(env.POSTMARK);
   
   // console.log(env.POSTMARK);
    
   const send= await client.sendEmailWithTemplate({
        "From": "no-reply@alifpay.com.my", 
        "To": to, 
        "TemplateAlias": subject,
        "TemplateModel": contents
    });
    console.log("send")
    console.log(send)
    /*
    const info = await transporter.sendMail({
        from: 'AlifPay<no-reply@alifpay.com.my>', // sender address
        to: to, // list of receivers
        subject: subject, // Subject line
        text: contents, // plain text body
     // html body
      });
    
      console.log("Message sent: %s", info.messageId);
    //iamNoRLAP!$@#
    */
}
