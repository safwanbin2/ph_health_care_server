import httpStatus from "http-status";
import AppEror from "../../errors/AppError";
import prisma from "../../utils/prisma";

const createReview = async (user: any, payload: any) => {
  const appointmentData = await prisma.appointment.findUniqueOrThrow({
    where: {
      id: payload?.appointmentId,
    },
    include: {
      patient: true,
    },
  });

  if (appointmentData?.patient?.email !== user?.email) {
    throw new AppEror(
      httpStatus.BAD_REQUEST,
      "You can not review other's appointments"
    );
  }

  const result = await prisma.review.create({
    data: {
      appointmentId: payload?.appointmentId,
      doctorId: appointmentData?.doctorId,
      patientId: appointmentData?.patientId,
      rating: payload?.rating,
      comment: payload?.comment,
    },
  });

  return result;
};

export const ReviewService = {
  createReview,
};
