import prisma from "../../utils/prisma";
import bcrypt from "bcrypt";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import generateToken from "../../utils/generateToken";
import verifyToken from "../../utils/verifyToken";
import { UserStatus } from "@prisma/client";
import config from "../../config";
import AppEror from "../../errors/AppError";
import httpStatus from "http-status";

const loginUser = async (payload: { email: string; password: string }) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload?.email,
      status: UserStatus.ACTIVE,
    },
  });

  const isPasswordTrue = await bcrypt.compare(
    payload?.password,
    userData?.password
  );

  if (!isPasswordTrue) {
    throw new Error("Password wrong!");
  }

  const accessToken = generateToken(
    {
      email: userData?.email,
      role: userData?.role,
    },
    config.jwt.accessSecret as string,
    "30d"
  );

  const refreshToken = generateToken(
    {
      email: userData?.email,
      role: userData?.role,
    },
    config.jwt.refreshSecret as string,
    "30d"
  );

  return {
    accessToken,
    refreshToken,
    needPasswordChange: userData?.needPasswordChange,
  };
};

const refreshToken = async (token: string) => {
  let decodedData;
  try {
    decodedData = verifyToken(
      token,
      config.jwt.refreshSecret as string
    ) as JwtPayload;
  } catch (error) {
    throw new Error("Verification failed!");
  }

  const isUserExist = await prisma.user.findUniqueOrThrow({
    where: {
      email: decodedData?.email,
      status: UserStatus.ACTIVE,
    },
  });

  const accessToken = generateToken(
    {
      email: isUserExist?.email,
      role: isUserExist?.role,
    },
    config.jwt.accessSecret as string,
    "30d"
  );

  return {
    accessToken,
    needPasswordChange: isUserExist?.needPasswordChange,
  };
};

const changePassword = async (user: JwtPayload, payload: any) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user?.email,
      status: UserStatus.ACTIVE,
    },
  });

  const isOldPasswordTrue = await bcrypt.compare(
    payload?.oldPassword,
    userData?.password
  );
  if (!isOldPasswordTrue)
    throw new AppEror(httpStatus.FORBIDDEN, "Wrong old password");

  const hashedPassword = await bcrypt.hash(payload?.newPassword, 12);

  const result = await prisma.user.update({
    where: {
      email: user?.email,
    },
    data: {
      password: hashedPassword,
      needPasswordChange: false,
    },
  });

  return result;
};

export const AuthService = {
  loginUser,
  refreshToken,
  changePassword,
};
