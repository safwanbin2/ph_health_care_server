import jwt from "jsonwebtoken";

const verifyToken = (token: string, secret: string) => {
  const decoded = jwt.verify(token, secret);

  return decoded;
};

export default verifyToken;
