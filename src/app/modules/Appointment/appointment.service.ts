import { AppointmentStatus, Prisma, UserRole } from "@prisma/client";
import { TAuthUser } from "../../interfaces/jwt";
import prisma from "../../utils/prisma";
import { v4 as uuidv4 } from "uuid";
import calculatePagination from "../../utils/calculatePagination";
import { JwtPayload } from "jsonwebtoken";
import AppEror from "../../errors/AppError";
import httpStatus from "http-status";

const createAppointment = async (user: any, payload: any) => {
  const patientData = await prisma.patient.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
  });

  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      id: payload?.doctorId,
    },
  });

  const doctorScheduleData = await prisma.doctorSchedules.findUniqueOrThrow({
    where: {
      doctorId_scheduleId: {
        doctorId: doctorData.id,
        scheduleId: payload?.scheduleId,
      },
      isBooked: false,
    },
  });

  const videoCallingId = uuidv4();

  const result = await prisma.$transaction(async (tx) => {
    const appointmentData = await tx.appointment.create({
      data: {
        patientId: patientData?.id,
        doctorId: doctorData?.id,
        scheduleId: payload?.scheduleId,
        videoCallingId,
      },
      include: {
        patient: true,
        doctor: true,
        schedule: true,
      },
    });

    await tx.doctorSchedules.update({
      where: {
        doctorId_scheduleId: {
          doctorId: doctorData?.id,
          scheduleId: payload?.scheduleId,
        },
      },
      data: {
        isBooked: true,
        appointmentId: appointmentData?.id,
      },
    });

    const date = new Date();
    const transactionId = `PH-HealthCare-${date.getFullYear()}:${date.getMonth()}:${date.getDate()}:${date.getHours()}:${date.getMinutes()}`;

    await tx.payment.create({
      data: {
        appointmentId: appointmentData?.id,
        amount: doctorData?.appointmentFee,
        transactionId,
      },
    });

    return appointmentData;
  });

  return result;
};

const getMyAppointment = async (
  filters: any,
  options: any,
  user: TAuthUser
) => {
  const andConditions: Prisma.AppointmentWhereInput[] = [];

  if (user?.role === UserRole.PATIENT) {
    andConditions.push({
      patient: {
        email: user?.email,
      },
    });
  } else if (user?.role === UserRole.DOCTOR) {
    andConditions.push({
      doctor: {
        email: user?.email,
      },
    });
  }

  if (Object.keys(filters).length > 0) {
    andConditions.push({
      AND: Object.keys(filters).map((key) => ({
        [key]: {
          equals: filters[key],
        },
      })),
    });
  }

  const whereCondition: Prisma.AppointmentWhereInput = { AND: andConditions };

  const { limit, page, skip, sortBy, sortOrder } = calculatePagination(options);

  const result = await prisma.appointment.findMany({
    where: whereCondition,
    include: {
      doctor: true,
      patient: {
        include: {
          medicalReport: true,
          patientHealthData: true,
        },
      },
      schedule: true,
    },
    take: limit,
    skip,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const total = await prisma.appointment.count({
    where: whereCondition,
  });

  return {
    data: result,
    meta: {
      page,
      skip,
      total,
      limit,
    },
  };
};

const changeStatus = async (
  appointmentId: string,
  status: AppointmentStatus,
  user: JwtPayload
) => {
  const appointmentData = await prisma.appointment.findUniqueOrThrow({
    where: {
      id: appointmentId,
    },
    include: {
      doctor: true,
    },
  });

  if (user?.role === UserRole.DOCTOR) {
    if (user?.email !== appointmentData?.doctor?.email) {
      throw new AppEror(httpStatus.BAD_REQUEST, "This is not your schedule");
    }
  }

  const result = await prisma.appointment.update({
    where: {
      id: appointmentId,
    },
    data: {
      status,
    },
  });

  return result;
};

export const AppointmentService = {
  createAppointment,
  getMyAppointment,
  changeStatus,
};
