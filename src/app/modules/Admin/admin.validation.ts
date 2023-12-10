import { z } from "zod";
import { BloodGroup, Gender } from "./admin.constant";

const createAdminNameValidationSchema = z.object({
  firstName: z
    .string()
    .max(10, { message: "First Name can't be more than 10 characters" })
    .refine((value) => /^[A-Z][a-z]*$/.test(value), {
      message:
        "First name must start with a capital letter and only contain letters",
    }),
  middleName: z.string().optional(),
  lastName: z.string().refine((value) => /^[A-Za-z]+$/.test(value), {
    message: "Last name must only contain letters",
  }),
});

const createAdminValidationSchema = z.object({
  body: z.object({
    password: z.string().optional(),
    admin: z.object({
      designation: z.string(),
      name: createAdminNameValidationSchema,
      gender: z.enum([...Gender] as [string, ...string[]]),
      dateOfBirth: z.string().optional(),
      email: z.string().email(),
      contactNo: z.string(),
      emergencyContactNo: z.string(),
      bloodGroup: z.enum([...BloodGroup] as [string, ...string[]]),
      presentAddress: z.string(),
      permanentAddress: z.string(),
      profileImg: z.string(),
    }),
  }),
});
const updateAdminNameValidationSchema = z.object({
  firstName: z
    .string()
    .max(10, { message: "First Name can't be more than 10 characters" })
    .refine((value) => /^[A-Z][a-z]*$/.test(value), {
      message:
        "First name must start with a capital letter and only contain letters",
    })
    .optional(),
  middleName: z.string().optional(),
  lastName: z
    .string()
    .refine((value) => /^[A-Za-z]+$/.test(value), {
      message: "Last name must only contain letters",
    })
    .optional(),
});

const updateAdminValidationSchema = z.object({
  body: z.object({
    faculty: z.object({
      designation: z.string(),
      name: updateAdminNameValidationSchema.optional(),
      gender: z.enum([...Gender] as [string, ...string[]]).optional(),
      dateOfBirth: z.string().optional().optional(),
      email: z.string().email().optional(),
      contactNo: z.string().optional(),
      emergencyContactNo: z.string().optional(),
      bloodGroup: z.enum([...BloodGroup] as [string, ...string[]]).optional(),
      presentAddress: z.string().optional(),
      permanentAddress: z.string().optional(),
      profileImg: z.string().optional(),
    }),
  }),
});

export const AdminValidations = {
  createAdminValidationSchema,
  updateAdminValidationSchema,
};
