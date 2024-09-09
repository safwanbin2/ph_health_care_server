import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { DoctorScheduleService } from "./doctorSchedule.service";

const createDoctorSchedule = catchAsync(async (req, res) => {
  const result = await DoctorScheduleService.createDoctorSchedule(
    req?.user,
    req?.body
  );

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Successfully created",
    data: result,
  });
});

export const DoctorScheduleController = {
  createDoctorSchedule,
};
