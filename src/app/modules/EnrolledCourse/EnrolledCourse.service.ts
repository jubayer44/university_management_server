/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { OfferedCourse } from "../OfferedCourse/OfferedCourse.model";
import { TEnrolledCourse } from "./EnrolledCourse.interface";
import EnrolledCourse from "./EnrolledCourse.model";
import { Student } from "../student/student.model";
import mongoose from "mongoose";
import { SemesterRegistration } from "../semesterRegistation/semesterRegistration.model";
import { Course } from "../Course/course.model";
import { Faculty } from "../Faculty/faculty.model";
import { calculateGradePoints } from "./EnrolledCourse.utils";

const createEnrolledCourseIntoDb = async (
  userId: string,
  payload: TEnrolledCourse
) => {
  /*
step1: check if the offered course is exists.
step2: check if the student is already enrolled in the offered course.
step3: create the enrolled course.
*/

  const { offeredCourse } = payload;

  const isOfferedCourserExists = await OfferedCourse.findById(offeredCourse);

  if (!isOfferedCourserExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Offered course is not found");
  }

  const course = await Course.findById(isOfferedCourserExists.course);

  if (isOfferedCourserExists?.maxCapacity <= 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "This course is full");
  }

  const student = await Student.findOne({ id: userId }, { _id: 1 });

  if (!student) {
    throw new AppError(httpStatus.NOT_FOUND, "Student is not found");
  }

  const semesterRegistration = isOfferedCourserExists.semesterRegistration;

  const isStudentAlreadyEnrolled = await EnrolledCourse.findOne({
    semesterRegistration,
    offeredCourse,
    student: student._id,
  });

  if (isStudentAlreadyEnrolled) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Student is already enrolled in this course"
    );
  }

  const semesterRegistrations = await SemesterRegistration.findById(
    isOfferedCourserExists.semesterRegistration
  ).select("maxCredit");

  const maxCredit = semesterRegistrations?.maxCredit;

  const enrolledCourses = await EnrolledCourse.aggregate([
    {
      $match: {
        semesterRegistration: isOfferedCourserExists.semesterRegistration,
        student: student._id,
      },
    },
    {
      $lookup: {
        from: "courses",
        localField: "course",
        foreignField: "_id",
        as: "enrolledCourseData",
      },
    },
    {
      $unwind: "$enrolledCourseData",
    },
    {
      $group: {
        _id: null,
        totalEnrolledCredits: { $sum: "$enrolledCourseData.credits" },
      },
    },
    {
      $project: {
        _id: 0,
        totalEnrolledCredits: 1,
      },
    },
  ]);

  // Total enrolled credits + new enrolled credit > maxCredit

  const totalCredits =
    enrolledCourses?.length > 0 ? enrolledCourses[0].totalEnrolledCredits : 0;

  if (totalCredits && maxCredit && totalCredits + course?.credits > maxCredit) {
    throw new AppError(httpStatus.BAD_REQUEST, "This course is full");
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const result = await EnrolledCourse.create(
      [
        {
          semesterRegistration: isOfferedCourserExists.semesterRegistration,
          academicSemester: isOfferedCourserExists.academicSemester,
          academicFaculty: isOfferedCourserExists.academicFaculty,
          academicDepartment: isOfferedCourserExists.academicDepartment,
          offeredCourse: offeredCourse,
          course: isOfferedCourserExists.course,
          student: student._id,
          faculty: isOfferedCourserExists.faculty,
          isEnrolled: true,
        },
      ],
      { session }
    );

    if (!result) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Enrolled course created failed"
      );
    }

    await OfferedCourse.findByIdAndUpdate(
      offeredCourse,
      {
        maxCapacity: isOfferedCourserExists.maxCapacity - 1,
      },
      { new: true, session }
    );

    await session.commitTransaction();
    session.endSession();

    return result;
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Enrolled course created failed"
    );
  }
};

const updateEnrolledCourseIntoDb = async (
  facultyId: string,
  payload: Partial<TEnrolledCourse>
) => {
  const { semesterRegistration, offeredCourse, student, courseMarks } = payload;

  const isSemesterRegistrationExists = await SemesterRegistration.findById(
    semesterRegistration
  );

  if (!isSemesterRegistrationExists) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Semester Registration is not found"
    );
  }

  const isOfferedCourseExists = await OfferedCourse.findById(offeredCourse);

  if (!isOfferedCourseExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Offered course is not found");
  }

  const isStudentExists = await Student.findById(student);

  if (!isStudentExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Student is not found");
  }

  const faculty = await Faculty.findOne({ id: facultyId }, { _id: 1 });

  if (!faculty) {
    throw new AppError(httpStatus.NOT_FOUND, "Faculty is not found");
  }

  const isCourseBelongsToFaculty = await EnrolledCourse.findOne({
    semesterRegistration,
    offeredCourse,
    student,
    faculty: faculty._id,
  });

  if (!isCourseBelongsToFaculty) {
    throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized");
  }

  const modifiedData: Record<string, unknown> = {
    ...courseMarks,
  };

  if (courseMarks?.finalTerm) {
    const { classTest1, classTest2, midTerm, finalTerm } =
      isCourseBelongsToFaculty.courseMarks;

    const totalMarks =
      Math.ceil(classTest1 * 0.1) +
      Math.ceil(classTest2 * 0.1) +
      Math.ceil(midTerm * 0.3) +
      Math.ceil(finalTerm * 0.5);

    const result = calculateGradePoints(totalMarks);

    modifiedData.grade = result.grade;
    modifiedData.gradePoints = result.gradePoints;
  }

  if (courseMarks && Object.keys(courseMarks).length) {
    for (const [key, value] of Object.entries(courseMarks)) {
      modifiedData[`courseMarks.${key}`] = value;
    }
  }

  const result = await EnrolledCourse.findByIdAndUpdate(
    isCourseBelongsToFaculty._id,
    modifiedData,
    {
      new: true,
    }
  );
  return result;
};
export const EnrolledCourseServices = {
  createEnrolledCourseIntoDb,
  updateEnrolledCourseIntoDb,
};
