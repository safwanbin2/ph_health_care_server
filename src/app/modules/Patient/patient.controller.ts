import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { PatientService } from "./patient.service";

const getAllPatients = catchAsync(async (req, res) => {
  const result = await PatientService.getAllPatients();

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Pateints retrieved successfully",
    data: result,
  });
});

export const PatientController = {
  getAllPatients,
};
