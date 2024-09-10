import pick from "../../shared/pick";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ScheduleService } from "./schedule.service";

const createSchedule = catchAsync(async (req, res) => {
  const result = await ScheduleService.createSchedule(req?.body);

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Schedule created successfully",
    data: result,
  });
});

const getAllSchedules = catchAsync(async (req, res) => {
  const filters = pick(req?.query, ["startDate", "endDate", "isBooked"]);
  const options = pick(req?.query, ["page", "limit", "sortBy", "sortOrder"]);

  const result = await ScheduleService.getAllSchedules(filters, options);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Schedules fetched successfully",
    data: result,
  });
});

export const ScheduleController = {
  createSchedule,
  getAllSchedules,
};
