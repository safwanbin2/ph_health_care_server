import { NextFunction, Request, Response } from "express";

const routeNotFound = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(404).json({
    success: false,
    message: "Route not found!",
    error: null,
  });
};

export default routeNotFound;
