import express, { NextFunction, Request, Response } from "express";
import { UserControllers } from "./user.controller";
import { StudentValidations } from "../student/student.validation";
import validationRequest from "../../middlewares/validateRequest";
import { FacultyValidations } from "../Faculty/faculty.validation";
import { AdminValidations } from "../Admin/admin.validation";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "./user.constant";
import { ChangeStatusValidationSchema } from "./user.validation";
import { upload } from "../../utils/sendImageToCloudinary";
const router = express.Router();

router.post(
  "/create-student",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validationRequest(StudentValidations.createStudentValidationSchema),
  UserControllers.createStudent
);

router.post(
  "/create-faculty",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validationRequest(FacultyValidations.createFacultyValidationSchema),
  UserControllers.createFaculty
);

router.post(
  "/create-admin",
  auth(USER_ROLE.superAdmin),
  upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validationRequest(AdminValidations.createAdminValidationSchema),
  UserControllers.createAdmin
);
router.post(
  "/change-status/:id",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validationRequest(ChangeStatusValidationSchema),
  UserControllers.changeStatus
);

router.get(
  "/me",
  auth("superAdmin", "admin", "faculty", "student"),
  UserControllers.getMe
);

export const UserRoute = router;
