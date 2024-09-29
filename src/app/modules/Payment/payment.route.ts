import { Router } from "express";
import { PaymentController } from "./payment.controller";

const router = Router();

router.post("/init-payment", PaymentController.initiatePayment);

export const PaymentRouter = router;
