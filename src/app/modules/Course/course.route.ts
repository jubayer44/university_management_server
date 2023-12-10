import express from "express";
import validationRequest from "../../middlewares/validateRequest";
import { CourseValidations } from "./course.validation";
import { CourseController } from "./course.controller";
const router = express.Router();

router.get("/", CourseController.getAllCourses);

router.get("/:id", CourseController.getSingleCourse);

router.delete("/:id", CourseController.deleteSingleCourse);

router.post(
  "/create-course",
  validationRequest(CourseValidations.createCourseValidationSchema),
  CourseController.createCourse
);

router.patch(
  "/:id",
  validationRequest(CourseValidations.updateCourseValidationSchema),
  CourseController.updateCourse
);

router.put(
  "/:id/assign-faculties",
  validationRequest(CourseValidations.facultiesWithCourseValidationSchema),
  CourseController.assignFacultiesWithCourse
);

router.delete(
  "/:id/remove-faculties",
  validationRequest(CourseValidations.facultiesWithCourseValidationSchema),
  CourseController.removeFacultiesFromCourse
);

export const CourseRoutes = router;
