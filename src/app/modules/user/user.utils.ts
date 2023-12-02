import { TAcademicSemester } from "../academicSemester/academicSemester.interface";
import { User } from "./user.model";

const findLastStudentId = async () => {
  const lastStudent = await User.findOne(
    {
      role: "student",
    },
    {
      id: 1,
      _id: 0,
    }
  )
    .sort({
      createdAt: -1,
    })
    .lean();

  //203001   0001
  return lastStudent?.id ? lastStudent.id.substring(6) : undefined;
};

export const generateStudentId = async (payload: TAcademicSemester | null) => {
  // first time 0000
  //0001  => 1
  let currentId = (0).toString(); // 0000 default id

  const lastStudentId = await findLastStudentId();

  const lastStudentSemesterCode = lastStudentId?.substring(4, 6); // 01
  const lastStudentYear = lastStudentId?.substring(0, 4); // 2023
  const currentStudentSemesterCode = payload?.code; // 01
  const currentStudentYear = payload?.year; // 2023

  if (
    lastStudentId &&
    currentStudentSemesterCode === lastStudentSemesterCode &&
    currentStudentYear === lastStudentYear
  ) {
    currentId = lastStudentId.substring(6); // 0001
  }

  let incrementId = (Number(currentId) + 1).toString().padStart(4, "0");

  incrementId = `${payload?.year}${payload?.code}${incrementId}`;

  return incrementId;
};
