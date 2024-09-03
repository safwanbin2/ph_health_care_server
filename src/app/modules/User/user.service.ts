import { Prisma, PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcrypt";
import { fileUploader } from "../../utils/fileUploader";
import calculatePagination from "../../utils/calculatePagination";
import { Request } from "express";

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
    select: {
      id: true,
      email: true,
      role: true,
      needPasswordChange: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      admin: true,
      doctor: true,
    },
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
    const createdUserData = await tx.user.create({
      data: userData,
    });

    const createdDoctorData = await tx.doctor.create({
      data: doctorData,
    });

    return createdDoctorData;
  });
  return result;
};

const createPatient = async (req: any) => {
  const file = req?.file;
  if (file) {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    req.body.patient.profilePhoto = uploadToCloudinary?.secure_url;
  }

  const hashedPassword = await bcrypt.hash(req?.body?.password, 12);

  const userData = {
    email: req?.body?.patient?.email,
    password: hashedPassword,
    role: UserRole.PATIENT,
  };

  const patientData = req?.body?.patient;

  const result = await prisma.$transaction(async (tx) => {
    const createdUserData = await tx.user.create({
      data: userData,
    });

    const createdPatientData = await tx.patient.create({
      data: patientData,
    });

    return createdPatientData;
  });

  return result;
};

const getMyProfile = async (user: any) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
    select: {
      id: true,
      email: true,
      needPasswordChange: true,
      role: true,
      status: true,
    },
  });

  let profileData;
  if (userData?.role === UserRole.SUPER_ADMIN) {
    profileData = await prisma.admin.findUnique({
      where: { email: userData?.email },
    });
  } else if (userData?.role === UserRole.ADMIN) {
    profileData = await prisma.admin.findUnique({
      where: { email: userData?.email },
    });
  } else if (userData?.role === UserRole.DOCTOR) {
    profileData = await prisma.doctor.findUnique({
      where: { email: userData?.email },
    });
  } else if (userData?.role === UserRole.PATIENT) {
    profileData = await prisma.patient.findUnique({
      where: { email: userData?.email },
    });
  }

  return { ...userData, ...profileData };
};

const updateProfile = async (req: Request) => {
  const { user } = req ?? {};
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
  });

  const file = req?.file;
  if (file) {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    req.body.profilePhoto = uploadToCloudinary?.secure_url;
  }

  let updatedResult;
  if (userData?.role === (UserRole.SUPER_ADMIN || UserRole.ADMIN)) {
    updatedResult = await prisma.admin.update({
      where: {
        email: userData?.email,
      },
      data: req?.body,
    });
  } else if (userData?.role === UserRole.DOCTOR) {
    updatedResult = await prisma.doctor.update({
      where: {
        email: userData?.email,
      },
      data: req?.body,
    });
  } else if (userData?.role === UserRole.PATIENT) {
    updatedResult = await prisma.patient.update({
      where: {
        email: userData?.email,
      },
      data: req?.body,
    });
  }

  return updatedResult;
};

export const UserService = {
  getAllUser,
  createAdmin,
  createDoctor,
  createPatient,
  getMyProfile,
  updateProfile,
};
