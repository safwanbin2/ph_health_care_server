import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcrypt";
import { fileUploader } from "../../utils/fileUploader";

const prisma = new PrismaClient();

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
  createAdmin,
  createDoctor,
};
