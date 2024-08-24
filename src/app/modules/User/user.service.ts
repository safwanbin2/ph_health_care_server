import { PrismaClient, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

const createAdmin = async (data: any) => {
  const userData = {
    email: data?.admin?.email,
    password: data?.password,
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
