import express, { Application } from "express";
import cors from "cors";
import { UserRouter } from "./app/modules/User/user.route";

const app: Application = express();
app.use(cors());
app.use(express.json());

app.use("/api/v1/user", UserRouter);

export default app;
