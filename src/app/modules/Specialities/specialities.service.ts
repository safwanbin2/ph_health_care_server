import { Request } from "express";
import { fileUploader } from "../../utils/fileUploader";
import prisma from "../../utils/prisma";

const createSpeciality = async (req: Request) => {
  const file = req?.file;

  if (file) {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    req.body.icon = uploadToCloudinary?.secure_url;
  }

  const result = await prisma.specialities.create({
    data: req.body,
  });

  return result;
};

const getAllSpecialities = async () => {
  const result = await prisma.specialities.findMany();

  return result;
};

const deleteSpeciality = async (specialityId: string) => {
  const result = await prisma.specialities.delete({
    where: {
      id: specialityId,
    },
  });

  return result;
};

export const SpecialitiesService = {
  createSpeciality,
  getAllSpecialities,
  deleteSpeciality,
};
