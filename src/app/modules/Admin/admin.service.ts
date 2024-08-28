import { Admin, Prisma, UserStatus } from "@prisma/client";
import pick from "../../shared/pick";
import calculatePagination from "../../utils/calculatePagination";
import prisma from "../../utils/prisma";
import { IAdminFilterRequest } from "./admin.interface";
import { IPaginationOptions } from "../../interfaces/pagination";

const getAllAdmin = async (
  params: IAdminFilterRequest,
  options: IPaginationOptions
) => {
  const { searchTerm, ...filterQuery } = params ?? {};
  const searchAbleFields = ["name", "email"];

  const andConditions: Prisma.AdminWhereInput[] = [];

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
          equals: (filterQuery as any)[field],
        },
      })),
    });
  }

  andConditions.push({
    isDeleted: false,
  });

  const whereConditions: Prisma.AdminWhereInput = { AND: andConditions };
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

  const total = await prisma.admin.count({
    where: whereConditions,
  });

  return {
    meta: {
      page: Number(options?.page) || 1,
      total,
      limit: Number(options?.limit) || 5,
    },
    result,
  };
};

const getAdminById = async (id: string): Promise<Admin | null> => {
  const result = await prisma.admin.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });

  return result;
};

const updateAdminById = async (
  id: string,
  data: Partial<Admin>
): Promise<Admin> => {
  const result = await prisma.admin.update({
    where: {
      id,
      isDeleted: false,
    },
    data,
  });

  return result;
};

const deleteAdminById = async (id: string) => {
  await prisma.admin.findUniqueOrThrow({
    where: { id },
  });

  const result = await prisma.$transaction(async (tx) => {
    const adminDeletedResult = await tx.admin.delete({
      where: { id },
    });

    const userDeletedResult = await tx.user.delete({
      where: { email: adminDeletedResult?.email },
    });

    return userDeletedResult;
  });

  return result;
};

const softDeleteAdminById = async (id: string) => {
  await prisma.admin.findUniqueOrThrow({
    where: { id, isDeleted: false },
  });

  const result = await prisma.$transaction(async (tx) => {
    const adminSoftDeleteResult = await tx.admin.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
      },
    });

    const userSoftDeleteResult = await tx.user.update({
      where: {
        email: adminSoftDeleteResult?.email,
      },
      data: {
        status: UserStatus.DELETED,
      },
    });

    return adminSoftDeleteResult;
  });

  return result;
};

export const AdminService = {
  getAllAdmin,
  getAdminById,
  updateAdminById,
  deleteAdminById,
  softDeleteAdminById,
};
