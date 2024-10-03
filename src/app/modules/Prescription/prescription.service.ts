import { AppointmentStatus, PaymentStaus } from "@prisma/client";
import prisma from "../../utils/prisma";
import AppEror from "../../errors/AppError";
import httpStatus from "http-status";

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

export const PrescriptionService = {
  createPrescription,
};
