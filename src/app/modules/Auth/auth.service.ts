import prisma from "../../utils/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import generateToken from "../../utils/generateToken";

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

export const AuthService = {
  loginUser,
};
