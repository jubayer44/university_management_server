import express from "express";
import validationRequest from "../../middlewares/validateRequest";
import { AcademicSemesterControllers } from "./academicSemester.controller";
import { AcademicSemesterValidations } from "./academicSemester.validation";
import auth from "../../middlewares/auth";
const router = express.Router();

router.post(
  "/create-academic-semester",
  auth("admin", "superAdmin"),
  validationRequest(AcademicSemesterValidations.createAcademicValidationSchema),
  AcademicSemesterControllers.createAcademicSemester
);

router.get(
  "/:semesterId",
  auth("superAdmin", "admin", "faculty", "student"),
  AcademicSemesterControllers.getSingleAcademicSemester
);

router.patch(
  "/:semesterId",
  auth("superAdmin", "admin"),
  validationRequest(
    AcademicSemesterValidations.updateAcademicSemesterValidationSchema
  ),
  AcademicSemesterControllers.updateAcademicSemester
);

router.get(
  "/",
  auth("superAdmin", "admin"),
  AcademicSemesterControllers.getAllAcademicSemesters
);

export const AcademicSemesterRoute = router;
