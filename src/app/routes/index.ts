import { Router } from "express";
import { UserRoute } from "../modules/user/user.route";
import { StudentRoute } from "../modules/student/student.route";
import { AcademicSemesterRoute } from "../modules/academicSemester/academicSemester.route";
import { AcademicFacultyRoute } from "../modules/academicFaculty/academicFaculty.route";
import { AcademicDepartmentRoute } from "../modules/academicDepartment/academicDepartment.route";
import { FacultyRoutes } from "../modules/Faculty/faculty.route";
import { AdminRoutes } from "../modules/Admin/admin.route";
import { CourseRoutes } from "../modules/Course/course.route";
import { SemesterRegistrationRoute } from "../modules/semesterRegistation/semesterRegistration.route";
import { OfferedCourseRoute } from "../modules/OfferedCourse/OfferedCourse.route";
import { AuthRoutes } from "../modules/Auth/auth.route";
import { EnrolledCourseRoutes } from "../modules/EnrolledCourse/EnrolledCourse.route";

const router = Router();

const moduleRoutes = [
  {
    path: "/users",
    route: UserRoute,
  },
  {
    path: "/students",
    route: StudentRoute,
  },
  {
    path: "/faculties",
    route: FacultyRoutes,
  },
  {
    path: "/admins",
    route: AdminRoutes,
  },
  {
    path: "/courses",
    route: CourseRoutes,
  },
  {
    path: "/academic-semesters",
    route: AcademicSemesterRoute,
  },
  {
    path: "/academic-faculty",
    route: AcademicFacultyRoute,
  },
  {
    path: "/academic-departments",
    route: AcademicDepartmentRoute,
  },
  {
    path: "/academic-departments",
    route: AcademicDepartmentRoute,
  },
  {
    path: "/semester-registrations",
    route: SemesterRegistrationRoute,
  },
  {
    path: "/offered-courses",
    route: OfferedCourseRoute,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/enrolled-courses",
    route: EnrolledCourseRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
