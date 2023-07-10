import nodemailer from 'nodemailer';
import asyncHandler from 'express-async-handler';

// The data parameter contains the nodemailer options and  must passed before other parameters else it doesn't work
export const sendEmail = asyncHandler(async(data, req, res)=>{
    // Source: nodemailer website
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.MAIL_ID, // generated ethereal user(Sender email)
          pass: process.env.MP, // generated email apps password
        },
      });
    
      // send mail with defined transport object
      let info = await transporter.sendMail({
        from: '"Hey 👻" <abc@gmail.com.com>', // sender address
        to: data.to, // list of receivers
        subject: data.subject, // Subject line
        text: data.text, // plain text body
        html: data.htm, // html body
      });
    
      console.log("Message sent: %s", info.messageId);
      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    
      // Preview only available when sending through an Ethereal account
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
      // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
});