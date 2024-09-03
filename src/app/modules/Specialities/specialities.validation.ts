import { z } from "zod";

const createSpecialityValidationSchema = z.object({
  title: z.string({
    required_error: "Title is required",
    invalid_type_error: "Title is not valid",
  }),
});

export const SpecialitiesValidation = {
  createSpecialityValidationSchema,
};
