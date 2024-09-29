import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT || 5000,
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
  },
  sendMail: {
    nodemailerEmail: process.env.NODEMAILER_EMAIL,
    appPass: process.env.APP_PASS,
  },
  frontendURL: process.env.FRONTEND_URL,
  resetPassSecret: process.env.RESET_PASS_SECRET,
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
  store_id: process.env.STORE_ID,
  store_password: process.env.STORE_PASSWORD,
};
