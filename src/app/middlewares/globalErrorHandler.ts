import { NextFunction, Request, Response } from "express";

const globalErrorHandler = async (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(err?.statusCode || 500).json({
    success: false,
    message: err?.name || "Something went wrong!",
    error: err,
  });
};

export default globalErrorHandler;
