import nodemailer from "nodemailer";
import config from "../config";

const sendEmail = async (to: string, message: string) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: config.NODE_ENV === "production",
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: config.send_email_user,
      pass: config.send_email_pass,
    },
  });

  await transporter.sendMail({
    from: '"PH-University 👻" <jubayerahmedshamim44@gmail.com>', // sender address
    to, // list of receivers
    subject: "Reset Password Link", // Subject line
    text: "Please change your password with this link within 10 minutes", // plain text body
    html: `<b>here is password change link: <a href="${message}">${message}</a> </b>`, // html body
  });
};

export default sendEmail;
