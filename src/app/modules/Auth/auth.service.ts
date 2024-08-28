import prisma from "../../utils/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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

  const accessToken = await jwt.sign(
    {
      email: userData?.email,
      role: userData?.role,
      needPasswordChange: userData?.needPasswordChange,
    },
    "safwanaccess",
    { expiresIn: "15m" }
  );

  const refreshToken = await jwt.sign(
    {
      email: userData?.email,
      role: userData?.role,
      needPasswordChange: userData?.needPasswordChange,
    },
    "safwanrefresh",
    { expiresIn: "30d" }
  );

  return { accessToken, refreshToken };
};

export const AuthService = {
  loginUser,
};
