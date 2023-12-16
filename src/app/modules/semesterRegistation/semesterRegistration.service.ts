import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { AcademicSemester } from "../academicSemester/academicSemester.model";
import { TSemesterRegistration } from "./semesterRegistration.interface";
import { SemesterRegistration } from "./semesterRegistration.model";
import QueryBuilders from "../../builder/QueryBuilder";
import { RegistrationStatus } from "./semesterRegistration.constant";

const createSemesterRegistrationIntoDb = async (
  payload: TSemesterRegistration
) => {
  const academicSemester = payload?.academicSemester;

  // check is there any UPCOMING or ONGOING academic semester

  const isUpcomingOrOngoingSemester = await SemesterRegistration.findOne({
    $or: [
      { status: RegistrationStatus.UPCOMING },
      { status: RegistrationStatus.ONGOING },
    ],
  });

  if (isUpcomingOrOngoingSemester) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `There is already a ${isUpcomingOrOngoingSemester.status} registered Semester`
    );
  }

  // check if academic semester exist or not
  const isAcademicSemesterExist = await AcademicSemester.findById(
    academicSemester
  );

  if (!isAcademicSemesterExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Academic semester not found");
  }

  // check if semester already registered or not
  const isSemesterRegistrationExists = await AcademicSemester.findOne({
    academicSemester,
  });

  if (isSemesterRegistrationExists) {
    throw new AppError(
      httpStatus.CONFLICT,
      "Semester registration already exists"
    );
  }

  const result = await SemesterRegistration.create(payload);

  return result;
};

const getAllSemesterRegistrationsFromDb = async (
  query: Record<string, unknown>
) => {
  const semesterRegistrationQuery = new QueryBuilders(
    SemesterRegistration.find(),
    query
  )
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await semesterRegistrationQuery.modelQuery;

  return result;
};

const getSingleSemesterRegistrationsFromDb = async (id: string) => {
  const result = await SemesterRegistration.findById(id);

  return result;
};

const updateSemesterRegistrationIntoDb = async (
  id: string,
  payload: Partial<TSemesterRegistration>
) => {
  const isSemesterRegistrationExists = await SemesterRegistration.findById(id);
  const requestedStatus = payload?.status;

  if (!isSemesterRegistrationExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Semester not found");
  }

  const currentSemesterStatus = isSemesterRegistrationExists?.status;

  if (currentSemesterStatus === RegistrationStatus.ENDED) {
    throw new AppError(httpStatus.BAD_REQUEST, "Semester already ended");
  }

  if (
    currentSemesterStatus === RegistrationStatus.UPCOMING &&
    requestedStatus === RegistrationStatus.ENDED
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `You can't directly change ${currentSemesterStatus} to ${requestedStatus}`
    );
  }

  if (
    currentSemesterStatus === RegistrationStatus.ONGOING &&
    requestedStatus === RegistrationStatus.UPCOMING
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `You can't directly change ${currentSemesterStatus} to ${requestedStatus}`
    );
  }

  const result = await SemesterRegistration.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return result;
};

export const SemesterRegistrationServices = {
  createSemesterRegistrationIntoDb,
  getAllSemesterRegistrationsFromDb,
  getSingleSemesterRegistrationsFromDb,
  updateSemesterRegistrationIntoDb,
};
