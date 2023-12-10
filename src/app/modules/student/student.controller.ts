import { StudentServices } from "./student.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";

const getAllStudents = catchAsync(async (req, res) => {
  const query = req?.query;
  const result = await StudentServices.getAllStudentsFromDb(query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Get all students successfully",
    data: result,
  });
});

const getSingleStudent = catchAsync(async (req, res) => {
  const studentId = req.params.studentId;
  const result = await StudentServices.getSingleStudentFromDb(studentId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Get single student successfully",
    data: result,
  });
});

const deleteSingleStudent = catchAsync(async (req, res) => {
  const studentId = req.params.studentId;
  const result = await StudentServices.deleteSingleStudentFromDb(studentId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Student deleted successfully",
    data: result,
  });
});
const updateStudent = catchAsync(async (req, res) => {
  const studentId = req.params.studentId;
  const { student } = req.body;
  const result = await StudentServices.updateStudentIntoDb(studentId, student);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Student updated successfully",
    data: result,
  });
});

export const StudentControllers = {
  getAllStudents,
  getSingleStudent,
  deleteSingleStudent,
  updateStudent,
};
