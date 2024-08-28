import { Router } from "express";
import { AdminController } from "./admin.controller";
import validateRequest from "../../utils/validateRequest";
import { AdminValidation } from "./admin.validation";

const router = Router();

router.get("/", AdminController.getAllAdmin);

router.get("/:id", AdminController.getAdminById);

router.patch(
  "/:id",
  validateRequest(AdminValidation.updateAdminValidationSchema),
  AdminController.updateAdminById
);

router.delete("/:id", AdminController.deleteAdminById);

router.delete("/soft/:id", AdminController.softDeleteAdminById);

export const AdminRouter = router;
