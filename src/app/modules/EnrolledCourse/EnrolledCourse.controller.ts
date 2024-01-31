import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { EnrolledCourseServices } from "./EnrolledCourse.service";
import sendResponse from "../../utils/sendResponse";

const createEnrolledCourse = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const result = await EnrolledCourseServices.createEnrolledCourseIntoDb(
    userId,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Enrolled course created successfully",
    data: result,
  });
});
const updateEnrolledCourse = catchAsync(async (req, res) => {
  const facultyId = req?.user?.id;
  const result = await EnrolledCourseServices.updateEnrolledCourseIntoDb(
    facultyId,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Enrolled course updated successfully",
    data: result,
  });
});

export const EnrolledCourseControllers = {
  createEnrolledCourse,
  updateEnrolledCourse,
};
