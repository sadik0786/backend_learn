import bcrypt, { hash } from "bcrypt";
import { generateToken } from "../../utils/jwt.js";
import { AppError } from "../../utils/AppError.js";
import {
  registerUser,
  checkEmailExists,
  getUserByEmail,
  getUserById,
} from "./auth.repository.js";

// register
export async function register(data) {
  const existingUser = await checkEmailExists(data.email);

  if (existingUser) {
    throw new AppError("Email already exists", 409);
  }
  const passwordHash = await hash(data.password, 10);
  await registerUser(data.full_name, data.email, passwordHash);
  return {
    success: true,
    message: "User Registered",
  };
}
// login
export async function login(data) {
  const user = await getUserByEmail(data.email);
  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }
  const isMatch = await bcrypt.compare(data.password, user.password_hash);
  if (!isMatch) {
    throw new Error("Invalid email or password");
  }
  const token = generateToken(user);

  return {
    success: true,
    token,
    user: {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      role: user.role,
    },
  };
}
// profile
export async function profile(id) {
  return await getUserById(id);
}
