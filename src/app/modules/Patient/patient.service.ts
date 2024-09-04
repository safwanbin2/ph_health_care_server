import { Prisma } from "@prisma/client";
import prisma from "../../utils/prisma";
import calculatePagination from "../../utils/calculatePagination";

const getAllPatients = async (params: any, options: any) => {
  const { searchTerm, ...queryObj } = params ?? {};
  const andCondition: Prisma.PatientWhereInput[] = [];

  if (searchTerm) {
    andCondition.push({
      OR: ["name", "email", "address"].map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(queryObj).length > 0) {
    andCondition.push({
      AND: Object.keys(queryObj).map((field) => ({
        [field]: {
          equals: queryObj[field],
        },
      })),
    });
  }

  const { page, limit, skip, sortBy, sortOrder } = calculatePagination(options);
  const whereCondition: Prisma.PatientWhereInput = { AND: andCondition };

  const result = await prisma.patient.findMany({
    where: whereCondition,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const total = await prisma.patient.count({ where: whereCondition });

  return {
    data: result,
    meta: {
      page,
      limit,
      total,
    },
  };
};

export const PatientService = {
  getAllPatients,
};
