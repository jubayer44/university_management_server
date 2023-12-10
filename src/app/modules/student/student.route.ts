import express from "express";
import { StudentControllers } from "./student.controller";
import validationRequest from "../../middlewares/validateRequest";
import { StudentValidations } from "./student.validation";
const route = express.Router();

route.get("/", StudentControllers.getAllStudents);
route.get("/:studentId", StudentControllers.getSingleStudent);
route.patch(
  "/:studentId",
  validationRequest(StudentValidations.updateStudentValidationSchema),
  StudentControllers.updateStudent
);
route.delete("/:studentId", StudentControllers.deleteSingleStudent);
export const StudentRoute = route;
