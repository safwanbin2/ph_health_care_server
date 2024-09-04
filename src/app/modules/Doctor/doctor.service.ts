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

const updateDoctor = async (
  doctorId: string,
  payload: Partial<Doctor> & { specialities: string[] }
) => {
  const { specialities, ...doctorData } = payload ?? {};

  const doctorInfo = await prisma.doctor.findUniqueOrThrow({
    where: {
      id: doctorId,
      isDeleted: false,
    },
    include: {
      doctorSpecialities: true,
    },
  });

  const result = await prisma.$transaction(async (tx) => {
    const updateResult = await tx.doctor.update({
      where: {
        id: doctorId,
      },
      data: doctorData,
    });

    for (const specialitiy of specialities) {
      await tx.doctorSpecialities.create({
        data: {
          doctorId: doctorInfo?.id,
          specialityId: specialitiy,
        },
      });
    }

    return updateResult;
  });

  return doctorInfo;
};

export const DoctorService = {
  getAllDoctor,
  getSingleDoctor,
  updateDoctor,
  softDeleteDoctorById,
  deleteDoctorById,
};
