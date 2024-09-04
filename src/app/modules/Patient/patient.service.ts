import prisma from "../../utils/prisma";

const getAllPatients = async () => {
  const result = await prisma.patient.findMany();

  return result;
};

export const PatientService = {
  getAllPatients,
};
