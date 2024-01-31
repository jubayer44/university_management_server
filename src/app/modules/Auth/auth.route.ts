import express from "express";
import { AuthValidations } from "./auth.validation";
import { AuthControllers } from "./auth.controller";
import validationRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";

const route = express.Router();

route.post(
  "/login",
  validationRequest(AuthValidations.loginUserValidationSchema),
  AuthControllers.loginUser
);

route.post(
  "/change-password",
  auth(),
  validationRequest(AuthValidations.changeUserValidationSchema),
  AuthControllers.changePassword
);

route.post(
  "/refresh-token",
  validationRequest(AuthValidations.refreshTokenValidationSchema),
  AuthControllers.refreshToken
);

route.post(
  "/forgat-password",
  validationRequest(AuthValidations.forgatPasswordValidationSchema),
  AuthControllers.forgatPassword
);

route.post(
  "/reset-password",
  validationRequest(AuthValidations.resetPasswordValidationSchema),
  AuthControllers.resetPassword
);

export const AuthRoutes = route;
