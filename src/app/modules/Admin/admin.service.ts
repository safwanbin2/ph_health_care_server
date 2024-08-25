import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getAllAdmin = async (params: any) => {
  const orConditions: Prisma.AdminWhereInput[] = [];

  if (params?.searchTerm) {
    orConditions.push({
      OR: [
        {
          name: {
            contains: params?.searchTerm,
            mode: "insensitive",
          },
        },
        {
          email: {
            contains: params?.searchTerm,
            mode: "insensitive",
          },
        },
      ],
    });
  }

  const whereCondition: Prisma.AdminWhereInput = { AND: orConditions };

  const result = await prisma.admin.findMany({
    where: whereCondition,
  });
  return result;
};

export const AdminService = {
  getAllAdmin,
};
