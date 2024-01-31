import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import AppError from "../errors/AppError";
import httpStatus from "http-status";
import config from "../config";
import jwt, { JwtPayload } from "jsonwebtoken";
import { TUserRole } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";

const auth = (...requiredRole: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Your are not authorized!");
    }

    let decoded;

    try {
      decoded = jwt.verify(
        token,
        config.jwt_access_secret as string
      ) as JwtPayload;
    } catch (error) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Your are not authorized!");
    }

    const { id, role, iat } = decoded;

    if (requiredRole?.length && !requiredRole.includes(role)) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Your are not authorized!");
    }

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
      User.isJWTIssuedBeforePasswordChanged(
        user.passwordChangeAt,
        iat as number
      )
    ) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Your are not authorized!");
    }

    req.user = decoded as JwtPayload;

    next();
  });
};

export default auth;
