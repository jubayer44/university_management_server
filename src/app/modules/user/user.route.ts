import express from "express";
import { userControllers } from "./user.controller";
import { studentValidations } from "../student/student.validation";
import validationRequest from "../../middlewares/validateRequest";
const router = express.Router();

router.post(
  "/create-student",
  validationRequest(studentValidations.createStudentValidationSchema),
  userControllers.createStudent
);

export const UserRoute = router;
