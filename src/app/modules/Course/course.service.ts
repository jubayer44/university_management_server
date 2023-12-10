/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import QueryBuilders from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
import { CourseSearchableFields } from "./course.constant";
import { TCourse, TCourseFaculty } from "./course.interface";
import { Course, CourseFaculty } from "./course.model";
import mongoose from "mongoose";

const createCourseIntoDb = async (payload: TCourse) => {
  const result = await Course.create(payload);
  return result;
};

const getAllCoursesFromDB = async (query: Record<string, unknown>) => {
  const courseQuery = new QueryBuilders(
    Course.find().populate("preRequisitesCourses.course"),
    query
  )
    .search(CourseSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();
  const result = await courseQuery.modelQuery;
  return result;
};

const getSingleCourseFromDB = async (id: string) => {
  const result = Course.findById(id).populate("preRequisitesCourses.course");
  return result;
};

const deleteCourseFromDB = async (id: string) => {
  const result = Course.findByIdAndUpdate(
    id,
    { isDeleted: true },
    {
      new: true,
      runValidators: true,
    }
  );
  return result;
};

const updateCourseInDB = async (id: string, payload: Partial<TCourse>) => {
  const { preRequisitesCourses, ...remainingCourseData } = payload;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    // step-1: basic course info update
    const updatedCourseData = await Course.findByIdAndUpdate(
      id,
      remainingCourseData,
      {
        new: true,
        runValidators: true,
        session,
      }
    );

    if (!updatedCourseData) {
      throw new AppError(httpStatus.BAD_REQUEST, "Course updating failed");
    }

    // step-2: check if there is any pre requisite courses to update
    if (preRequisitesCourses && preRequisitesCourses.length) {
      const deletedPreRequisites = preRequisitesCourses
        .filter((el) => el.course && el.isDeleted)
        .map((el) => el.course);

      const deletedPreRequisitesCourse = await Course.findByIdAndUpdate(
        id,
        {
          $pull: {
            preRequisitesCourses: { course: { $in: deletedPreRequisites } },
          },
        },
        {
          new: true,
          runValidators: true,
          session,
        }
      );

      if (!deletedPreRequisitesCourse) {
        throw new AppError(httpStatus.BAD_REQUEST, "Course updating failed");
      }

      const newPreRequisites = preRequisitesCourses.filter(
        (el) => el.course && !el.isDeleted
      );

      const newPreRequisitesCourse = await Course.findByIdAndUpdate(
        id,
        {
          $addToSet: { preRequisitesCourses: { $each: newPreRequisites } },
        },
        {
          new: true,
          runValidators: true,
          session,
        }
      );

      if (!newPreRequisitesCourse) {
        throw new AppError(httpStatus.BAD_REQUEST, "Course updating failed");
      }
    }
    const result = await Course.findById(id).populate(
      "preRequisitesCourses.course"
    );

    await session.commitTransaction();
    await session.endSession();

    return result;
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, error.message);
  }
};

const assignFacultiesWithCourseIntoDb = async (
  id: string,
  payload: Partial<TCourseFaculty>
) => {
  const result = CourseFaculty.findByIdAndUpdate(
    id,
    {
      course: id,
      $addToSet: { faculties: { $each: payload } },
    },
    {
      upsert: true,
      new: true,
    }
  );
  return result;
};

const removeFacultiesFromCourseFromDb = async (
  id: string,
  payload: Partial<TCourseFaculty>
) => {
  const result = CourseFaculty.findByIdAndUpdate(
    id,
    {
      $pull: { faculties: { $in: payload } },
    },
    {
      new: true,
    }
  );
  return result;
};

export const CourseServices = {
  createCourseIntoDb,
  getAllCoursesFromDB,
  getSingleCourseFromDB,
  deleteCourseFromDB,
  updateCourseInDB,
  assignFacultiesWithCourseIntoDb,
  removeFacultiesFromCourseFromDb,
};
