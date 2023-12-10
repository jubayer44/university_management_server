import express from "express";
import validationRequest from "../../middlewares/validateRequest";
import { AcademicDepartmentControllers } from "./academicDepartment.controller";
import { AcademicDepartmentValidations } from "./academicDepartment.validation";
const router = express.Router();

router.post(
  "/create-academic-department",
  validationRequest(
    AcademicDepartmentValidations.createAcademicDepartmentValidationSchema
  ),
  AcademicDepartmentControllers.createAcademicDepartment
);

router.get(
  "/:departmentId",
  AcademicDepartmentControllers.getSingleAcademicDepartment
);

router.patch(
  "/:departmentId",
  validationRequest(
    AcademicDepartmentValidations.updateAcademicDepartmentValidationSchema
  ),
  AcademicDepartmentControllers.updateAcademicDepartment
);

router.get("/", AcademicDepartmentControllers.getAllAcademicDepartment);

export const AcademicDepartmentRoute = router;
