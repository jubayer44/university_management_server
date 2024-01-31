import config from "../config";
import { USER_ROLE } from "../modules/user/user.constant";
import { User } from "../modules/user/user.model";

const superAdmin = {
  id: "0001",
  email: "admin@ph.com",
  password: config.superAdminPassword,
  role: USER_ROLE.superAdmin,
  status: "in-progress",
  needsPasswordChange: false,
  isDeleted: false,
};

const seedSuperAdmin = async () => {
  // When database is connected we will check if super admin exists
  const isSuperAdminExists = await User.findOne({ role: USER_ROLE.superAdmin });

  if (!isSuperAdminExists) {
    await User.create(superAdmin);
  }
};

export default seedSuperAdmin;
