import pick from "../../shared/pick";
import calculatePagination from "../../utils/calculatePagination";
import prisma from "../../utils/prisma";

const getAllAdmin = async (
  params: Record<string, unknown>,
  options: Record<string, unknown>
) => {
  const { searchTerm, ...filterQuery } = params ?? {};
  const searchAbleFields = ["name", "email"];

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: searchAbleFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterQuery).length > 0) {
    andConditions.push({
      AND: Object.keys(filterQuery).map((field) => ({
        [field]: {
          equals: filterQuery[field],
        },
      })),
    });
  }

  const whereConditions = { AND: andConditions };
  // console.dir(whereConditions, { depth: Infinity });
  const result = await prisma.admin.findMany({
    where: whereConditions,
    orderBy:
      options?.sortBy && options?.sortOrder
        ? {
            [options?.sortBy]: options?.sortOrder,
          }
        : {
            createdAt: "desc",
          },
    skip: (Number(options?.page) - 1) * Number(options?.limit) || 0,
    take: Number(options?.limit) || 5,
  });
  return result;
};

export const AdminService = {
  getAllAdmin,
};
