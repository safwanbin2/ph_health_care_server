import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { PrescriptionService } from "./prescription.service";

const createPrescription = catchAsync(async (req, res) => {
  const result = await PrescriptionService.createPrescription(
    req?.user,
    req?.body
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Prescription created successfully",
    data: result,
  });
});

export const PrescriptionController = {
  createPrescription,
};
