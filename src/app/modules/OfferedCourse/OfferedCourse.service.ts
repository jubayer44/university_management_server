import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { Course } from "../Course/course.model";
import { Faculty } from "../Faculty/faculty.model";
import { AcademicDepartment } from "../academicDepartment/academicDepartment.model";
import { AcademicFaculty } from "../academicFaculty/academicFaculty.model";
import { SemesterRegistration } from "../semesterRegistation/semesterRegistration.model";
import { TOfferedCourse } from "./OfferedCourse.interface";
import { OfferedCourse } from "./OfferedCourse.model";
import { isTimeConflict } from "./OfferedCourse.utils";

const createOfferedCourseIntoDb = async (payload: TOfferedCourse) => {
  const {
    semesterRegistration,
    academicFaculty,
    academicDepartment,
    course,
    faculty,
    section,
    days,
    startTime,
    endTime,
  } = payload;

  const isSemesterRegistrationExists = await SemesterRegistration.findById(
    semesterRegistration
  );

  if (!isSemesterRegistrationExists) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Semester Registration is not found"
    );
  }

  const academicSemester = isSemesterRegistrationExists.academicSemester;

  const isAcademicFacultyExists = await AcademicFaculty.findById(
    academicFaculty
  );

  if (!isAcademicFacultyExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Academic Faculty is not found");
  }

  const isAcademicDepartmentExists = await AcademicDepartment.findById(
    academicDepartment
  );

  if (!isAcademicDepartmentExists) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Academic department is not found"
    );
  }

  const isCourseExists = await Course.findById(course);

  if (!isCourseExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Course is not found");
  }

  const isFacultyExists = await Faculty.findById(faculty);

  if (!isFacultyExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Faculty is not found");
  }

  const isDepartmentBelongsToFaculty = await AcademicDepartment.findOne({
    _id: academicDepartment,
    academicFaculty,
  });

  if (!isDepartmentBelongsToFaculty) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `${isAcademicDepartmentExists.name} is not belongs to ${isAcademicFacultyExists.name}`
    );
  }

  const isSameSemesterRegistrationCourseSection = await OfferedCourse.findOne({
    semesterRegistration,
    course,
    section,
  });

  if (isSameSemesterRegistrationCourseSection) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Course is already offered in this semester registration"
    );
  }

  // get the schedule of the faculties

  const assignSchedules = await OfferedCourse.find({
    semesterRegistration,
    faculty,
    days: { $in: days },
  }).select("days startTime endTime");

  const newSchedule = {
    days,
    startTime,
    endTime,
  };

  if (isTimeConflict(assignSchedules, newSchedule)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `This faculty is not available at this time. Please choose another time.`
    );
  }

  const result = await OfferedCourse.create({ ...payload, academicSemester });

  return result;
};

const updateOfferedCourseIntoDb = async (
  id: string,
  payload: Pick<TOfferedCourse, "faculty" | "days" | "startTime" | "endTime">
) => {
  const { faculty, days, startTime, endTime } = payload;

  const isOfferedCourseExists = await OfferedCourse.findById(id);

  if (!isOfferedCourseExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Offered course is not found");
  }

  const isFacultyExists = await Faculty.findById(faculty);

  if (!isFacultyExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Faculty is not found");
  }

  const semesterRegistration = isOfferedCourseExists.semesterRegistration;

  const semesterRegistrationStatus = await SemesterRegistration.findById(
    semesterRegistration
  );

  if (semesterRegistrationStatus?.status !== "UPCOMING") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You can't Update this offered Course"
    );
  }

  // get the schedule of the faculties

  const assignSchedules = await OfferedCourse.find({
    semesterRegistration,
    faculty,
    days: { $in: days },
  }).select("days startTime endTime");

  const newSchedule = {
    days,
    startTime,
    endTime,
  };

  if (isTimeConflict(assignSchedules, newSchedule)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `This faculty is not available at this time. Please choose another time.`
    );
  }
};

export const OfferedCourseServices = {
  createOfferedCourseIntoDb,
  updateOfferedCourseIntoDb,
};
