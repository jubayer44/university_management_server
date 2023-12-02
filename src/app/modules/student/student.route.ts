import express from "express";
import { studentControllers } from "./student.controller";
const route = express.Router();

route.get("/", studentControllers.getAllStudents);
route.get("/:studentId", studentControllers.getSingleStudent);
route.patch("/:studentId", studentControllers.updateStudent);
route.delete("/:studentId", studentControllers.deleteSingleStudent);
export const StudentRoute = route;
