import { z } from "zod";

const loginUserValidationSchema = z.object({
  body: z.object({
    id: z.string({
      required_error: "Id is required",
      invalid_type_error: "Id must be a string",
    }),
    password: z.string({
      required_error: "Password is required",
      invalid_type_error: "Password must be a string",
    }),
  }),
});

const changeUserValidationSchema = z.object({
  body: z.object({
    oldPassword: z.string({
      required_error: "old password is required",
      invalid_type_error: "old password must be a string",
    }),
    newPassword: z.string({
      required_error: "new Password is required",
      invalid_type_error: "new Password must be a string",
    }),
  }),
});

const refreshTokenValidationSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: "refresh token is required",
      invalid_type_error: "refresh token must be a string",
    }),
  }),
});

const forgatPasswordValidationSchema = z.object({
  body: z.object({
    id: z.string({
      required_error: "Id is required",
      invalid_type_error: "Id must be a string",
    }),
  }),
});

const resetPasswordValidationSchema = z.object({
  body: z.object({
    id: z.string({
      required_error: "Id is required",
      invalid_type_error: "Id must be a string",
    }),
    newPassword: z.string({
      required_error: "password is required",
      invalid_type_error: "password must be a string",
    }),
  }),
});

export const AuthValidations = {
  loginUserValidationSchema,
  changeUserValidationSchema,
  refreshTokenValidationSchema,
  forgatPasswordValidationSchema,
  resetPasswordValidationSchema,
};
