import { z } from "zod";

const UserValidationSchema = z.object({
  password: z
    .string({
      invalid_type_error: "Password must be a string",
    })
    .min(6, { message: "Password must be at least 6 characters" })
    .optional(),
});

export default UserValidationSchema;
