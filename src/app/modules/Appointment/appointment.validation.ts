import { z } from "zod";

const createAppointmentValidationSchema = z.object({
  body: z.object({
    doctorId: z.string({
      required_error: "Doctor Id is required",
      invalid_type_error: "Invdalid doctor id",
    }),
    scheduleId: z.string({
      required_error: "Schedule Id is required",
      invalid_type_error: "Invdalid schedule id",
    }),
  }),
});

export const AppointmentValidation = {
  createAppointmentValidationSchema,
};
