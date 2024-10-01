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

const changeStatus = catchAsync(async (req, res) => {
  const { appointmentId } = req?.params;
  const { status } = req?.body;
  const { user } = req;

  const result = await AppointmentService.changeStatus(
    appointmentId,
    status,
    user
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Appointment status changed successfully!",
    data: result,
  });
});

export const AppointmentController = {
  createAppointment,
  getMyAppointment,
  changeStatus,
};
