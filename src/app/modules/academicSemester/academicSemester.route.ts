import express from "express";
import validationRequest from "../../middlewares/validateRequest";
import { AcademicSemesterControllers } from "./academicSemester.controller";
import { AcademicSemesterValidations } from "./academicSemester.validation";
const router = express.Router();

router.post(
  "/create-academic-semester",
  validationRequest(AcademicSemesterValidations.createAcademicValidationSchema),
  AcademicSemesterControllers.createAcademicSemester
);

router.get(
  "/:semesterId",
  AcademicSemesterControllers.getSingleAcademicSemester
);

router.patch(
  "/:semesterId",
  validationRequest(
    AcademicSemesterValidations.updateAcademicSemesterValidationSchema
  ),
  AcademicSemesterControllers.updateAcademicSemester
);

router.get("/", AcademicSemesterControllers.getAllAcademicSemesters);

export const AcademicSemesterRoute = router;
