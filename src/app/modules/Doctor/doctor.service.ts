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
  payload: Partial<Doctor> & { specialities: any[] }
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
      if (specialitiy?.isDeleted) {
        await tx.doctorSpecialities.deleteMany({
          where: {
            doctorId: doctorInfo?.id,
            specialityId: specialitiy.id,
          },
        });
      } else {
        await tx.doctorSpecialities.create({
          data: {
            doctorId: doctorInfo?.id,
            specialityId: specialitiy.id,
          },
        });
      }
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
