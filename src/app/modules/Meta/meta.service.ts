import { UserRole } from "@prisma/client";
import AppEror from "../../errors/AppError";
import httpStatus from "http-status";
import prisma from "../../utils/prisma";

const getMetaData = async (user: any) => {
  switch (user?.role) {
    case UserRole.SUPER_ADMIN:
      getSuperAdminMetaData();
      break;
    case UserRole.ADMIN:
      getAdminMetaData();
      break;
    case UserRole.DOCTOR:
      getDoctorMetaData(user);
      break;
    case UserRole.PATIENT:
      getPatientMetaData();
      break;
    default:
      throw new AppEror(httpStatus.BAD_REQUEST, "Invalid user role");
  }
};

const getSuperAdminMetaData = async () => {
  console.log("super man");
};

const getAdminMetaData = async () => {
  const doctorCount = await prisma.doctor.count();
  const patientCount = await prisma.patient.count();
  const appointmentCount = await prisma.appointment.count();
  const paymentCount = await prisma.payment.count();
  const totalRevenue = await prisma.payment.aggregate({
    _sum: {
      amount: true,
    },
  });

  console.log({
    doctorCount,
    patientCount,
    appointmentCount,
    paymentCount,
    totalRevenue,
  });
};

const getDoctorMetaData = async (user: any) => {
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
  });

  const appointmentCount = await prisma.appointment.count({
    where: {
      doctorId: doctorData?.id,
    },
  });

  const patientCount = await prisma.appointment.groupBy({
    by: ["patientId"],
    _count: {
      id: true,
    },
  });

  const reviewCount = await prisma.review.count({
    where: {
      doctorId: doctorData?.id,
    },
  });

  const totalRevenue = await prisma.payment.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      appointment: {
        doctorId: doctorData?.id,
      },
    },
  });

  const appointmentStatusGroupedRaw = await prisma.appointment.groupBy({
    by: ["status"],
    _count: {
      id: true,
    },
    where: {
      doctorId: doctorData?.id,
    },
  });

  const appointmentStatusGrouped = appointmentStatusGroupedRaw.map((item) => ({
    status: item?.status,
    count: item?._count?.id,
  }));

  console.dir(
    {
      appointmentCount,
      patientCount,
      reviewCount,
      totalRevenue,
      appointmentStatusGrouped,
    },
    { depth: Infinity }
  );
};

const getPatientMetaData = async () => {
  console.log("patient man");
};

export const MetaService = {
  getMetaData,
};
