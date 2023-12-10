import { UserServices } from "./user.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";

const createStudent = catchAsync(async (req, res) => {
  const { password, student } = req.body;

  const result = await UserServices.createStudentIntoDB(password, student);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Create Student successfully",
    data: result,
  });
});

const createFaculty = catchAsync(async (req, res) => {
  const { password, faculty } = req.body;

  const result = await UserServices.createFacultyIntoDB(password, faculty);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Create Faculty successfully",
    data: result,
  });
});
const createAdmin = catchAsync(async (req, res) => {
  const { password, admin } = req.body;

  const result = await UserServices.createAdminIntoDB(password, admin);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Create admin successfully",
    data: result,
  });
});

export const UserControllers = {
  createStudent,
  createFaculty,
  createAdmin,
};
