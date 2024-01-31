import { z } from "zod";
import { BloodGroup, Gender } from "./faculty.constant";

const createUserNameValidationSchema = z.object({
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

const createFacultyValidationSchema = z.object({
  body: z.object({
    password: z.string().optional(),
    faculty: z.object({
      designation: z.string(),
      name: createUserNameValidationSchema,
      gender: z.enum([...Gender] as [string, ...string[]]),
      dateOfBirth: z.string().optional(),
      email: z.string().email(),
      contactNo: z.string(),
      emergencyContactNo: z.string(),
      bloodGroup: z.enum([...BloodGroup] as [string, ...string[]]),
      presentAddress: z.string(),
      permanentAddress: z.string(),
      academicDepartment: z.string(),
      profileImg: z.string().optional(),
    }),
  }),
});
const updateUserNameValidationSchema = z.object({
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

const updateFacultyValidationSchema = z.object({
  body: z.object({
    faculty: z.object({
      designation: z.string(),
      name: updateUserNameValidationSchema.optional(),
      gender: z.enum([...Gender] as [string, ...string[]]).optional(),
      dateOfBirth: z.string().optional().optional(),
      email: z.string().email().optional(),
      contactNo: z.string().optional(),
      emergencyContactNo: z.string().optional(),
      bloodGroup: z.enum([...BloodGroup] as [string, ...string[]]).optional(),
      presentAddress: z.string().optional(),
      permanentAddress: z.string().optional(),
      academicDepartment: z.string().optional(),
      profileImg: z.string().optional(),
    }),
  }),
});

export const FacultyValidations = {
  createFacultyValidationSchema,
  updateFacultyValidationSchema,
};
