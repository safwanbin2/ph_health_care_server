import express, { Application } from "express";
import cors from "cors";
import { UserRouter } from "./app/modules/User/user.route";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import { AdminRouter } from "./app/modules/Admin/admin.route";
import routeNotFound from "./app/middlewares/routeNotFound";

const app: Application = express();

app.use(cors());

// parseers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/api/v1/user", UserRouter);
app.use("/api/v1/admin", AdminRouter);

// error handler
app.use(globalErrorHandler);
app.use(routeNotFound);

export default app;
