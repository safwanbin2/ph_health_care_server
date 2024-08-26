import { NextFunction, Request, Response } from "express";
import { AdminService } from "./admin.service";
import pickMatchedFilter from "../../shared/pickMatchedFilter";

const getAllAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filter = pickMatchedFilter(req?.query, [
      "email",
      "searchTerm",
      "contactNumber",
    ]);

    const result = await AdminService.getAllAdmin(filter);

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
