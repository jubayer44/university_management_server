import express from "express";
import validationRequest from "../../middlewares/validateRequest";
import { SemesterRegistrationValidations } from "./semesterRegistration.validation";
import { SemesterRegistrationControllers } from "./semesterRegistration.controller";
import { USER_ROLE } from "../user/user.constant";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post(
  "/create-semester-registration",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.faculty),
  validationRequest(
    SemesterRegistrationValidations.createSemesterRegistrationValidationSchema
  ),
  SemesterRegistrationControllers.createSemesterRegistration
);

router.get(
  "/:id",
  SemesterRegistrationControllers.getSingleSemesterRegistration
);

router.patch(
  "/:id",
  validationRequest(
    SemesterRegistrationValidations.updateSemesterRegistrationValidationSchema
  ),
  SemesterRegistrationControllers.updateSemesterRegistration
);

router.get(
  "/:id",
  SemesterRegistrationControllers.getSingleSemesterRegistration
);

router.get("/", SemesterRegistrationControllers.getAllSemesterRegistration);

export const SemesterRegistrationRoute = router;
