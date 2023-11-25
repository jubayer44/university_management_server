import { NextFunction, Request, Response } from "express";
import { userServices } from "./user.service";

const createStudent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { password, student } = req.body;

    // const jodParseData = studentValidationSchema.parse(student);

    const result = await userServices.createStudentIntoDB(password, student);
    res.status(200).json({
      success: true,
      message: "Student created successfully",
      data: result,
    });

    // eslint-disable-next-line
  } catch (error: any) {
    next(error);
  }
};

export const userControllers = {
  createStudent,
};
