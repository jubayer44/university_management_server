import { UserServices } from "./user.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import AppError from "../../errors/AppError";

const createStudent = catchAsync(async (req, res) => {
  const { password, student } = req.body;

  const result = await UserServices.createStudentIntoDB(
    req.file,
    password,
    student
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Create Student successfully",
    data: result,
  });
});

const createFaculty = catchAsync(async (req, res) => {
  const { password, faculty } = req.body;

  const result = await UserServices.createFacultyIntoDB(
    req?.file,
    password,
    faculty
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Create Faculty successfully",
    data: result,
  });
});
const createAdmin = catchAsync(async (req, res) => {
  const { password, admin } = req.body;

  const result = await UserServices.createAdminIntoDB(
    req?.file,
    password,
    admin
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Create admin successfully",
    data: result,
  });
});

const getMe = catchAsync(async (req, res) => {
  const token = req.headers.authorization;
  if (!token) {
    throw new AppError(httpStatus.NOT_FOUND, "Token not found");
  }

  const { id, role } = req.user;

  const result = await UserServices.getMeFromDB(id, role);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User retrieved successfully",
    data: result,
  });
});

const changeStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const payload = req.body;

  const result = await UserServices.changeStatus(id, payload);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Change user status successfully",
    data: result,
  });
});

export const UserControllers = {
  createStudent,
  createFaculty,
  createAdmin,
  getMe,
  changeStatus,
};
