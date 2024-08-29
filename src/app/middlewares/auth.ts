import { NextFunction, Request, RequestHandler, Response } from "express";
import verifyToken from "../utils/verifyToken";
import config from "../config";

const auth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req?.headers?.authorization;
      if (!token) throw new Error("No token!");

      const decoded = verifyToken(token, config.jwt.accessSecret as string);

      if (roles?.length && !roles.includes(decoded?.role))
        throw new Error("You are not authorized!");

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default auth;
