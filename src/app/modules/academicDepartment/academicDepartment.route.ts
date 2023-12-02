import express from "express";
import validationRequest from "../../middlewares/validateRequest";
import { academicDepartmentControllers } from "./academicDepartment.controller";
import { academicDepartmentValidations } from "./academicDepartment.validation";
const router = express.Router();

router.post(
  "/create-academic-department",
  validationRequest(
    academicDepartmentValidations.createAcademicDepartmentValidationSchema
  ),
  academicDepartmentControllers.createAcademicDepartment
);

router.get(
  "/:departmentId",
  academicDepartmentControllers.getSingleAcademicDepartment
);

router.patch(
  "/:departmentId",
  validationRequest(
    academicDepartmentValidations.updateAcademicDepartmentValidationSchema
  ),
  academicDepartmentControllers.updateAcademicDepartment
);

router.get("/", academicDepartmentControllers.getAllAcademicDepartment);

export const AcademicDepartmentRoute = router;
