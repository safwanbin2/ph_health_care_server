import { Router } from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { DoctorScheduleController } from "./doctorSchedule.controller";

const router = Router();

router.post(
  "/",
  auth(UserRole.DOCTOR),
  DoctorScheduleController.createDoctorSchedule
);

router.get(
  "/my-schedules",
  auth(UserRole.DOCTOR),
  DoctorScheduleController.getMySchedule
);

export const DoctorScheduleRouter = router;
