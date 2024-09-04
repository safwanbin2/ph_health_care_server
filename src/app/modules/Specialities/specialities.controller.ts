import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { SpecialitiesService } from "./specialities.service";

const createSpeciality = catchAsync(async (req, res) => {
  const result = await SpecialitiesService.createSpeciality(req);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Speciality created Successfully",
    data: result,
  });
});

const getAllSpecialities = catchAsync(async (req, res) => {
  const result = await SpecialitiesService.getAllSpecialities();

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Specialities retrieved successfully",
    data: result,
  });
});

const deleteSpeciality = catchAsync(async (req, res) => {
  const result = await SpecialitiesService.deleteSpeciality(
    req?.params?.specialityId
  );

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Speciality deleted successfully",
    data: result,
  });
});

export const SpecialitiesController = {
  createSpeciality,
  getAllSpecialities,
  deleteSpeciality,
};
