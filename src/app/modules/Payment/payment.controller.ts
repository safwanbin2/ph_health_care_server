import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { PaymentService } from "./payment.service";

const initiatePayment = catchAsync(async (req, res) => {
  const { appointmentId } = req?.params;

  const result = await PaymentService.initiatePayment(appointmentId);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Payment initiated successfully",
    data: result,
  });
});

const validatePayment = catchAsync(async (req, res) => {
  const result = await PaymentService.validatePayment(req?.query);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Payment validated successfully!",
    data: result,
  });
});

export const PaymentController = {
  initiatePayment,
  validatePayment,
};
