import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AppointmentService } from "./appointment.service";

const createAppointment = catchAsync(async (req, res) => {
  const result = await AppointmentService.createAppointment(
    req?.user,
    req?.body
  );
  3;
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Appointment Created Successfully!",
    data: result,
  });
});

export const AppointmentController = {
  createAppointment,
};
