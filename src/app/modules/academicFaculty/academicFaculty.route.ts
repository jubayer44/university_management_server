import express from "express";
import validationRequest from "../../middlewares/validateRequest";
import { AcademicFacultyValidations } from "./academicFaculty.validation";
import { AcademicFacultyControllers } from "./academicFaculty.controller";
const router = express.Router();

router.post(
  "/create-academic-faculty",
  validationRequest(
    AcademicFacultyValidations.createAcademicFacultyValidationSchema
  ),
  AcademicFacultyControllers.createAcademicFaculty
);

router.get("/:facultyId", AcademicFacultyControllers.getSingleAcademicFaculty);

router.patch(
  "/:facultyId",
  validationRequest(
    AcademicFacultyValidations.updateAcademicFacultyValidationSchema
  ),
  AcademicFacultyControllers.updateAcademicFaculty
);

router.get("/", AcademicFacultyControllers.getAllAcademicFaculty);

export const AcademicFacultyRoute = router;
