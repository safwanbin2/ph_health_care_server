import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getAllAdmin = async (params: any, options: any) => {
  const { limit, page } = options ?? {};

  const { searchTerm, ...filterQuery } = params ?? {};
  const searchAbleFields = ["name", "email"];
  const andCondition: Prisma.AdminWhereInput[] = [];

  if (params?.searchTerm) {
    andCondition.push({
      OR: searchAbleFields.map((field) => ({
        [field]: {
          contains: params?.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterQuery).length > 0) {
    andCondition.push({
      AND: Object.keys(filterQuery).map((field) => ({
        [field]: {
          equals: filterQuery[field],
        },
      })),
    });
  }

  const whereCondition: Prisma.AdminWhereInput = { AND: andCondition };

  const result = await prisma.admin.findMany({
    where: whereCondition,
    skip: (Number(page) - 1) * Number(limit) || 0,
    take: Number(limit) || 10,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: "desc",
          },
  });
  return result;
};

export const AdminService = {
  getAllAdmin,
};
