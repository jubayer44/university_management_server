import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { User } from "../user/user.model";
import { TLoginUser } from "./auth.interface";
import config from "../../config";
import bcrypt from "bcrypt";
import { createToken, verifyToken } from "./auth.utils";
import { JwtPayload } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import sendEmail from "../../utils/sendEmail";

const loginUser = async (payload: TLoginUser) => {
  const { id, password } = payload;

  const user = await User.isUserExists(id);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User is not found");
  }

  if (!(await User.isPasswordMatched(password, user.password))) {
    throw new AppError(httpStatus.FORBIDDEN, "Password is not matched");
  }

  const isUserDeleted = user.isDeleted;
  if (isUserDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, "This user is deleted");
  }

  const userStatus = user.status;

  if (userStatus === "blocked") {
    throw new AppError(httpStatus.BAD_REQUEST, "This user is blocked");
  }

  const jwtPayload = {
    id: user?.id,
    role: user?.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expiration as string
  );
  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expiration as string
  );

  return {
    accessToken,
    refreshToken,
    needsPasswordChange: user?.needsPasswordChange,
  };
};

const changePassword = async (
  userData: JwtPayload,
  payload: { oldPassword: string; newPassword: string }
) => {
  const user = await User.isUserExists(userData?.id);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User is not found");
  }

  if (!(await User.isPasswordMatched(payload?.oldPassword, user.password))) {
    throw new AppError(httpStatus.FORBIDDEN, "Password is not matched");
  }

  const isUserDeleted = user.isDeleted;
  if (isUserDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, "This user is deleted");
  }

  const userStatus = user.status;

  if (userStatus === "blocked") {
    throw new AppError(httpStatus.BAD_REQUEST, "This user is blocked");
  }

  const hashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds)
  );

  await User.findOneAndUpdate(
    {
      id: userData.id,
      role: userData.role,
    },
    {
      password: hashedPassword,
      needsPasswordChange: false,
      passwordChangeAt: new Date(),
    }
  );

  return;
};

const refreshToken = async (token: string) => {
  const decoded = verifyToken(token, config.jwt_refresh_secret as string);

  const { id, iat } = decoded;

  const user = await User.isUserExists(id);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User is not found");
  }

  const isUserDeleted = user.isDeleted;
  if (isUserDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, "This user is deleted");
  }

  const userStatus = user.status;

  if (userStatus === "blocked") {
    throw new AppError(httpStatus.BAD_REQUEST, "This user is blocked");
  }

  if (
    user?.passwordChangeAt &&
    User.isJWTIssuedBeforePasswordChanged(user.passwordChangeAt, iat as number)
  ) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Your are not authorized!");
  }

  const jwtPayload = {
    id: user?.id,
    role: user?.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expiration as string
  );

  return {
    accessToken,
  };
};

const forgatPassword = async (id: string) => {
  const user = await User.isUserExists(id);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User is not found");
  }

  const isUserDeleted = user.isDeleted;
  if (isUserDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, "This user is deleted");
  }

  const userStatus = user.status;

  if (userStatus === "blocked") {
    throw new AppError(httpStatus.BAD_REQUEST, "This user is blocked");
  }

  const jwtPayload = {
    id: user?.id,
    role: user?.role,
  };

  const resetToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    "10m"
  );

  const resetUiLink = `${config.reset_pass_ui_link}id=${user?.id}&token=${resetToken}`;

  sendEmail(user?.email, resetUiLink);
};

const resetPassword = async (
  payload: { id: string; newPassword: string },
  token: string | undefined
) => {
  const user = await User.isUserExists(payload?.id);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User is not found");
  }

  const isUserDeleted = user.isDeleted;
  if (isUserDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, "This user is deleted");
  }

  const userStatus = user.status;

  if (userStatus === "blocked") {
    throw new AppError(httpStatus.BAD_REQUEST, "This user is blocked");
  }

  const decoded = jwt.verify(
    token as string,
    config.jwt_access_secret as string
  ) as JwtPayload;

  const hashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds)
  );

  await User.findOneAndUpdate(
    {
      id: decoded.id,
      role: decoded.role,
    },
    {
      password: hashedPassword,
      needsPasswordChange: false,
      passwordChangeAt: new Date(),
    }
  );

  return;
};

export const AuthServices = {
  loginUser,
  changePassword,
  refreshToken,
  forgatPassword,
  resetPassword,
};
