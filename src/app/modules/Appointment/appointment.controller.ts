import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AppointmentService } from "./appointment.service";
import pick from "../../shared/pick";

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

const getMyAppointment = catchAsync(async (req, res) => {
  const filters = pick(req?.query, ["status", "paymentStatus"]);
  const options = pick(req?.query, ["page", "limit", "sortBy", "sortOrder"]);

  const { data, meta } = await AppointmentService.getMyAppointment(
    filters,
    options,
    req?.user
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Appointment retrieved successfully",
    data,
    meta,
  });
});

export const AppointmentController = {
  createAppointment,
  getMyAppointment,
};
