import { NextFunction, Request, Response, Router } from "express";
import { UserController } from "./user.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { fileUploader } from "../../utils/fileUploader";
import { UserValidation } from "./user.validation";

const router = Router();

router.get("/", UserController.getAllUser);

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

router.post(
  "/create-doctor",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = UserValidation.createDoctorValidationSchema.parse(
      JSON.parse(req?.body?.data)
    );
    return UserController.createDoctor(req, res, next);
  }
);

router.post(
  "/create-patient",
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = UserValidation.createPatientValidationSchema.parse(
      JSON.parse(req?.body?.data)
    );
    return UserController.createPatient(req, res, next);
  }
);

export const UserRouter = router;
