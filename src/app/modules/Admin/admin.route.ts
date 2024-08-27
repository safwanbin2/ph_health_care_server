import { Router } from "express";
import { AdminController } from "./admin.controller";

const router = Router();

router.get("/", AdminController.getAllAdmin);

router.get("/:id", AdminController.getAdminById);

router.patch("/:id", AdminController.updateAdminById);

router.delete("/:id", AdminController.deleteAdminById);

export const AdminRouter = router;
