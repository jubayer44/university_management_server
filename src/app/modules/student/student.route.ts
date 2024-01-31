import express from "express";
import { StudentControllers } from "./student.controller";
import validationRequest from "../../middlewares/validateRequest";
import { StudentValidations } from "./student.validation";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";
const route = express.Router();

route.get(
  "/",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.faculty),
  StudentControllers.getAllStudents
);
route.get(
  "/:studentId",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.faculty),
  StudentControllers.getSingleStudent
);
route.patch(
  "/:studentId",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.faculty),
  validationRequest(StudentValidations.updateStudentValidationSchema),
  StudentControllers.updateStudent
);
route.delete(
  "/:studentId",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  StudentControllers.deleteSingleStudent
);
export const StudentRoute = route;
