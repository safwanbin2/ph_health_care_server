import pick from "../../shared/pick";
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

const getMySchedule = catchAsync(async (req, res) => {
  const filters = pick(req?.query, ["startDate", "endDate", "isBooked"]);
  const options = pick(req?.query, ["page", "limit", "sortOrder", "sortBy"]);

  const result = await DoctorScheduleService.getMySchedule(
    filters,
    options,
    req?.user
  );

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Successfully Fetched!",
    data: result,
  });
});

const deleteDoctorSchedule = catchAsync(async (req, res) => {
  const result = await DoctorScheduleService.deleteDoctorSchedule(
    req?.params?.scheduleId,
    req?.user
  );

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Successfully deleted",
    data: result,
  });
});

export const DoctorScheduleController = {
  createDoctorSchedule,
  getMySchedule,
  deleteDoctorSchedule,
};
