import { Prisma, PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcrypt";
import { fileUploader } from "../../utils/fileUploader";
import calculatePagination from "../../utils/calculatePagination";

const prisma = new PrismaClient();

const getAllUser = async (
  params: any,
  options: {
    page: any;
    limit: any;
    sortBy: string;
    sortOrder: "asc" | "desc" | undefined;
  }
) => {
  const { searchTerm, ...filterQuery } = params ?? {};
  const { sortBy, sortOrder, ...paginationOptions } = options;
  const pagination = calculatePagination(paginationOptions);

  const andCondition: Prisma.UserWhereInput[] = [];

  if (searchTerm) {
    andCondition.push({
      OR: ["email"].map((field) => ({
        [field]: {
          contains: searchTerm,
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

  const whereCondition: Prisma.UserWhereInput = { AND: andCondition };

  const result = await prisma.user.findMany({
    where: whereCondition,
    orderBy:
      sortBy && sortOrder ? { [sortBy]: sortOrder } : { createdAt: "desc" },
    skip: pagination?.skip || 0,
    take: pagination?.limit || 10,
  });

  const documentCount = await prisma.user.count({
    where: whereCondition,
  });

  return {
    data: result,
    meta: {
      ...pagination,
      total: documentCount,
    },
  };
};

const createAdmin = async (req: any) => {
  const file = req.file;

  if (file) {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    req.body.admin.profilePhoto = uploadToCloudinary?.secure_url;
  }

  const hashedPassword = await bcrypt.hash(req?.body?.password, 10);
  const userData = {
    email: req?.body?.admin?.email,
    password: hashedPassword,
    role: UserRole.ADMIN,
  };
  const adminData = req?.body?.admin;
  const result = await prisma.$transaction(async (tx) => {
    const createdUserData = await tx.user.create({
      data: userData,
    });
    const createdAdminData = await tx.admin.create({
      data: adminData,
    });
    return createdAdminData;
  });
  return result;
};

const createDoctor = async (req: any) => {
  const file = req?.file;
  console.log(file);
  if (file) {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    req.body.doctor.profilePhoto = uploadToCloudinary?.secure_url;
  }

  const hashedPassword = await bcrypt.hash(req?.body?.password, 12);

  const userData = {
    email: req?.body?.doctor?.email,
    password: hashedPassword,
    role: UserRole.DOCTOR,
  };
  const doctorData = req?.body?.doctor;

  const result = await prisma.$transaction(async (tx) => {
    const createUserData = await tx.user.create({
      data: userData,
    });

    const createDoctorData = await tx.doctor.create({
      data: doctorData,
    });

    return createDoctorData;
  });
  return result;
};

export const UserService = {
  getAllUser,
  createAdmin,
  createDoctor,
};
