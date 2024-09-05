import { Patient, Prisma } from "@prisma/client";
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

export const PatientService = {
  getAllPatients,
  getSinglePatient,
  updatePatient,
};
