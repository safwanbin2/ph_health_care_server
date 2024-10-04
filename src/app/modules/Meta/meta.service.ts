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
  console.log("super man");
};
const getAdminMetaData = async () => {
  console.log("admin man");
};
const getDoctorMetaData = async () => {
  console.log("doctor man");
};
const getPatientMetaData = async () => {
  console.log("patient man");
};

export const MetaService = {
  getMetaData,
};
