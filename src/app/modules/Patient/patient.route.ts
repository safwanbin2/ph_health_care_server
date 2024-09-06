import { Router } from "express";
import { PatientController } from "./patient.controller";

const router = Router();

router.get("/", PatientController.getAllPatients);

router.get("/:patientId", PatientController.getSinglePatient);

router.put("/:patientId", PatientController.updatePatient);

router.delete("/:patientId", PatientController.deletePatient);

router.delete("/soft/:patientId", PatientController.deletePatient);

export const PatientRouter = router;
