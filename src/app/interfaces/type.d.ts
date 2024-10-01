import { UserRole } from "@prisma/client";
import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        role: UserRole;
        email: string;
      };
    }
  }
}
