import { Router } from "express";
import { MetaController } from "./meta.controller";

const router = Router();

router.get("/", MetaController.getMetaData);

export const MetaRouter = router;
