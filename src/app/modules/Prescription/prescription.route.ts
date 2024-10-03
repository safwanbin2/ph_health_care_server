import { Router } from "express";
import { PrescriptionController } from "./prescription.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = Router();

router.get(
  "/my-prescriptions",
  auth(UserRole.PATIENT),
  PrescriptionController.getMyPrescriptions
);

router.post(
  "/",
  auth(UserRole.DOCTOR),
  PrescriptionController.createPrescription
);

export const PrescriptionRouter = router;
