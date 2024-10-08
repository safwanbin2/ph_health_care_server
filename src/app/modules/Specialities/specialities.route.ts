import { Router } from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { fileUploader } from "../../utils/fileUploader";
import { SpecialitiesController } from "./specialities.controller";
import { SpecialitiesValidation } from "./specialities.validation";

const router = Router();

router.get("/", SpecialitiesController.getAllSpecialities);

router.post(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  fileUploader.upload.single("file"),
  (req, res, next) => {
    req.body = SpecialitiesValidation.createSpecialityValidationSchema.parse(
      JSON.parse(req?.body?.data)
    );
    return SpecialitiesController.createSpeciality(req, res, next);
  }
);

router.delete(
  "/:specialityId",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  SpecialitiesController.deleteSpeciality
);

export const SpecialitiesRouter = router;
