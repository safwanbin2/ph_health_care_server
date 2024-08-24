import { Request, Response } from "express";
import { UserService } from "./user.service";

const createAdmin = async (req: Request, res: Response) => {
  const result = await UserService.createAdmin();
  res.send(result);
};

export const UserController = {
  createAdmin,
};
