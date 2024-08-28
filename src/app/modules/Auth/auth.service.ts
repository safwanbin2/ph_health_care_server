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

  const token = await jwt.sign(
    {
      email: userData?.email,
      role: userData?.role,
    },
    "safwan",
    { expiresIn: "15m" }
  );

  return { token };
};

export const AuthService = {
  loginUser,
};
