import prisma from "../../utils/prisma";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import generateToken from "../../utils/generateToken";
import verifyToken from "../../utils/verifyToken";

const loginUser = async (payload: { email: string; password: string }) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload?.email,
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
    "safwanaccess",
    "5m"
  );

  const refreshToken = generateToken(
    {
      email: userData?.email,
      role: userData?.role,
    },
    "safwanrefresh",
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
    decodedData = verifyToken(token, "safwanrefresh") as JwtPayload;
  } catch (error) {
    throw new Error("Verification failed!");
  }

  const isUserExist = await prisma.user.findUniqueOrThrow({
    where: {
      email: decodedData?.email,
    },
  });

  const accessToken = generateToken(
    {
      email: isUserExist?.email,
      role: isUserExist?.role,
    },
    "safwanaccess",
    "5m"
  );

  return {
    accessToken,
    refreshToken,
    needPasswordChange: isUserExist?.needPasswordChange,
  };
};

export const AuthService = {
  loginUser,
  refreshToken,
};
