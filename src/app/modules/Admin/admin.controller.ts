import { NextFunction, Request, Response } from "express";
import { AdminService } from "./admin.service";
import pick from "../../shared/pick";

const getAllAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filterQuery = pick(req?.query, ["name", "email", "searchTerm"]);
    const options = pick(req?.query, ["sortBy", "sortOrder", "page", "limit"]);

    const result = await AdminService.getAllAdmin(filterQuery, options);

    res.status(200).json({
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

    res.status(200).json({
      success: true,
      message: "Admins fetched successfully By Id!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const AdminController = {
  getAllAdmin,
  getAdminById,
};
