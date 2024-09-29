import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { PaymentService } from "./payment.service";

const initiatePayment = catchAsync(async (req, res) => {
  const result = await PaymentService.initiatePayment();

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Payment initiated successfully",
    data: result,
  });
});

export const PaymentController = {
  initiatePayment,
};
