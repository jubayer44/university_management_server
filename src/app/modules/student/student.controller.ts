import { Request, Response } from "express";
import { studentServices } from "./student.service";
// import studentValidationSchema from "./student.validation";
import studentValidationSchema from "./student.validation";

const createStudent = async (req: Request, res: Response) => {
  try {
    const studentData = req.body.student;

    // // validate data using Joi
    // const { error, value } = studentValidationSchema.validate(studentData);

    // if (error) {
    //   res.status(500).json({
    //     success: false,
    //     message: "Something Went Wrong",
    //     error: error.details,
    //   });
    // }

    const jodParseData = studentValidationSchema.parse(studentData);

    const result = await studentServices.createStudentIntoDB(jodParseData);
    res.status(200).json({
      success: true,
      message: "Student created successfully",
      data: result,
    });

    // eslint-disable-next-line
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Something Went Wrong",
      error: error,
    });
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
    // eslint-disable-next-line
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Something Went Wrong",
      error: error,
    });
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
    // eslint-disable-next-line
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Something Went Wrong",
      error: error,
    });
  }
};

const deleteSingleStudent = async (req: Request, res: Response) => {
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
    res.status(500).json({
      success: false,
      message: error.message || "Something Went Wrong",
      error: error,
    });
  }
};

export const studentControllers = {
  createStudent,
  getAllStudents,
  getSingleStudent,
  deleteSingleStudent,
};
