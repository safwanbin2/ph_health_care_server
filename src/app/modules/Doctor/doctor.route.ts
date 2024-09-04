import { Router } from "express";
import { DoctorController } from "./doctor.controller";
import validateRequest from "../../middlewares/validateRequest";
import { DoctorValidation } from "./doctor.validation";

const router = Router();

router.get("/:doctorId", DoctorController.getSingleDoctor);

router.get("/", DoctorController.getAllDoctor);

router.put(
  "/:doctorId",
  validateRequest(DoctorValidation.updateDoctorValidationSchema),
  DoctorController.updateDoctor
);

export const DoctorRouter = router;
