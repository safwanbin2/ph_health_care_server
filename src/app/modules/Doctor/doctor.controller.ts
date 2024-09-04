import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { DoctorService } from "./doctor.service";

const getAllDoctor = catchAsync(async (req, res) => {
  const result = await DoctorService.getAllDoctor();

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Doctors retrieved successfully",
    data: result,
  });
});

const getSingleDoctor = catchAsync(async (req, res) => {
  const result = await DoctorService.getSingleDoctor(req?.params?.doctorId);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Doctor retrieved successfully",
    data: result,
  });
});

const softDeleteDoctorById = catchAsync(async (req, res) => {
  const result = await DoctorService.softDeleteDoctorById(
    req?.params?.doctorId
  );

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Doctor soft deleted successfully",
    data: result,
  });
});

const deleteDoctorById = catchAsync(async (req, res) => {
  const result = await DoctorService.deleteDoctorById(req?.params?.doctorId);

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Doctor deleted successfully",
    data: result,
  });
});

const updateDoctor = catchAsync(async (req, res) => {
  const result = await DoctorService.updateDoctor(
    req?.params?.doctorId,
    req?.body
  );

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Doctor updated successfully",
    data: result,
  });
});

export const DoctorController = {
  getAllDoctor,
  getSingleDoctor,
  updateDoctor,
  softDeleteDoctorById,
  deleteDoctorById,
};
