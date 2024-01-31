import express from "express";
import auth from "../../middlewares/auth";
import validationRequest from "../../middlewares/validateRequest";
import { EnrolledCourseValidations } from "./EnrolledCourse.validation";
import { EnrolledCourseControllers } from "./EnrolledCourse.controller";
import { USER_ROLE } from "../user/user.constant";

const router = express.Router();

router.post(
  "/create-enrolled-course",
  auth(USER_ROLE.student),
  validationRequest(
    EnrolledCourseValidations.createEnrolledCourseValidationZodSchema
  ),
  EnrolledCourseControllers.createEnrolledCourse
);

router.post(
  "/update-enrolled-course-marks",
  auth(USER_ROLE.faculty),
  validationRequest(
    EnrolledCourseValidations.updateEnrolledCourseMarksValidationZodSchema
  ),
  EnrolledCourseControllers.updateEnrolledCourse
);

export const EnrolledCourseRoutes = router;
