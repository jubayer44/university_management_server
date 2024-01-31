import express from "express";
import auth from "../../middlewares/auth";
import validationRequest from "../../middlewares/validateRequest";
import { EnrolledCourseValidations } from "./EnrolledCourse.validation";
import { EnrolledCourseControllers } from "./EnrolledCourse.controller";

const router = express.Router();

router.post(
  "/create-enrolled-course",
  auth("student"),
  validationRequest(
    EnrolledCourseValidations.createEnrolledCourseValidationZodSchema
  ),
  EnrolledCourseControllers.createEnrolledCourse
);

router.post(
  "/update-enrolled-course-marks",
  auth("faculty"),
  validationRequest(
    EnrolledCourseValidations.updateEnrolledCourseMarksValidationZodSchema
  ),
  EnrolledCourseControllers.updateEnrolledCourse
);

export const EnrolledCourseRoutes = router;
