import { UserRole } from "@prisma/client";
import AppEror from "../../errors/AppError";
import httpStatus from "http-status";

const getMetaData = async (user: any) => {
  switch (user?.role) {
    case UserRole.SUPER_ADMIN:
      getSuperAdminMetaData();
      break;
    case UserRole.ADMIN:
      getAdminMetaData();
      break;
    case UserRole.DOCTOR:
      getDoctorMetaData();
      break;
    case UserRole.PATIENT:
      getPatientMetaData();
      break;
    default:
      throw new AppEror(httpStatus.BAD_REQUEST, "Invalid user role");
  }
};

const getSuperAdminMetaData = async () => {
  return "super man";
};
const getAdminMetaData = async () => {
  return "admin man";
};
const getDoctorMetaData = async () => {
  return "doctor man";
};
const getPatientMetaData = async () => {
  return "patient man";
};

export const MetaService = {
  getMetaData,
};
