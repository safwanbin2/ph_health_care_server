import { Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

const globalErrorHandler = async (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let status = err?.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
  let success = false;
  let message = err?.message || "Something went wrong!";
  let error = err;

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      message = "Duplicate key error!";
      error = err.meta;
    }
  } else if (err instanceof Prisma.PrismaClientValidationError) {
    message = "Validation error!";
  }

  res.status(status).json({
    success,
    message,
    error,
  });
};

export default globalErrorHandler;
