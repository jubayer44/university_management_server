import express from "express";
import validationRequest from "../../middlewares/validateRequest";
import { SemesterRegistrationValidations } from "./semesterRegistration.validation";
import { SemesterRegistrationControllers } from "./semesterRegistration.controller";

const router = express.Router();

router.post(
  "/create-semester-registration",
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
