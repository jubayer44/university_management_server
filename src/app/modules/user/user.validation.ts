import { z } from "zod";
import { UserStatus } from "./user.constant";

const UserValidationSchema = z.object({
  password: z
    .string({
      invalid_type_error: "Password must be a string",
    })
    .min(6, { message: "Password must be at least 6 characters" })
    .optional(),
});

export const ChangeStatusValidationSchema = z.object({
  body: z.object({
    status: z.enum([...UserStatus] as [string, ...string[]]),
  }),
});

export default UserValidationSchema;
