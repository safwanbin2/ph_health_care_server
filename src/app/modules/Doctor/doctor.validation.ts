import { profile } from "console";
import { z } from "zod";

const updateDoctorValidationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    contactNumber: z.string().optional(),
    address: z.string().optional(),
    registrationNumber: z.string().optional(),
    experience: z.number().optional(),
    gender: z.enum(["MALE", "FEMALE"]).optional(),
    appointmentFee: z.number().optional(),
    qualification: z.string().optional(),
    currentWorkingPlace: z.string().optional(),
    designation: z.string().optional(),
  }),
});

export const DoctorValidation = {
  updateDoctorValidationSchema,
};
