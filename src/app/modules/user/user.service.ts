import config from "../../config";
import { TStudent } from "../student/student.interface";
import { Student } from "../student/student.model";
import { TUser } from "./user.interface";
import { User } from "./user.model";

const createStudentIntoDB = async (password: string, studentData: TStudent) => {
  // create a user object
  const userData: Partial<TUser> = {};

  // if password is not given then set default password
  userData.password = password || (config.default_password as string);

  // set user role
  userData.role = "student";

  // manually generated id
  userData.id = "20300100001";

  // create a new user
  const newUser = await User.create(userData);

  if (Object.keys(newUser).length) {
    studentData.id = newUser.id;
    studentData.user = newUser._id;

    // create a new student
    const newStudent = await Student.create(studentData);
    return newStudent;
  }
};

export const userServices = {
  createStudentIntoDB,
};
