import { PaymentStaus, UserRole } from "@prisma/client";
import AppEror from "../../errors/AppError";
import httpStatus from "http-status";
import prisma from "../../utils/prisma";

const getMetaData = async (user: any) => {
  let metaData;
  switch (user?.role) {
    case UserRole.SUPER_ADMIN:
      metaData = getSuperAdminMetaData();
      break;
    case UserRole.ADMIN:
      metaData = getAdminMetaData();
      break;
    case UserRole.DOCTOR:
      metaData = getDoctorMetaData(user);
      break;
    case UserRole.PATIENT:
      metaData = getPatientMetaData(user);
      break;
    default:
      throw new AppEror(httpStatus.BAD_REQUEST, "Invalid user role");
  }

  return metaData;
};

const getSuperAdminMetaData = async () => {
  // admin count
  const adminCount = await prisma.admin.count();
  // doctor count
  const doctorCount = await prisma.doctor.count();
  // patient count
  const patientCount = await prisma.patient.count();
  // appointment count
  const appointmentCount = await prisma.appointment.count();
  // payment count
  const paymentCount = await prisma.payment.count();
  // total Revenue
  const totalRevenueRaw = await prisma.payment.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      status: PaymentStaus.PAID,
    },
  });

  return {
    adminCount,
    doctorCount,
    patientCount,
    appointmentCount,
    paymentCount,
    totalRevenue: totalRevenueRaw._sum.amount,
  };
};

const getAdminMetaData = async () => {
  const doctorCount = await prisma.doctor.count();
  const patientCount = await prisma.patient.count();
  const appointmentCount = await prisma.appointment.count();
  const paymentCount = await prisma.payment.count();
  const totalRevenueRaw = await prisma.payment.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      status: PaymentStaus.PAID,
    },
  });

  return {
    doctorCount,
    patientCount,
    appointmentCount,
    paymentCount,
    totalRevenue: totalRevenueRaw._sum.amount,
  };
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
      status: PaymentStaus.PAID,
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

  return {
    appointmentCount,
    patientCount,
    reviewCount,
    totalRevenue,
    appointmentStatusGrouped,
  };
};

const getPatientMetaData = async (user: any) => {
  // patient data
  const patientData = await prisma.patient.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
  });
  // appointment count
  const appointmentCount = await prisma.appointment.count({
    where: {
      patientId: patientData?.id,
    },
  });
  // prescription count
  const prescriptionCount = await prisma.prescription.count({
    where: {
      patientId: patientData.id,
    },
  });
  // patient spent
  const totalSpentRaw = await prisma.payment.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      appointment: {
        patientId: patientData.id,
      },
    },
  });

  return {
    appointmentCount,
    prescriptionCount,
    totalSpent: totalSpentRaw._sum.amount,
  };
};

export const MetaService = {
  getMetaData,
};
