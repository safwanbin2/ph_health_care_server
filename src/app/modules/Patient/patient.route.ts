import { Router } from "express";
import { PatientController } from "./patient.controller";

const router = Router();

router.get("/", PatientController.getAllPatients);

router.get("/:patientId", PatientController.getSinglePatient);

router.put("/:patientId", PatientController.updatePatient);

export const PatientRouter = router;
