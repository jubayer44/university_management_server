import express from "express";
import validationRequest from "../../middlewares/validateRequest";
import { academicSemesterControllers } from "./academicSemester.controller";
import { academicSemesterValidations } from "./academicSemester.validation";
const router = express.Router();

router.post(
  "/create-academic-semester",
  validationRequest(academicSemesterValidations.createAcademicValidationSchema),
  academicSemesterControllers.createAcademicSemester
);

router.get(
  "/:semesterId",
  academicSemesterControllers.getSingleAcademicSemester
);

router.patch(
  "/:semesterId",
  validationRequest(
    academicSemesterValidations.updateAcademicSemesterValidationSchema
  ),
  academicSemesterControllers.updateAcademicSemester
);

router.get("/", academicSemesterControllers.getAllAcademicSemesters);

export const AcademicSemesterRoute = router;
