import nodemailer from "nodemailer";
import config from "../config";
import AppEror from "../errors/AppError";
import httpStatus from "http-status";

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false,
  auth: {
    user: config.sendMail.nodemailerEmail,
    pass: config.sendMail.appPass,
  },
});

const sendMail = async (to: string, resetLink: string) => {
  console.log({ transporter, to, resetLink });
  try {
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: '"Maddison Foo Koch 👻" <maddison53@ethereal.email>', // sender address
      to, // list of receivers
      subject: "PH Healthcare - Reset password", // Subject line
      text: "Hello world?", // plain text body
      html: `<a href="${resetLink}">Reset Password</a>`, // html body
    });

    return info;
  } catch (error) {
    throw new AppEror(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Could not send reset link!"
    );
  }
};

export default sendMail;
