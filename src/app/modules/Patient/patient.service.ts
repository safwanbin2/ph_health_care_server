import { Patient, Prisma, UserStatus } from "@prisma/client";
import prisma from "../../utils/prisma";
import calculatePagination from "../../utils/calculatePagination";

const getAllPatients = async (params: any, options: any) => {
  const { searchTerm, ...queryObj } = params ?? {};
  const andCondition: Prisma.PatientWhereInput[] = [];

  if (searchTerm) {
    andCondition.push({
      OR: ["name", "email", "address"].map((field) => ({
        [field]: {
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

  const { page, limit, skip, sortBy, sortOrder } = calculatePagination(options);
  const whereCondition: Prisma.PatientWhereInput = { AND: andCondition };

  const result = await prisma.patient.findMany({
    where: whereCondition,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
    include: {
      patientHealthData: true,
      medicalReport: true,
    },
  });

  const total = await prisma.patient.count({ where: whereCondition });

  return {
    data: result,
    meta: {
      page,
      limit,
      total,
    },
  };
};

const getSinglePatient = async (patientId: string) => {
  const result = await prisma.patient.findUniqueOrThrow({
    where: {
      id: patientId,
    },
    include: {
      patientHealthData: true,
      medicalReport: true,
    },
  });

  return result;
};

const updatePatient = async (patientId: string, payload: Partial<Patient>) => {
  const { patientHealthData, medicalReport, ...payloadData } = payload ?? {};

  const patientInfo = await prisma.patient.findUniqueOrThrow({
    where: { id: patientId },
  });

  const result = await prisma.$transaction(async (tx) => {
    const updateResult = await tx.patient.update({
      where: {
        id: patientId,
      },
      data: payloadData,
    });

    if (Object.keys(patientHealthData).length > 0) {
      const createPatientHealthDataResult = await tx.patientHealthData.upsert({
        where: {
          patientId: patientInfo?.id,
        },
        update: patientHealthData,
        create: { ...patientHealthData, patientId },
      });
    }

    if (Object.keys(medicalReport).length > 0) {
      const createMedicalReportResult = await tx.medicalReport.create({
        data: { ...medicalReport, patientId },
      });
    }

    return updateResult;
  });

  const patient = await prisma.patient.findUniqueOrThrow({
    where: { id: patientId },
    include: {
      patientHealthData: true,
      medicalReport: true,
    },
  });

  return patient;
};

const deletePatient = async (patientId: string) => {
  const result = await prisma.$transaction(async (tx) => {
    const medicalReportResult = await tx.medicalReport.deleteMany({
      where: { patientId },
    });

    const patientHealthDataResult = await tx.patientHealthData.delete({
      where: { patientId },
    });

    const patientResult = await tx.patient.delete({
      where: { id: patientId },
    });

    const userResult = await tx.user.delete({
      where: { email: patientResult?.email },
    });

    return patientResult;
  });

  return result;
};

const softDeletePatient = async (patientId: string) => {
  const result = await prisma.$transaction(async (tx) => {
    const patientResult = await tx.patient.update({
      where: { id: patientId },
      data: { isDeleted: true },
    });

    const userDelete = await tx.user.update({
      where: { email: patientResult?.email },
      data: { status: UserStatus.DELETED },
    });

    return patientResult;
  });

  return result;
};

export const PatientService = {
  getAllPatients,
  getSinglePatient,
  updatePatient,
  deletePatient,
  softDeletePatient,
};
