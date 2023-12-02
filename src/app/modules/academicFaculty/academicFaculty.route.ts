import express from "express";
import validationRequest from "../../middlewares/validateRequest";
import { academicFacultyValidations } from "./academicFaculty.validation";
import { academicFacultyControllers } from "./academicFaculty.controller";
const router = express.Router();

router.post(
  "/create-academic-faculty",
  validationRequest(
    academicFacultyValidations.createAcademicFacultyValidationSchema
  ),
  academicFacultyControllers.createAcademicFaculty
);

router.get("/:facultyId", academicFacultyControllers.getSingleAcademicFaculty);

router.patch(
  "/:facultyId",
  validationRequest(
    academicFacultyValidations.updateAcademicFacultyValidationSchema
  ),
  academicFacultyControllers.updateAcademicFaculty
);

router.get("/", academicFacultyControllers.getAllAcademicFaculty);

export const AcademicFacultyRoute = router;
