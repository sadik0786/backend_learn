import jwt from "jsonwebtoken";

import { env } from "../config/env.js";

export const generateToken = (user) => {
  if (!user) {
    throw new Error(
      "User payload is required to generate a token",
    );
  }

  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    env.jwt.secret,
    {
      expiresIn: env.jwt.accessTokenExpiresIn,
    },
  );
};

export const verifyToken = (token) => {
  return jwt.verify(token, env.jwt.secret);
};

export default {
  generateToken,
  verifyToken,
};
