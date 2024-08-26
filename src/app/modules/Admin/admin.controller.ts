import { NextFunction, Request, Response } from "express";
import { AdminService } from "./admin.service";

const pickMatchedFilter = (obj, keys) => {
  const finalObj = {};
  for (const element of keys) {
    if (obj && Object.keys(obj).includes(element)) {
      finalObj[element] = obj[element];
    }
  }
  return finalObj;
};

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
