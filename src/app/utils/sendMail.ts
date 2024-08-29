import nodemailer from "nodemailer";
import config from "../config";
import AppEror from "../errors/AppError";
import httpStatus from "http-status";

const sendMail = async (to: string, resetLink: string) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: config.sendMail.nodemailerEmail,
      pass: config.sendMail.appPass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  try {
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: '"PH Healthcare 👻" <safwanridwan321@gmail.com>', // sender address
      to, // list of receivers
      subject: "PH Healthcare - Reset password", // Subject line
      // text: "Hello world?",
      html: `<a href=${resetLink}>Reset Password</a>`, // html body
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
