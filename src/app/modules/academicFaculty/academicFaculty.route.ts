import express from "express";
import validationRequest from "../../middlewares/validateRequest";
import { AcademicFacultyValidations } from "./academicFaculty.validation";
import { AcademicFacultyControllers } from "./academicFaculty.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";
const router = express.Router();

router.post(
  "/create-academic-faculty",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validationRequest(
    AcademicFacultyValidations.createAcademicFacultyValidationSchema
  ),
  AcademicFacultyControllers.createAcademicFaculty
);

router.get(
  "/:facultyId",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  AcademicFacultyControllers.getSingleAcademicFaculty
);

router.patch(
  "/:facultyId",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validationRequest(
    AcademicFacultyValidations.updateAcademicFacultyValidationSchema
  ),
  AcademicFacultyControllers.updateAcademicFaculty
);

router.get(
  "/",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  AcademicFacultyControllers.getAllAcademicFaculty
);

export const AcademicFacultyRoute = router;
