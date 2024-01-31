import express from "express";
import validationRequest from "../../middlewares/validateRequest";
import { CourseValidations } from "./course.validation";
import { CourseController } from "./course.controller";
import auth from "../../middlewares/auth";
const router = express.Router();

router.get(
  "/",
  auth("admin", "faculty", "student"),
  CourseController.getAllCourses
);

router.get(
  "/:id",
  auth("admin", "faculty", "student"),
  CourseController.getSingleCourse
);

router.delete("/:id", auth("admin"), CourseController.deleteSingleCourse);

router.post(
  "/create-course",
  auth("superAdmin", "admin"),
  validationRequest(CourseValidations.createCourseValidationSchema),
  CourseController.createCourse
);

router.patch(
  "/:id",
  auth("superAdmin", "admin"),
  validationRequest(CourseValidations.updateCourseValidationSchema),
  CourseController.updateCourse
);

router.put(
  "/:id/assign-faculties",
  auth("superAdmin", "admin"),
  validationRequest(CourseValidations.facultiesWithCourseValidationSchema),
  CourseController.assignFacultiesWithCourse
);

router.delete(
  "/:id/remove-faculties",
  auth("superAdmin", "admin"),
  validationRequest(CourseValidations.facultiesWithCourseValidationSchema),
  CourseController.removeFacultiesFromCourse
);

export const CourseRoutes = router;
