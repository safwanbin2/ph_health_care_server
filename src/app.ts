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

const app: Application = express();

app.use(cors());
// parseers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// routes
app.use("/api/v1/user", UserRouter);
app.use("/api/v1/admin", AdminRouter);
app.use("/api/v1/doctor", DoctorRouter);
app.use("/api/v1/patient", PatientRouter);
app.use("/api/v1/auth", AuthRouter);
app.use("/api/v1/specialities", SpecialitiesRouter);
app.use("/api/v1/schedule", ScheduleRouter);
app.use("/api/v1/doctor-schedule", DoctorScheduleRouter);

// error handler
app.use(globalErrorHandler);
app.use(routeNotFound);

export default app;
