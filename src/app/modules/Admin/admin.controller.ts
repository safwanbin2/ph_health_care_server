import { AdminService } from "./admin.service";
import pick from "../../shared/pick";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";

const getAllAdmin = catchAsync(async (req, res) => {
  const filterQuery = pick(req?.query, ["name", "email", "searchTerm"]);
  const options = pick(req?.query, ["sortBy", "sortOrder", "page", "limit"]);

  const result = await AdminService.getAllAdmin(filterQuery, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admins fetched successfully!",
    meta: result?.meta,
    data: result?.result,
  });
});

const getAdminById = catchAsync(async (req, res) => {
  const { id } = req?.params;
  const result = await AdminService.getAdminById(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admins fetched successfully By Id!",
    data: result,
  });
});

const updateAdminById = catchAsync(async (req, res) => {
  const { id } = req?.params;
  const data = req?.body;

  const result = await AdminService.updateAdminById(id, data);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin Updated!",
    data: result,
  });
});

const deleteAdminById = catchAsync(async (req, res) => {
  const { id } = req?.params;
  const result = await AdminService.deleteAdminById(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin Deleted!",
    data: result,
  });
});

const softDeleteAdminById = catchAsync(async (req, res) => {
  const { id } = req?.params;
  const result = await AdminService.softDeleteAdminById(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin deleted soft!",
    data: result,
  });
});

export const AdminController = {
  getAllAdmin,
  getAdminById,
  updateAdminById,
  deleteAdminById,
  softDeleteAdminById,
};
