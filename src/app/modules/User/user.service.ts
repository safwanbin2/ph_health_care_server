import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const createAdmin = async (data: any) => {
  const hashedPassword = await bcrypt.hash(data?.password, 10);
  const userData = {
    email: data?.admin?.email,
    password: hashedPassword,
    role: UserRole.ADMIN,
  };
  const adminData = data?.admin;

  const result = await prisma.$transaction(async (tx) => {
    const createdUserData = await tx.user.create({
      data: userData,
    });

    const createdAdminData = await tx.admin.create({
      data: adminData,
    });

    return { createdUserData, createdAdminData };
  });

  return result;
};

export const UserService = {
  createAdmin,
};
