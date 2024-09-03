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

export const SpecialitiesController = {
  createSpeciality,
};
