import express from "express";
import { studentControllers } from "./student.controller";
const route = express.Router();

route.get("/", studentControllers.getAllStudents);
route.get("/:studentId", studentControllers.getSingleStudent);
route.delete("/:studentId", studentControllers.deleteSingleStudent);

export const StudentRoute = route;
