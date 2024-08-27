import { NextFunction, Request, Response } from "express";
import { AdminService } from "./admin.service";
import pick from "../../shared/pick";
import sendResponse from "../../utils/sendResponse";

const getAllAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filterQuery = pick(req?.query, ["name", "email", "searchTerm"]);
    const options = pick(req?.query, ["sortBy", "sortOrder", "page", "limit"]);

    const result = await AdminService.getAllAdmin(filterQuery, options);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Admins fetched successfully!",
      meta: result?.meta,
      data: result?.result,
    });
  } catch (error) {
    next(error);
  }
};

const getAdminById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req?.params;
    const result = await AdminService.getAdminById(id);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Admins fetched successfully By Id!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateAdminById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req?.params;
    const data = req?.body;

    const result = await AdminService.updateAdminById(id, data);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Admin Updated!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const deleteAdminById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req?.params;
    const result = await AdminService.deleteAdminById(id);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Admin Deleted!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const softDeleteAdminById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req?.params;
    const result = await AdminService.softDeleteAdminById(id);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Admin deleted soft!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const AdminController = {
  getAllAdmin,
  getAdminById,
  updateAdminById,
  deleteAdminById,
  softDeleteAdminById,
};
