import { Router } from "express";
import { PaymentController } from "./payment.controller";

const router = Router();

router.get("/ipn", PaymentController.validatePayment);

router.post("/init-payment/:appointmentId", PaymentController.initiatePayment);

export const PaymentRouter = router;
