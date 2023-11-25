import { NextFunction, Request, Response } from "express";
import { studentServices } from "./student.service";

const getAllStudents = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await studentServices.getAllStudentsFromDb();
    res.status(200).json({
      success: true,
      message: "Get all students successfully",
      data: result,
    });
    // eslint-disable-next-line
  } catch (error: any) {
    next(error);
  }
};

const getSingleStudent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const studentId = req.params.studentId;
    const result = await studentServices.getSingleStudentFromDb(studentId);
    res.status(200).json({
      success: true,
      message: "Get single student successfully",
      data: result,
    });
    // eslint-disable-next-line
  } catch (error: any) {
    next(error);
  }
};

const deleteSingleStudent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const studentId = req.params.studentId;
    const result = await studentServices.deleteSingleStudentFromDb(studentId);
    res.status(200).json({
      success: true,
      message: "Student deleted successfully",
      data: result,
    });
    // eslint-disable-next-line
  } catch (error: any) {
    next(error);
  }
};

export const studentControllers = {
  getAllStudents,
  getSingleStudent,
  deleteSingleStudent,
};
