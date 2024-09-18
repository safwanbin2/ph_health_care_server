import prisma from "../../utils/prisma";
import { v4 as uuidv4 } from "uuid";

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
    const transactionId = `PH-HealthCare-${date.getFullYear()}:${date.getMonth()}:${date.getDate()}`;

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

export const AppointmentService = {
  createAppointment,
};
