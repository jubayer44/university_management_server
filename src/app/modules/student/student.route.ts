import express from "express";
import { studentControllers } from "./student.controller";
import validationRequest from "../../middlewares/validateRequest";
import { studentValidations } from "./student.validation";
const route = express.Router();

route.get("/", studentControllers.getAllStudents);
route.get("/:studentId", studentControllers.getSingleStudent);
route.patch(
  "/:studentId",
  validationRequest(studentValidations.updateStudentValidationSchema),
  studentControllers.updateStudent
);
route.delete("/:studentId", studentControllers.deleteSingleStudent);
export const StudentRoute = route;
