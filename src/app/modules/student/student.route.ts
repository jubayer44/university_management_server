import express from "express";
import { studentControllers } from "./student.controller";
const route = express.Router();

route.post("/create-student", studentControllers.createStudent);
route.get("/", studentControllers.getAllStudents);
route.get("/:studentId", studentControllers.getSingleStudent);

export const StudentRoute = route;
