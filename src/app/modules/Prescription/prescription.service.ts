import { AppointmentStatus, PaymentStaus } from "@prisma/client";
import prisma from "../../utils/prisma";
import AppEror from "../../errors/AppError";
import httpStatus from "http-status";
import calculatePagination from "../../utils/calculatePagination";

const createPrescription = async (user: any, payload: any) => {
  const appointmentData = await prisma.appointment.findUniqueOrThrow({
    where: {
      id: payload?.appointmentId,
      paymentStatus: PaymentStaus.PAID,
      status: AppointmentStatus.COMPLETED,
    },
    include: {
      doctor: true,
    },
  });

  if (appointmentData?.doctor?.email !== user?.email) {
    throw new AppEror(
      httpStatus.BAD_REQUEST,
      "You can only prescribe your patient"
    );
  }

  const result = await prisma.prescription.create({
    data: {
      appointmentId: payload?.appointmentId,
      doctorId: appointmentData?.doctorId,
      patientId: appointmentData?.patientId,
      instructions: payload?.instructions,
      followUpDate: payload?.followUpDate || null,
    },
  });

  return result;
};

const getMyPrescriptions = async (user: any, options: any) => {
  const { limit, page, skip, sortBy, sortOrder } = calculatePagination(options);
  const result = await prisma.prescription.findMany({
    where: {
      patient: {
        email: user?.email,
      },
    },
    include: {
      appointment: true,
      doctor: true,
      patient: true,
    },
    take: limit,
    skip,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const total = await prisma.prescription.count({
    where: {
      patient: {
        email: user?.email,
      },
    },
  });
  return {
    data: result,
    meta: {
      total,
      page,
      limit,
    },
  };
};

export const PrescriptionService = {
  createPrescription,
  getMyPrescriptions,
};
