import express, { Application } from "express";
import cors from "cors";
import { UserRouter } from "./app/modules/User/user.route";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import { AdminRouter } from "./app/modules/Admin/admin.route";
import routeNotFound from "./app/middlewares/routeNotFound";
import { AuthRouter } from "./app/modules/Auth/auth.route";
import cookieParser from "cookie-parser";
import { SpecialitiesRouter } from "./app/modules/Specialities/specialities.route";
import { DoctorRouter } from "./app/modules/Doctor/doctor.route";
import { PatientRouter } from "./app/modules/Patient/patient.route";
import { ScheduleRouter } from "./app/modules/Schedule/schedule.route";
import { DoctorScheduleRouter } from "./app/modules/DoctorSchedule/doctorSchedule.route";
import { AppointmentRouter } from "./app/modules/Appointment/appointment.route";
import { PaymentRouter } from "./app/modules/Payment/payment.route";
import { AppointmentService } from "./app/modules/Appointment/appointment.service";
import cron from "node-cron";
import { PrescriptionRouter } from "./app/modules/Prescription/prescription.route";
import { ReviewRouter } from "./app/modules/Review/review.route";

const app: Application = express();

app.use(cors());
// parseers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// seed - cron
cron.schedule("* * * * *", () => {
  try {
    AppointmentService.cancelUnpaidAppointments();
  } catch (error) {
    console.error(error);
  }
});

// routes
app.use("/api/v1/user", UserRouter);
app.use("/api/v1/admin", AdminRouter);
app.use("/api/v1/doctor", DoctorRouter);
app.use("/api/v1/patient", PatientRouter);
app.use("/api/v1/auth", AuthRouter);
app.use("/api/v1/specialities", SpecialitiesRouter);
app.use("/api/v1/schedule", ScheduleRouter);
app.use("/api/v1/doctor-schedule", DoctorScheduleRouter);
app.use("/api/v1/appointment", AppointmentRouter);
app.use("/api/v1/payment", PaymentRouter);
app.use("/api/v1/prescription", PrescriptionRouter);
app.use("/api/v1/review", ReviewRouter);

// error handler
app.use(globalErrorHandler);
app.use(routeNotFound);

export default app;
