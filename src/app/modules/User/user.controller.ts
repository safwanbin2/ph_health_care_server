import { NextFunction, Request, Response } from "express";
import { UserService } from "./user.service";
import catchAsync from "../../utils/catchAsync";

const createAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await UserService.createAdmin(req);
    res.status(200).json({
      success: true,
      message: "Admin created successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const createDoctor = catchAsync(async (req, res) => {
  const result = await UserService.createDoctor(req);

  res.status(200).json({
    success: true,
    message: "Doctor created successfully",
    data: result,
  });
});

export const UserController = {
  createAdmin,
  createDoctor,
};
