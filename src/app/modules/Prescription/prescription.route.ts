import { Router } from "express";
import { PrescriptionController } from "./prescription.controller";

const router = Router();

router.post("/", PrescriptionController.createPrescription);

export const PrescriptionRouter = router;
