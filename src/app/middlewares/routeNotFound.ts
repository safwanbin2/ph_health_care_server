import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

const routeNotFound = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: "Route not found!",
    error: {
      path: req?.originalUrl,
      message: "Your requested path is not found!",
    },
  });
};

export default routeNotFound;
