import pick from "../../shared/pick";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { PatientService } from "./patient.service";

const getAllPatients = catchAsync(async (req, res) => {
  const queryObj = pick(req?.query, ["searchTerm", "name", "email", "address"]);
  const optionObj = pick(req?.query, ["page", "limit", "sortBy", "sortOrder"]);

  const result = await PatientService.getAllPatients(queryObj, optionObj);

  const { meta, data } = result ?? {};

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Pateints retrieved successfully",
    data,
    meta,
  });
});

const getSinglePatient = catchAsync(async (req, res) => {
  const result = await PatientService.getSinglePatient(req?.params?.patientId);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Pateint retrieved successfully",
    data: result,
  });
});

const updatePatient = catchAsync(async (req, res) => {
  const result = await PatientService.updatePatient(
    req?.params?.patientId,
    req?.body
  );

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Patient updated successfully",
    data: result,
  });
});

export const PatientController = {
  getAllPatients,
  getSinglePatient,
  updatePatient,
};
