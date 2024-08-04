var postmark = require("postmark");
const config = require('../../common/config/env.config.js');
const  env  = process.env;
exports.sendEmail =async (to,subject,contents,attachments=[])=>{
    var client = new postmark.Client(env.POSTMARK);
   
   // console.log(env.POSTMARK);
    
    client.sendEmailWithTemplate({
        "From": "no-reply@alifpay.com.my", 
        "To": to, 
        "TemplateAlias": subject,
        "TemplateModel": contents
    });

}
