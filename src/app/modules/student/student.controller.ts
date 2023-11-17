import { Request, Response } from "express";
import { studentServices } from "./student.service";

const createStudent = async (req: Request, res: Response) => {
  try {
    const studentData = req.body.student;
    const result = await studentServices.createStudentIntoDB(studentData);
    res.status(200).json({
      success: true,
      message: "Student created successfully",
      data: result,
    });
  } catch (error) {
    console.log(error); // eslint-disable-line
  }
};

const getAllStudents = async (req: Request, res: Response) => {
  try {
    const result = await studentServices.getAllStudentsFromDb();
    res.status(200).json({
      success: true,
      message: "Get all students successfully",
      data: result,
    });
  } catch (error) {
    console.log(error); // eslint-disable-line
  }
};

const getSingleStudent = async (req: Request, res: Response) => {
  try {
    const studentId = req.params.studentId;
    const result = await studentServices.getSingleStudentFromDb(studentId);
    res.status(200).json({
      success: true,
      message: "Get single student successfully",
      data: result,
    });
  } catch (error) {
    console.log(error); // eslint-disable-line
  }
};

export const studentControllers = {
  createStudent,
  getAllStudents,
  getSingleStudent,
};
