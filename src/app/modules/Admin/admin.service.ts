import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getAllAdmin = async (params: any) => {
  const searchAbleFields = ["name", "email"];
  const orConditions: Prisma.AdminWhereInput[] = [];

  if (params?.searchTerm) {
    orConditions.push({
      OR: searchAbleFields.map((field) => ({
        [field]: {
          contains: params?.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  const andCondition: Prisma.AdminWhereInput = { AND: orConditions };

  const result = await prisma.admin.findMany({
    where: andCondition,
  });
  return result;
};

export const AdminService = {
  getAllAdmin,
};
