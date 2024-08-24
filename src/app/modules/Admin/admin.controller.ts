import { NextFunction, Request, Response } from "express";
import { AdminService } from "./admin.service";

const getAllAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await AdminService.getAllAdmin(req?.query);

    res.status(200).json({
      success: true,
      message: "Admins fetched successfully!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const AdminController = {
  getAllAdmin,
};
