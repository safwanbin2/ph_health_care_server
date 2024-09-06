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

export const ScheduleController = {
  createSchedule,
};
