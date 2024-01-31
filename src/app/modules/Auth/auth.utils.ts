import jwt, { JwtPayload } from "jsonwebtoken";

export const createToken = (
  payload: { id: string; role: string },
  secretKey: string,
  expiresIn: string
) => {
  return jwt.sign(payload, secretKey, { expiresIn });
};

export const verifyToken = (token: string, secret: string) => {
  return jwt.verify(token, secret) as JwtPayload;
};
