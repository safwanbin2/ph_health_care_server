import multer from "multer";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import config from "../config";
import AppEror from "../errors/AppError";
import fs from "fs";

cloudinary.config({
  cloud_name: "ds1maiqpl",
  api_key: "184943465832974",
  api_secret: config.cloudinaryApiSecret, // Click 'View API Keys' above to copy your API secret
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "/uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const uploadToCloudinary = async (file: any) => {
  try {
    fs.unlinkSync(file.path);
    const uploadResult = await cloudinary.uploader.upload(file.path, {
      public_id: file.originalname,
    });
    return uploadResult;
  } catch (error) {
    throw new AppEror(400, "Could not upload to cloudinary");
  }
};

const upload = multer({ storage: storage });

export const fileUploader = {
  upload,
  uploadToCloudinary,
};
