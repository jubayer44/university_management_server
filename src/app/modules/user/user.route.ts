import express from "express";
import { UserControllers } from "./user.controller";
import { StudentValidations } from "../student/student.validation";
import validationRequest from "../../middlewares/validateRequest";
import { FacultyValidations } from "../Faculty/faculty.validation";
import { AdminValidations } from "../Admin/admin.validation";
const router = express.Router();

router.post(
  "/create-student",
  validationRequest(StudentValidations.createStudentValidationSchema),
  UserControllers.createStudent
);

router.post(
  "/create-faculty",
  validationRequest(FacultyValidations.createFacultyValidationSchema),
  UserControllers.createFaculty
);

router.post(
  "/create-admin",
  validationRequest(AdminValidations.createAdminValidationSchema),
  UserControllers.createAdmin
);

export const UserRoute = router;
