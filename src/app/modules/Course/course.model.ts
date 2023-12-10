import { Schema, model } from "mongoose";
import {
  TCourse,
  TCourseFaculty,
  TPreRequisitesCourses,
} from "./course.interface";

const preRequisitesCoursesSchema = new Schema<TPreRequisitesCourses>({
  course: {
    type: Schema.Types.ObjectId,
    ref: "Course",
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

const courseSchema = new Schema<TCourse>({
  title: {
    type: String,
    unique: true,
    trim: true,
    required: true,
  },
  prefix: {
    type: String,
    trim: true,
    required: true,
  },
  code: {
    type: Number,
    trim: true,
    required: true,
  },
  credits: {
    type: Number,
    trim: true,
    required: true,
  },
  preRequisitesCourses: [preRequisitesCoursesSchema],
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

courseSchema.pre("find", async function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});
courseSchema.pre("findOne", async function (next) {
  this.findOne({ isDeleted: { $ne: true } });
  next();
});

courseSchema.pre("aggregate", async function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

export const Course = model<TCourse>("Course", courseSchema);

const courseFacultySchema = new Schema<TCourseFaculty>({
  course: {
    type: Schema.Types.ObjectId,
    ref: "Course",
    unique: true,
  },
  faculties: [
    {
      type: Schema.Types.ObjectId,
      ref: "AcademicFaculty",
    },
  ],
});

export const CourseFaculty = model<TCourseFaculty>(
  "CourseFaculty",
  courseFacultySchema
);
