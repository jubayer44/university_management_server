import mongoose from "mongoose";
import { Student } from "./student.model";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { User } from "../user/user.model";
import { TStudent } from "./student.interface";
import QueryBuilders from "../../builder/QueryBuilder";
import { studentSearchableFields } from "./student.constant";

const getAllStudentsFromDb = async (query: Record<string, unknown>) => {
  // const queryObj = { ...query };
  // const studentSearchableFields = ["email", "name.firstName", "presentAddress"];
  // let searchTerm = "";
  // if (query?.searchTerm) {
  //   searchTerm = query?.searchTerm as string;
  // }

  // const searchQuery = Student.find({
  //   $or: studentSearchableFields.map((field) => ({
  //     [field]: { $regex: searchTerm, $options: "i" },
  //   })),
  // });

  // // filtering
  // const excludedFields = ["searchTerm", "limit", "sort", "page", "fields"];

  // excludedFields.forEach((el) => delete queryObj[el]);

  // const filterQuery = searchQuery
  //   .find(queryObj)
  //   .populate("admissionSemester")
  //   .populate({
  //     path: "academicDepartment",
  //     populate: {
  //       path: "academicFaculty",
  //     },
  //   });

  // let sort = "-createdAt";

  // if (query?.sort) {
  //   sort = query?.sort as string;
  // }

  // const sortQuery = filterQuery.sort(sort);

  // let limit = 1;
  // let page = 1;
  // let skip = 0;

  // if (query?.limit) {
  //   limit = Number(query?.limit);
  // }

  // if (query?.page) {
  //   page = Number(query?.page);
  //   skip = (page - 1) * limit;
  // }

  // const paginateQuery = sortQuery.skip(skip);

  // const limitQuery = paginateQuery.limit(limit);

  // // fields limiting
  // let fields = "__v";

  // if (query?.fields) {
  //   fields = (query?.fields as string).split(",").join(" ");
  // }

  // const fieldsQuery = await limitQuery.select(fields);

  // return fieldsQuery;

  const studentQuery = new QueryBuilders(
    Student.find()
      .populate("admissionSemester")
      .populate({
        path: "academicDepartment",
        populate: {
          path: "academicFaculty",
        },
      }),
    query
  )
    .search(studentSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await studentQuery.modelQuery;
  return result;
};

const getSingleStudentFromDb = async (id: string) => {
  const result = await Student.findById(id)
    .populate("admissionSemester")
    .populate({
      path: "academicDepartment",
      populate: {
        path: "academicFaculty",
      },
    });
  // const result = await Student.aggregate([{ $match: { id: id } }]);
  return result;
};

const deleteSingleStudentFromDb = async (id: string) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const deleteStudent = await Student.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session }
    );

    if (!deleteStudent) {
      throw new AppError(httpStatus.BAD_REQUEST, "Student deleting failed");
    }

    const deleteUser = await User.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session }
    );

    if (!deleteUser) {
      throw new AppError(httpStatus.BAD_REQUEST, "User deleting failed");
    }

    await session.commitTransaction();
    session.endSession();
    return deleteStudent;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, "Student deleting failed");
  }
};

const updateStudentIntoDb = async (id: string, payload: Partial<TStudent>) => {
  const { name, guardian, localGuardian, ...remainingStudentData } = payload;

  const modifiedUpdateData: Record<string, unknown> = {
    ...remainingStudentData,
  };

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdateData[`name.${key}`] = value;
    }
  }

  if (guardian && Object.keys(guardian).length) {
    for (const [key, value] of Object.entries(guardian)) {
      modifiedUpdateData[`guardian.${key}`] = value;
    }
  }

  if (localGuardian && Object.keys(localGuardian).length) {
    for (const [key, value] of Object.entries(localGuardian)) {
      modifiedUpdateData[`localGuardian.${key}`] = value;
    }
  }

  const result = await Student.findOneAndUpdate({ id }, modifiedUpdateData, {
    new: true,
    runValidators: true,
  });
  return result;
};

export const StudentServices = {
  getAllStudentsFromDb,
  getSingleStudentFromDb,
  deleteSingleStudentFromDb,
  updateStudentIntoDb,
};
