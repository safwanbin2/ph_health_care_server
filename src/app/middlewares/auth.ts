import { NextFunction, Request, Response } from "express";
import verifyToken from "../utils/verifyToken";
import config from "../config";
import { JwtPayload } from "jsonwebtoken";
import AppEror from "../errors/AppError";
import httpStatus from "http-status";

const auth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req?.headers?.authorization;
      if (!token) throw new AppEror(httpStatus.UNAUTHORIZED, "No token!");

      const decoded = verifyToken(
        token,
        config.jwt.accessSecret as string
      ) as JwtPayload;

      if (roles?.length && !roles.includes(decoded?.role))
        throw new AppEror(httpStatus.FORBIDDEN, "You are not authorized!");

      req.user = decoded;
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default auth;
