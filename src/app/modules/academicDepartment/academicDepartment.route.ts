import express from "express";
import validationRequest from "../../middlewares/validateRequest";
import { AcademicDepartmentControllers } from "./academicDepartment.controller";
import { AcademicDepartmentValidations } from "./academicDepartment.validation";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";
const router = express.Router();

router.post(
  "/create-academic-department",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validationRequest(
    AcademicDepartmentValidations.createAcademicDepartmentValidationSchema
  ),
  AcademicDepartmentControllers.createAcademicDepartment
);

router.get(
  "/:departmentId",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  AcademicDepartmentControllers.getSingleAcademicDepartment
);

router.patch(
  "/:departmentId",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validationRequest(
    AcademicDepartmentValidations.updateAcademicDepartmentValidationSchema
  ),
  AcademicDepartmentControllers.updateAcademicDepartment
);

router.get(
  "/",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  AcademicDepartmentControllers.getAllAcademicDepartment
);

export const AcademicDepartmentRoute = router;
