import { Prisma } from "@prisma/client";
import prisma from "../../utils/prisma";
import calculatePagination from "../../utils/calculatePagination";
import AppEror from "../../errors/AppError";
import httpStatus from "http-status";

const createDoctorSchedule = async (user: any, payload: any) => {
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
  });

  const scheduleData = payload?.scheduleIds.map((id) => ({
    doctorId: doctorData?.id,
    scheduleId: id,
  }));

  const result = await prisma.doctorSchedules.createMany({
    data: scheduleData,
  });

  return result;
};

const getMySchedule = async (filters: any, options: any, user: any) => {
  const { startDate, endDate, ...params } = filters;

  const andCondition: Prisma.DoctorSchedulesWhereInput[] = [];

  if (startDate && endDate) {
    andCondition.push({
      AND: [
        {
          schedule: {
            startDate: {
              gte: startDate,
            },
          },
        },
        {
          schedule: {
            endDate: {
              lte: endDate,
            },
          },
        },
      ],
    });
  }

  if (Object.keys(params).length > 0) {
    if (typeof params?.isBooked === "string" && params?.isBooked === "true") {
      params.isBooked = true;
    } else if (
      typeof params?.isBooked === "string" &&
      params?.isBooked === "false"
    ) {
      params.isBooked = false;
    }
    andCondition.push({
      AND: Object.keys(params).map((key) => ({
        [key]: {
          equals: params[key],
        },
      })),
    });
  }

  const { limit, page, skip, sortBy, sortOrder } = calculatePagination(options);

  const whereCondition: Prisma.DoctorSchedulesWhereInput = {
    AND: andCondition,
  };

  const result = await prisma.doctorSchedules.findMany({
    where: {
      ...whereCondition,
      doctor: {
        email: user?.email,
      },
    },
    take: limit,
    skip,
    orderBy: {
      schedule: {
        startDate: "asc",
      },
    },
  });

  const count = await prisma.doctorSchedules.count({
    where: {
      ...whereCondition,
      doctor: {
        email: user?.email,
      },
    },
  });

  return {
    data: result,
    meta: {
      limit,
      page,
      skip,
      total: count,
    },
  };
};

const deleteDoctorSchedule = async (scheduleId: string, user: any) => {
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
  });

  const isBookedResult = await prisma.doctorSchedules.findUnique({
    where: {
      doctorId_scheduleId: {
        doctorId: doctorData?.id,
        scheduleId,
      },
      isBooked: true,
    },
  });

  if (isBookedResult) {
    throw new AppEror(httpStatus.BAD_REQUEST, "Can't delete booked schedule!");
  }

  const result = await prisma.doctorSchedules.delete({
    where: {
      doctorId_scheduleId: {
        doctorId: doctorData?.id,
        scheduleId,
      },
    },
  });

  return result;
};

export const DoctorScheduleService = {
  createDoctorSchedule,
  getMySchedule,
  deleteDoctorSchedule,
};
