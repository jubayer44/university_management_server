import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { AdminControllers } from "./admin.controller";
import { AdminValidations } from "./admin.validation";
import { USER_ROLE } from "../user/user.constant";
import auth from "../../middlewares/auth";

const router = express.Router();

router.get("/", auth(USER_ROLE.superAdmin), AdminControllers.getAllAdmin);
router.get(
  "/:id",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  AdminControllers.getSingleAdmin
);
router.patch(
  "/:id",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(AdminValidations.updateAdminValidationSchema),
  AdminControllers.updateAdmin
);
router.delete(
  "/:id",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  AdminControllers.deleteSingleAdmin
);

export const AdminRoutes = router;
