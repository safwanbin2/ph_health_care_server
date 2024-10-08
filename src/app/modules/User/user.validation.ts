import { z } from "zod";

const createAdminValidationSchema = z.object({
  password: z.string({
    required_error: "Password is required",
  }),
  admin: z.object({
    name: z.string({
      required_error: "Name is required",
    }),
    email: z.string({
      required_error: "Email is required",
    }),
    contactNumber: z.string({
      required_error: "Contact Number is required",
    }),
  }),
});

const createDoctorValidationSchema = z.object({
  password: z.string({
    required_error: "Password is required",
  }),
  doctor: z.object({
    name: z.string({
      required_error: "Name is required",
    }),
    email: z.string({
      required_error: "Email is required",
    }),
    contactNumber: z.string({
      required_error: "Contact Number is required",
    }),
    address: z.string().optional(),
    registrationNumber: z.string({
      required_error: "Reg Number is required",
    }),
    experience: z.number().optional(),
    gender: z.enum(["MALE", "FEMALE"]),
    appointmentFee: z.number({
      required_error: "Appointment fee is required",
    }),
    qualification: z.string({
      required_error: "Qualification is required",
    }),
    currentWorkingPlace: z.string({
      required_error: "Current Working Place is required",
    }),
    designation: z.string({
      required_error: "Designation is required",
    }),
  }),
});

const createPatientValidationSchema = z.object({
  password: z.string(),
  patient: z.object({
    name: z.string({
      required_error: "Name is required",
    }),
    email: z.string({
      required_error: "Email is required",
    }),
    contactNumber: z.string({
      required_error: "Contact Number is required",
    }),
    address: z.string().optional(),
  }),
});

const updateProfileValidationSchema = z.object({
  name: z
    .string({
      required_error: "Name is required",
    })
    .optional(),
  contactNumber: z
    .string({
      required_error: "Contact Number is required",
    })
    .optional(),
  address: z.string().optional(),
  registrationNumber: z
    .string({
      required_error: "Reg Number is required",
    })
    .optional(),
  experience: z.number().optional(),
  gender: z.enum(["MALE", "FEMALE"]).optional(),
  appointmentFee: z
    .number({
      required_error: "Appointment fee is required",
    })
    .optional(),
  qualification: z
    .string({
      required_error: "Qualification is required",
    })
    .optional(),
  currentWorkingPlace: z
    .string({
      required_error: "Current Working Place is required",
    })
    .optional(),
  designation: z
    .string({
      required_error: "Designation is required",
    })
    .optional(),
});

export const UserValidation = {
  createAdminValidationSchema,
  createDoctorValidationSchema,
  createPatientValidationSchema,
  updateProfileValidationSchema,
};
