import { NextFunction, Request, Response } from "express";
import { UserService } from "./user.service";

const createAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await UserService.createAdmin(req?.body);
    res.status(200).json({
      success: true,
      message: "Admin created successfully",
      data: result,
    });
  } catch (error) {
    next(error);
    // res.status(500).json({
    //   success: false,
    //   message: error?.name || "Something went wrong!",
    //   error,
    // });
  }
};

export const UserController = {
  createAdmin,
};
