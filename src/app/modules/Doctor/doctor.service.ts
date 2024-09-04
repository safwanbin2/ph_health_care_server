import { Doctor } from "@prisma/client";
import prisma from "../../utils/prisma";

const getAllDoctor = async () => {
  const result = await prisma.doctor.findMany();

  return result;
};

const getSingleDoctor = async (doctorId: string) => {
  const result = await prisma.doctor.findUniqueOrThrow({
    where: {
      id: doctorId,
      isDeleted: false,
    },
  });

  return result;
};

const softDeleteDoctorById = async (doctorId: string) => {
  const result = await prisma.doctor.update({
    where: {
      id: doctorId,
    },
    data: {
      isDeleted: true,
    },
  });

  return result;
};

const deleteDoctorById = async (doctorId: string) => {
  const result = await prisma.doctor.delete({
    where: {
      id: doctorId,
    },
  });

  return result;
};

const updateDoctor = async (doctorId: string, payload: Partial<Doctor>) => {
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      id: doctorId,
      isDeleted: false,
    },
  });

  const result = await prisma.doctor.update({
    where: {
      id: doctorId,
    },
    data: payload,
  });

  return result;
};

export const DoctorService = {
  getAllDoctor,
  getSingleDoctor,
  updateDoctor,
  softDeleteDoctorById,
  deleteDoctorById,
};
