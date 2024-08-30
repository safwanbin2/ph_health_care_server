import { NextFunction, Request, Response, Router } from "express";
import { UserController } from "./user.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { fileUploader } from "../../utils/fileUploader";
import { UserValidation } from "./user.validation";

const router = Router();

router.post(
  "/create-admin",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = UserValidation.createAdminValidationSchema.parse(
      JSON.parse(req?.body?.data)
    );
    return UserController.createAdmin(req, res, next);
  }
);

export const UserRouter = router;
