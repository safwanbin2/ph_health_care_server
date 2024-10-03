import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { PrescriptionService } from "./prescription.service";
import pick from "../../shared/pick";

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

const getMyPrescriptions = catchAsync(async (req, res) => {
  const options = pick(req?.query, ["limit", "page", "sortBy", "sortOrder"]);
  const { meta, data } = await PrescriptionService.getMyPrescriptions(
    req?.user,
    options
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Prescriptions fetched successfully!",
    meta,
    data,
  });
});

export const PrescriptionController = {
  createPrescription,
  getMyPrescriptions,
};
