import { NextFunction, Request, Response } from "express";

const globalErrorHandler = (
  error: any, // eslint-disable-line
  req: Request,
  res: Response,
  next: NextFunction // eslint-disable-line
) => {
  const statusCode = 500;
  const message = error.message || "Something went wrong";
  res.status(statusCode).json({
    success: false,
    status: statusCode,
    message,
  });
};

export default globalErrorHandler;
