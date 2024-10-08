import { NextFunction, Request, Response } from "express";
import { UserService } from "./user.service";
import catchAsync from "../../utils/catchAsync";
import pick from "../../shared/pick";
import sendResponse from "../../utils/sendResponse";

const getAllUser = catchAsync(async (req, res) => {
  const filterQuery = pick(req?.query, [
    "searchTerm",
    "email",
    "status",
    "role",
  ]);
  const options = pick(req?.query, ["page", "limit", "sortBy", "sortOrder"]);

  const result = await UserService.getAllUser(filterQuery, options);

  res.status(200).json({
    success: true,
    message: "Users found successfully!",
    meta: result?.meta,
    data: result?.data,
  });
});

const createAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await UserService.createAdmin(req);
    res.status(200).json({
      success: true,
      message: "Admin created successfully!",
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
    message: "Doctor created successfully!",
    data: result,
  });
});

const createPatient = catchAsync(async (req, res) => {
  const result = await UserService.createPatient(req);

  res.status(200).json({
    success: true,
    message: "Patient created successfully!",
    data: result,
  });
});

const getMyProfile = catchAsync(async (req, res) => {
  const result = await UserService.getMyProfile(req?.user);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Profile fetched successfully",
    data: result,
  });
});

const updateProfile = catchAsync(async (req, res) => {
  const result = await UserService.updateProfile(req);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Profile updated successfully",
    data: result,
  });
});

export const UserController = {
  createAdmin,
  createDoctor,
  getAllUser,
  createPatient,
  getMyProfile,
  updateProfile,
};
