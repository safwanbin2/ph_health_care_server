import { Doctor, Prisma } from "@prisma/client";
import prisma from "../../utils/prisma";
import calculatePagination from "../../utils/calculatePagination";

const getAllDoctor = async (params: any, options: any) => {
  const { searchTerm, ...queryObj } = params ?? {};

  const andCondition: Prisma.DoctorWhereInput[] = [];

  if (searchTerm) {
    andCondition.push({
      OR: [
        "name",
        "email",
        "address",
        "qualification",
        "designation",
        "currentWorkingPlace",
      ].map((filed: any) => ({
        [filed]: {
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

  const paginationOptions = calculatePagination(options);

  const whereCondition: Prisma.DoctorWhereInput = { AND: andCondition };

  const result = await prisma.doctor.findMany({
    where: whereCondition,
    skip: paginationOptions?.skip,
    take: paginationOptions?.limit,
    orderBy: {
      [paginationOptions.sortBy]: paginationOptions.sortOrder,
    },
  });

  const total = await prisma.doctor.count({
    where: whereCondition,
  });

  return {
    data: result,
    meta: {
      page: paginationOptions?.page,
      limit: paginationOptions?.limit,
      total,
    },
  };
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

    if (specialities && specialities.length > 0) {
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
    }

    return updateResult;
  });

  const doctorResult = await prisma.doctor.findUniqueOrThrow({
    where: {
      id: doctorId,
      isDeleted: false,
    },
    include: {
      doctorSpecialities: {
        include: {
          specialities: true,
        },
      },
    },
  });

  return doctorResult;
};

export const DoctorService = {
  getAllDoctor,
  getSingleDoctor,
  updateDoctor,
  softDeleteDoctorById,
  deleteDoctorById,
};
