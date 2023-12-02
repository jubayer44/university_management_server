import { RequestHandler } from "express";
import httpStatus from "http-status";

// eslint-disable-next-line
const notFound: RequestHandler = (req, res, next) => {
  return res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: "Route not found",
    error: "",
  });
};

export default notFound;
